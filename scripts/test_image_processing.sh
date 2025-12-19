#!/bin/bash
# Test script for Pokemon image processing

POKEMON_DB="scripts/pokemon_database.json"
OUTPUT_DIR="rounds/pokemon_gemischt_herausforderungen/Silhouetten-Jäger"
TEMP_DIR="/tmp/pokemon_test"

mkdir -p "$OUTPUT_DIR"
mkdir -p "$TEMP_DIR"

echo "Testing Pokemon image download and processing..."

# Test downloading Pikachu
echo "Downloading Pikachu..."
curl -L -s --max-time 30 --user-agent "Mozilla/5.0" "https://archives.bulbagarden.net/media/upload/4/4a/0025Pikachu.png" -o "$TEMP_DIR/pikachu_test.png"

if [ -f "$TEMP_DIR/pikachu_test.png" ]; then
    echo "Download successful, file size: $(stat -f%z "$TEMP_DIR/pikachu_test.png" 2>/dev/null || stat -c%s "$TEMP_DIR/pikachu_test.png")"
    echo "File type: $(file "$TEMP_DIR/pikachu_test.png" | head -c 100)"
    echo "First few bytes (hex): $(hexdump -C "$TEMP_DIR/pikachu_test.png" | head -3)"

    # Test basic convert
    echo "Testing basic convert..."
    convert "$TEMP_DIR/pikachu_test.png" -resize 300x300 "$OUTPUT_DIR/pikachu-test-100.jpg" 2>&1
    if [ $? -eq 0 ]; then
        echo "Basic convert successful"
    else
        echo "Basic convert failed"
    fi

    # Test crop
    echo "Testing crop..."
    convert "$TEMP_DIR/pikachu_test.png" -gravity center -crop 300x300+0+0 -resize 300x300 "$OUTPUT_DIR/pikachu-test-crop.jpg" 2>&1
    if [ $? -eq 0 ]; then
        echo "Crop successful"
    else
        echo "Crop failed"
    fi

    # Test silhouette
    echo "Testing silhouette..."
    convert "$TEMP_DIR/pikachu_test.png" -threshold 50% -negate "$OUTPUT_DIR/pikachu-test-silhouette.jpg" 2>&1
    if [ $? -eq 0 ]; then
        echo "Silhouette successful"
    else
        echo "Silhouette failed"
    fi
else
    echo "Download failed"
fi

# List output files
echo "Output files:"
ls -la "$OUTPUT_DIR"/

# Cleanup
rm -rf "$TEMP_DIR"