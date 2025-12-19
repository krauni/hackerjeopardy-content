#!/bin/bash
# Test processing one Pokemon

POKEMON_DB="scripts/pokemon_database.json"
OUTPUT_DIR="rounds/pokemon_gemischt_herausforderungen/Silhouetten-Jäger"
TEMP_DIR="/tmp/pokemon_test"

mkdir -p "$OUTPUT_DIR"
mkdir -p "$TEMP_DIR"

# Test Pikachu
pokemon_key="pikachu"
german_name="Pikachu"
temp_file="$TEMP_DIR/${german_name}.png"

echo "Testing Pikachu processing..."

# Download
curl -L -s --max-time 30 --user-agent "Mozilla/5.0" "https://archives.bulbagarden.net/media/upload/4/4a/0025Pikachu.png" -o "$temp_file"

if [ -f "$temp_file" ]; then
    echo "Downloaded successfully"

    # Process
    IMAGE_SIZE=300

    # Base image
    convert "$temp_file" -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "$OUTPUT_DIR/${german_name}-100.jpg" 2>&1
    echo "Base image result: $?"

    # Silhouette
    convert "$temp_file" -threshold 50% -negate -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "$OUTPUT_DIR/${german_name}-silhouette-300.jpg" 2>&1
    echo "Silhouette result: $?"

    # List files
    ls -la "$OUTPUT_DIR"/
else
    echo "Download failed"
fi

rm -rf "$TEMP_DIR"