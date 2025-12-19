#!/bin/bash
# Master Pokemon image downloader with extreme filters for master-level difficulty
# Creates the most challenging visual variants for Pokemon masters

# Configuration
MASTER_DB="scripts/pokemon_master_database.json"
OUTPUT_DIR="rounds/pokemon_meister_herausforderungen"
IMAGE_SIZE=300
TEMP_DIR="/tmp/pokemon_master_images"

# Create directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$TEMP_DIR"

# Function to download with Pokemon.com as primary source
download_master_pokemon() {
    local pokemon_key=$1
    local german_name=$(jq -r ".${pokemon_key}.german" "$MASTER_DB")
    local temp_file="$TEMP_DIR/${german_name}.png"

    echo "Downloading master Pokemon: $german_name..."

    # Use Pokemon.com as the reliable source
    local pokemon_com_path=$(jq -r ".${pokemon_key}.image_sources.pokemon_com" "$MASTER_DB")

    if curl -L -s --max-time 30 --user-agent "Mozilla/5.0" "$pokemon_com_path" -o "$temp_file"; then
        # Verify downloaded file
        if [ -f "$temp_file" ] && file "$temp_file" 2>/dev/null | grep -q "PNG\|JPEG\|image"; then
            echo "✓ Downloaded $german_name successfully"
            return 0
        fi
    fi

    echo "✗ Failed to download $german_name"
    return 1
}

# Function to create master-level extreme visual variants (maximum difficulty)
create_master_image_variants() {
    local input_file=$1
    local target_dir=$2
    local base_name=$3

    echo "Creating master-level extreme image variants for $base_name"

    # Standard base image (for reference - still challenging for masters)
    convert "$input_file" -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-100.jpg"

    # Advanced silhouette variants (extreme difficulty)
    convert "$input_file" -threshold 45% -negate -blur 0x1 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-silhouette-extreme-200.jpg"
    convert "$input_file" -threshold 55% -negate -gravity center -crop 65%x75% -blur 0x2 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-silhouette-fragmented-300.jpg"
    convert "$input_file" -threshold 35% -negate -blur 0x3 -modulate 150,20,120 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-silhouette-distorted-400.jpg"

    # Complex multi-effect combinations (master level)
    convert "$input_file" -blur 0x5 -sepia-tone 70% -modulate 130,40,110 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-blur-sepia-modulate-200.jpg"
    convert "$input_file" -negate -blur 0x4 -sepia-tone 50% -modulate 120,30,100 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-invert-blur-sepia-modulate-300.jpg"
    convert "$input_file" -sketch 0x35+150 -blur 0x2 -negate -modulate 140,25,115 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-sketch-blur-invert-modulate-400.jpg"

    # Extreme distortion effects (maximum difficulty)
    convert "$input_file" -implode 0.4 -blur 0x3 -sepia-tone 75% -modulate 125,35,105 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-implode-blur-sepia-modulate-300.jpg"
    convert "$input_file" -swirl 60 -blur 0x5 -modulate 115,45,125 -sepia-tone 65% -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-swirl-blur-modulate-sepia-400.jpg"
    convert "$input_file" -wave 10x50 -blur 0x3 -sepia-tone 60% -modulate 135,30,118 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-wave-blur-sepia-modulate-500.jpg"

    # Abstract artistic chaos (ultimate difficulty)
    convert "$input_file" -paint 8 -blur 0x3 -negate -modulate 145,20,110 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-paint-blur-invert-modulate-400.jpg"
    convert "$input_file" -charcoal 4 -implode -0.3 -blur 0x2 -sepia-tone 70% -modulate 130,40,112 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-charcoal-implode-blur-sepia-modulate-500.jpg"
    convert "$input_file" -edge 3 -blur 0x4 -sepia-tone 55% -modulate 125,50,120 -negate -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-edge-blur-sepia-modulate-invert-500.jpg"

    # Ultimate master challenges
    convert "$input_file" -swirl 45 -implode 0.2 -blur 0x4 -paint 5 -modulate 120,25,115 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-swirl-implode-blur-paint-modulate-500.jpg"
    convert "$input_file" -wave 15x70 -charcoal 3 -blur 0x3 -sepia-tone 75% -modulate 140,30,108 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-wave-charcoal-blur-sepia-modulate-500.jpg"

    echo "✓ Created all master-level extreme variants for $base_name"
}

# Function to process Pokemon for master categories
process_master_category() {
    local category_name=$1
    local pokemon_list=("${@:2}")

    local category_dir="$OUTPUT_DIR/$category_name"
    mkdir -p "$category_dir"

    echo "=== Processing master category: $category_name ==="

    for pokemon_key in "${pokemon_list[@]}"; do
        local german_name=$(jq -r ".${pokemon_key}.german" "$MASTER_DB")

        if download_master_pokemon "$pokemon_key"; then
            local temp_file="$TEMP_DIR/${german_name}.png"

            if create_master_image_variants "$temp_file" "$category_dir" "$german_name"; then
                echo "✓ Successfully processed master Pokemon $german_name"
            else
                echo "✗ Failed to create master variants for $german_name"
            fi

            rm -f "$temp_file"
        fi
    done
}

# Main execution - Master categories with legendary/mythical Pokemon
echo "=== Master Pokemon Image Processor ==="
echo "Creating extreme visual challenges for Pokemon masters"

# Master categories with the most legendary and mythical Pokemon
process_master_category "Legendäre Meister" "mewtwo" "lugia" "ho_oh" "rayquaza" "arceus" "groudon" "kyogre"
process_master_category "Mythische Meister" "mew" "celebi" "jirachi" "deoxys" "darkrai" "shaymin" "arceus" "phione" "manaphy"
process_master_category "Starter-Legenden" "pikachu" "eevee" "snivy" "tepig" "oshawott" "rowlet" "litten" "popplio"
process_master_category "Mächtige Formen" "giratina" "reshiram" "zekrom" "kyurem" "xerneas" "yveltal" "zygarde" "lunala" "solgaleo" "necrozma"
process_master_category "Seltene Wesen" "genesect" "diancie" "volcanion" "meltan" "koraidon" "miraidon"
process_master_category "Wächter der Balance" "dialga" "palkia" "giratina" "reshiram" "zekrom" "xerneas" "yveltal"

# Cleanup
rm -rf "$TEMP_DIR"

echo "=== Master Pokemon image processing completed ==="