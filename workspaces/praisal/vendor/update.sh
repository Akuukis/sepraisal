#bin/bash

set -x

# Linux only (because paths, feel free to improve).
# first cd to sepraisal/workspaces/praisal/vendor.

STEAM_DIR=$1
SE_DIR="$STEAM_DIR/steamapps/common/SpaceEngineers"
DATA_DIR="$SE_DIR/Content/Data"

cp "$DATA_DIR/Blueprints.sbc" Vanilla
cp "$DATA_DIR/Components.sbc" Vanilla
cp "$DATA_DIR/PhysicalItems.sbc" Vanilla
find "$DATA_DIR/CubeBlocks" -name *.sbc\
    | grep -v 'Frostbite'\
    | grep -v 'Economy'\
    | grep -v 'DecorativePack'\
    | xargs cp -t Vanilla/CubeBlocks
find Vanilla -name *.sbc | xargs sed -i 's/\r$//'  # Change CRLF to LF.

