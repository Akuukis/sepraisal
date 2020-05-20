#bin/bash

set -x

# Linux only (because paths, feel free to improve).
# first cd to sepraisal/workspaces/praisal/vendor.

STEAM_DIR=$1
SE_DIR="$STEAM_DIR/steamapps/common/SpaceEngineers"
DATA_DIR="$SE_DIR/Content/Data"

# Vanilla
FOLDER=Vanilla
cp "$DATA_DIR/Blueprints.sbc" "$FOLDER"
cp "$DATA_DIR/Components.sbc" "$FOLDER"
cp "$DATA_DIR/PhysicalItems.sbc" "$FOLDER"
find "$DATA_DIR/CubeBlocks" -name *.sbc\
    | grep -v 'Frostbite'\
    | grep -v 'Economy'\
    | grep -v 'DecorativePack'\
    | xargs cp -t "$FOLDER/CubeBlocks"
find "$FOLDER" -name *.sbc | xargs sed -i 's/\r$//'  # Change CRLF to LF.

# Decorative Pack 1
FOLDER=DecorativePack
cp "$DATA_DIR/CubeBlocks/CubeBlocks_$FOLDER.sbc" "$FOLDER/CubeBlocks.sbc"
find "$FOLDER" -name *.sbc | xargs sed -i 's/\r$//'  # Change CRLF to LF.

# Decorative Pack 2
FOLDER=DecorativePack2
cp "$DATA_DIR/CubeBlocks/CubeBlocks_$FOLDER.sbc" "$FOLDER/CubeBlocks.sbc"
find "$FOLDER" -name *.sbc | xargs sed -i 's/\r$//'  # Change CRLF to LF.

# Economy
FOLDER=Economy
cp "$DATA_DIR/Blueprints_$FOLDER.sbc" "$FOLDER/Blueprints.sbc"
cp "$DATA_DIR/Components_$FOLDER.sbc" "$FOLDER/Components.sbc"
cp "$DATA_DIR/PhysicalItems_$FOLDER.sbc" "$FOLDER/PhysicalItems.sbc"
cp "$DATA_DIR/CubeBlocks/CubeBlocks_$FOLDER.sbc" "$FOLDER/CubeBlocks.sbc"
find "$FOLDER" -name *.sbc | xargs sed -i 's/\r$//'  # Change CRLF to LF.

# Frostbite
FOLDER=Frostbite
cp "$DATA_DIR/CubeBlocks/CubeBlocks_$FOLDER.sbc" "$FOLDER/CubeBlocks.sbc"
find "$FOLDER" -name *.sbc | xargs sed -i 's/\r$//'  # Change CRLF to LF.
