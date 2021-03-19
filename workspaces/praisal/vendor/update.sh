#!/bin/bash

set -x

toUnicode() {
    FILENAME=$1
    temp_file=$(mktemp)
    cp $FILENAME $temp_file
    uconv -f utf8 -t utf8 --remove-signature $temp_file -o $FILENAME
}

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
    | grep -v 'SparksOfTheFuturePack'\
    | grep -v 'ScrapRacePack'\
    | xargs cp -t "$FOLDER/CubeBlocks"

# Decorative Pack 1
FOLDER=DecorativePack
cp "$DATA_DIR/CubeBlocks/CubeBlocks_$FOLDER.sbc" "$FOLDER/CubeBlocks.sbc"

# Decorative Pack 2
FOLDER=DecorativePack2
cp "$DATA_DIR/CubeBlocks/CubeBlocks_$FOLDER.sbc" "$FOLDER/CubeBlocks.sbc"

# Economy
FOLDER=Economy
cp "$DATA_DIR/Blueprints_$FOLDER.sbc" "$FOLDER/Blueprints.sbc"
cp "$DATA_DIR/Components_$FOLDER.sbc" "$FOLDER/Components.sbc"
cp "$DATA_DIR/PhysicalItems_$FOLDER.sbc" "$FOLDER/PhysicalItems.sbc"
cp "$DATA_DIR/CubeBlocks/CubeBlocks_$FOLDER.sbc" "$FOLDER/CubeBlocks.sbc"

# Frostbite
FOLDER=Frostbite
cp "$DATA_DIR/CubeBlocks/CubeBlocks_$FOLDER.sbc" "$FOLDER/CubeBlocks.sbc"

# SparksOfTheFuturePack
FOLDER=SparksOfTheFuturePack
cp "$DATA_DIR/CubeBlocks/CubeBlocks_$FOLDER.sbc" "$FOLDER/CubeBlocks.sbc"

# ScrapRacePack
FOLDER=ScrapRacePack
cp "$DATA_DIR/CubeBlocks/CubeBlocks_$FOLDER.sbc" "$FOLDER/CubeBlocks.sbc"

for f in $(find . -name *.sbc)
do
    sed -i 's/\r$//' $f  # Change CRLF to LF.
    toUnicode $f  # Change encoding to UTF-8 without BOM.
done
