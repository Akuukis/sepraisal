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

if [[ -z "$1" ]]; then
    echo "Error: Steam directory not specified."
    echo "Usage: $0 <steam-directory>"
    echo "Example: $0 ~/.steam/steam"
    exit 1
fi

STEAM_DIR=$1
SE_DIR="$STEAM_DIR/steamapps/common/SpaceEngineers"
DATA_DIR="$SE_DIR/Content/Data"

# Vanilla
FOLDER=Vanilla
mkdir -p "$FOLDER"  # Ensure directory exists
cp "$DATA_DIR/Blueprints.sbc" "$FOLDER"
cp "$DATA_DIR/Components.sbc" "$FOLDER"
cp "$DATA_DIR/PhysicalItems.sbc" "$FOLDER"
find "$DATA_DIR/CubeBlocks" -name *.sbc\
    | xargs cp -t "$FOLDER/CubeBlocks"

# Other DLCs
for DLC_FOLDER in \
   DecorativePack \
   DecorativePack2 \
   Economy \
   Frostbite \
   SparksOfTheFuturePack \
   ScrapRacePack \
   Warfare1 \
   IndustrialPack \
   Warfare2 \
   Automation \
   DecorativePack3 \
   SignalsPack \
   ContactPack
do
   mkdir -p "$DLC_FOLDER"
   mv "$FOLDER/CubeBlocks/CubeBlocks_$DLC_FOLDER.sbc" "$DLC_FOLDER/CubeBlocks.sbc"
done

for f in $(find . -name *.sbc)
do
    sed -i 's/\r$//' $f  # Change CRLF to LF.
    toUnicode $f  # Change encoding to UTF-8 without BOM.
done
