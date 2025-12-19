#!/bin/bash
# Enhanced Pokemon image downloader with multiple sources and German naming
# Downloads images and generates variants for mixed visual/text challenges

# Configuration
POKEMON_DB="scripts/pokemon_database.json"
OUTPUT_DIR="rounds/pokemon_gemischt_herausforderungen"
IMAGE_SIZE=300
TEMP_DIR="/tmp/pokemon_images"

# Create directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$TEMP_DIR"

# Function to download with fallback sources
download_with_fallback() {
    local pokemon_key=$1
    local target_dir=$2
    local base_filename=$3

    local german_name=$(jq -r ".${pokemon_key}.german" "$POKEMON_DB")
    local temp_file="$TEMP_DIR/${german_name}.png"

    echo "Downloading $german_name..."

    # Try Pokemon.com first (most reliable)
    local pokemon_com_path=$(jq -r ".${pokemon_key}.image_sources.pokemon_com" "$POKEMON_DB")
    if [ "$pokemon_com_path" != "null" ] && try_download "" "$pokemon_com_path" "$temp_file"; then
        echo "✓ Downloaded from Pokemon.com"
    else
        # Try Pokewiki as fallback
        local pokewiki_path=$(jq -r ".${pokemon_key}.image_sources.pokewiki" "$POKEMON_DB")
        if [ "$pokewiki_path" != "null" ] && try_download "" "$pokewiki_path" "$temp_file"; then
            echo "✓ Downloaded from Pokewiki"
        else
            # Try Bulbagarden as last resort
            local bulba_path=$(jq -r ".${pokemon_key}.image_sources.bulbagarden" "$POKEMON_DB")
            if [ "$bulba_path" != "null" ] && try_download "https://archives.bulbagarden.net/media/upload" "$bulba_path" "$temp_file"; then
                echo "✓ Downloaded from Bulbagarden"
            else
                echo "✗ Failed to download $german_name from all sources"
                return 1
            fi
        fi
    fi

    # Verify downloaded file
    if [ ! -f "$temp_file" ]; then
        echo "✗ Downloaded file does not exist"
        return 1
    fi

    file_type=$(file "$temp_file" 2>/dev/null)
    echo "Downloaded file type: $file_type"

    if ! echo "$file_type" | grep -q "PNG\|JPEG\|image"; then
        echo "✗ Downloaded file is not a valid image: $file_type"
        # Save for debugging
        cp "$temp_file" "debug_${german_name}.html" 2>/dev/null || true
        rm -f "$temp_file"
        return 1
    fi

    # Process and save all variants
    if process_image "$temp_file" "$target_dir" "$german_name"; then
        echo "✓ Successfully processed all variants for $german_name"
        rm -f "$temp_file"
        return 0
    else
        echo "✗ Failed to process image"
        rm -f "$temp_file"
        return 1
    fi
}

# Function to try downloading from a specific source
try_download() {
    local base_url=$1
    local path=$2
    local output_file=$3

    local full_url="${base_url}${path}"

    if curl -L -s --max-time 30 --user-agent "Mozilla/5.0" "$full_url" -o "$output_file" 2>/dev/null; then
        # Check if file has content and is an image
        if [ -s "$output_file" ] && file "$output_file" 2>/dev/null | grep -q "PNG\|JPEG\|image"; then
            return 0
        fi
    fi

    # Cleanup failed download
    rm -f "$output_file"
    return 1
}

# Function to process image and create variants
process_image() {
    local input_file=$1
    local target_dir=$2
    local base_filename=$3

    echo "Processing image: $input_file"

    # Extract base name (should be just the Pokemon name)
    local base_name="${base_filename%-*}"

    # Create base resized version (simplified)
    local base_output="$target_dir/${base_filename}-100.jpg"
    echo "Creating base version: ${base_output}"

    convert "$input_file" -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${base_output}" 2>/dev/null
    if [ ! -f "${base_output}" ]; then
        echo "Failed to create base image"
        return 1
    fi

    # Create silhouette variants
    echo "Creating silhouette variants..."
    convert "$input_file" -threshold 50% -negate -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "$target_dir/${base_filename}-silhouette-300.jpg" 2>&1 && echo "Silhouette 300 OK" || echo "Silhouette 300 failed"
    convert "$input_file" -threshold 50% -negate -gravity center -crop 60%x100% -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "$target_dir/${base_filename}-silhouette-400.jpg" 2>&1 && echo "Silhouette 400 OK" || echo "Silhouette 400 failed"

    # Create filter variants
    echo "Creating filter variants..."
    convert "$input_file" -blur 0x3 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "$target_dir/${base_filename}-blur-200.jpg" 2>&1 && echo "Blur OK" || echo "Blur failed"
    convert "$input_file" -sepia-tone 80% -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "$target_dir/${base_filename}-sepia-400.jpg" 2>&1 && echo "Sepia OK" || echo "Sepia failed"
    convert "$input_file" -sketch 0x20+120 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "$target_dir/${base_filename}-sketch-500.jpg" 2>&1 && echo "Sketch OK" || echo "Sketch failed"

    echo "All variants created successfully"
    return 0
}

# Function to download Pokemon for a specific category
download_category_images() {
    local category_name=$1
    local pokemon_list=("${@:2}")

    local category_dir="$OUTPUT_DIR/$category_name"
    mkdir -p "$category_dir"

    echo "=== Downloading images for category: $category_name ==="

    for pokemon_key in "${pokemon_list[@]}"; do
        local german_name=$(jq -r ".${pokemon_key}.german" "$POKEMON_DB")
        if [ "$german_name" = "null" ]; then
            echo "Warning: No German name found for $pokemon_key"
            continue
        fi

        # Download base image
        if download_with_fallback "$pokemon_key" "$category_dir" "${german_name}"; then
            echo "Successfully processed all variants for $german_name"
        else
            echo "Failed to process $german_name"
        fi
    done
}

# Main execution
echo "=== Enhanced Pokemon Image Downloader ==="
echo "Downloading images for: pokemon_gemischt_herausforderungen"

# Download images for each category
download_category_images "Silhouetten-Jäger" "pikachu" "glumanda" "schiggy" "bisasam" "mew"
download_category_images "Entwicklungsstufen" "pichu" "raichu" "lucario" "bummelz" "geckarbor"
download_category_images "Typ-Meister" "schiggy" "glumanda" "bisasam" "shinx" "lucario"
download_category_images "Regional-Varianten" "raichu" "toxtricity" "vikavolt" "morpeko" "quaxly"
download_category_images "Mythische Mysterien" "mew" "mewtu" "celebi" "dialga" "victini"
download_category_images "Starter-Team" "bisasam" "glumanda" "schiggy" "igamaro" "sprigatito"

# Cleanup
rm -rf "$TEMP_DIR"

echo "=== Image download and processing completed ==="