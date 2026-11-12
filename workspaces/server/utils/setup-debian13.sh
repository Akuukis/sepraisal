#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
SERVER_DIR="$(cd "$SCRIPT_DIR/.." && pwd -P)"
REPO_ROOT="$(cd "$SERVER_DIR/../.." && pwd -P)"

SERVICE_NAME="sepraisal"
SERVICE_USER="sepraisal"
INSTALL_ROOT="/srv/sepraisal"
SKIP_MONGODB=0
SKIP_REINDEX=0
FORCE_BOOKWORM_MONGODB_REPO=0

log() {
    printf '[setup] %s\n' "$*"
}

fail() {
    printf '[setup] %s\n' "$*" >&2
    exit 1
}

usage() {
    cat <<'EOF'
Usage: setup-debian13.sh [options]

Sets up the SEPraisal server workspace on Debian.

Options:
  --install-root PATH                Install the repo into PATH. Default: /srv/sepraisal
  --service-user USER                Run the service as USER. Default: sepraisal
  --skip-mongodb                     Do not install or start MongoDB
  --skip-reindex                     Do not run yarn reindex
  --force-bookworm-mongodb-repo      On Debian 13, use MongoDB's Debian 12 apt repo anyway
  --help                             Show this help text

Notes:
  - Run this script as root.
  - The MongoDB 8.0 Debian docs currently list Debian 12 support. On Debian 13,
    this script refuses to configure MongoDB unless you pass
    --force-bookworm-mongodb-repo or skip MongoDB setup.
EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --install-root)
                [[ $# -ge 2 ]] || fail "Missing value for --install-root"
                INSTALL_ROOT="$2"
                shift 2
                ;;
            --service-user)
                [[ $# -ge 2 ]] || fail "Missing value for --service-user"
                SERVICE_USER="$2"
                shift 2
                ;;
            --skip-mongodb)
                SKIP_MONGODB=1
                shift
                ;;
            --skip-reindex)
                SKIP_REINDEX=1
                shift
                ;;
            --force-bookworm-mongodb-repo)
                FORCE_BOOKWORM_MONGODB_REPO=1
                shift
                ;;
            --help)
                usage
                exit 0
                ;;
            *)
                fail "Unknown option: $1"
                ;;
        esac
    done
}

require_root() {
    [[ ${EUID} -eq 0 ]] || fail "Run this script as root."
}

load_os_release() {
    [[ -r /etc/os-release ]] || fail "Could not read /etc/os-release"
    # shellcheck disable=SC1091
    . /etc/os-release

    [[ "${ID:-}" == "debian" ]] || fail "This script only supports Debian."

    if [[ "${VERSION_ID:-}" != "13" ]]; then
        log "Expected Debian 13, found Debian ${VERSION_ID:-unknown}. Continuing anyway."
    fi
}

apt_install() {
    DEBIAN_FRONTEND=noninteractive apt-get install -y "$@"
}

ensure_base_packages() {
    log "Installing base packages"
    apt-get update
    apt_install ca-certificates curl git gnupg nodejs npm rsync
    corepack enable
}

ensure_mongodb() {
    local mongo_repo_suite

    (( SKIP_MONGODB )) && return 0

    mongo_repo_suite="bookworm"

    if [[ "${VERSION_ID:-}" == "13" ]] && (( FORCE_BOOKWORM_MONGODB_REPO == 0 )); then
        fail "MongoDB's official Debian docs do not currently list Debian 13 support. Re-run with --force-bookworm-mongodb-repo to use the Debian 12 repo anyway, or use --skip-mongodb if MongoDB is already installed."
    fi

    log "Configuring MongoDB apt repository"
    rm -f /usr/share/keyrings/mongodb-server-8.0.gpg
    curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
        gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor

    cat > /etc/apt/sources.list.d/mongodb-org-8.0.list <<EOF
deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/debian ${mongo_repo_suite}/mongodb-org/8.0 main
EOF

    apt-get update
    apt_install mongodb-org

    log "Starting MongoDB"
    systemctl daemon-reload
    systemctl enable --now mongod
}

ensure_service_user() {
    if id -u "$SERVICE_USER" >/dev/null 2>&1; then
        log "Using existing service user $SERVICE_USER"
    else
        log "Creating service user $SERVICE_USER"
        useradd --system --home-dir "$INSTALL_ROOT" --shell /usr/sbin/nologin --user-group "$SERVICE_USER"
    fi

    SERVICE_GROUP="$(id -gn "$SERVICE_USER")"
    install -d -o "$SERVICE_USER" -g "$SERVICE_GROUP" "$INSTALL_ROOT"
}

sync_repo() {
    local install_root_real=""

    if [[ -d "$INSTALL_ROOT" ]]; then
        install_root_real="$(cd "$INSTALL_ROOT" && pwd -P)"
    fi

    if [[ "$REPO_ROOT" == "$install_root_real" ]]; then
        log "Repo is already in the install root"
    else
        log "Copying repo to $INSTALL_ROOT"
        rsync -a \
            --exclude '.git/' \
            --exclude 'node_modules/' \
            --exclude '.env' \
            "$REPO_ROOT"/ "$INSTALL_ROOT"/
    fi

    chown -R "$SERVICE_USER:$SERVICE_GROUP" "$INSTALL_ROOT"
}

run_as_service_user() {
    runuser -u "$SERVICE_USER" -- bash -lc "$1"
}

ensure_env_file() {
    local env_file="$INSTALL_ROOT/workspaces/server/.env"
    local env_example="$INSTALL_ROOT/workspaces/server/.env.example"

    if [[ -f "$env_file" ]]; then
        return 0
    fi

    log "Creating workspaces/server/.env from .env.example"
    install -o "$SERVICE_USER" -g "$SERVICE_GROUP" -m 0644 "$env_example" "$env_file"
}

ensure_script_permissions() {
    log "Making service launcher executable"
    chmod 0755 "$INSTALL_ROOT/workspaces/server/utils/start.sh"
}

install_node_dependencies() {
    log "Installing node dependencies"
    run_as_service_user "cd '$INSTALL_ROOT' && yarn install"

    log "Building the monorepo"
    run_as_service_user "cd '$INSTALL_ROOT' && yarn build"
}

initialize_database() {
    (( SKIP_REINDEX )) && return 0

    log "Initializing MongoDB collection and indexes"
    run_as_service_user "cd '$INSTALL_ROOT/workspaces/server' && yarn initdb"
}

install_service() {
    log "Installing systemd service"
    install -m 0644 "$INSTALL_ROOT/workspaces/server/sepraisal.service" "/etc/systemd/system/${SERVICE_NAME}.service"

    cat > "/etc/default/${SERVICE_NAME}" <<EOF
SEPRAISAL_ROOT=${INSTALL_ROOT}
EOF

    if [[ "$SERVICE_USER" != "sepraisal" ]]; then
        install -d "/etc/systemd/system/${SERVICE_NAME}.service.d"
        cat > "/etc/systemd/system/${SERVICE_NAME}.service.d/override.conf" <<EOF
[Service]
User=${SERVICE_USER}
Group=${SERVICE_GROUP}
EOF
    else
        rm -f "/etc/systemd/system/${SERVICE_NAME}.service.d/override.conf"
    fi

    systemctl daemon-reload
    systemctl enable --now "$SERVICE_NAME"
}

print_summary() {
    cat <<EOF

Setup finished.

Service:       ${SERVICE_NAME}
Service user:  ${SERVICE_USER}
Install root:  ${INSTALL_ROOT}

Useful commands:
  systemctl status mongod
  systemctl status ${SERVICE_NAME}
  journalctl -u ${SERVICE_NAME} -f
EOF
}

main() {
    parse_args "$@"
    require_root
    load_os_release
    ensure_base_packages
    ensure_mongodb
    ensure_service_user
    sync_repo
    ensure_env_file
    ensure_script_permissions
    install_node_dependencies
    initialize_database
    install_service
    print_summary
}

main "$@"
