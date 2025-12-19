#!/bin/bash
# Expert Pokemon image downloader with advanced filters for higher difficulty
# Creates more challenging visual variants for expert-level identification

# Configuration
EXPERT_DB="scripts/pokemon_expert_database.json"
OUTPUT_DIR="rounds/pokemon_expert_herausforderungen"
IMAGE_SIZE=300
TEMP_DIR="/tmp/pokemon_expert_images"

# Create directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$TEMP_DIR"

# Function to download with Pokemon.com as primary source
download_pokemon_image() {
    local pokemon_key=$1
    local german_name=$(jq -r ".${pokemon_key}.german" "$EXPERT_DB")
    local temp_file="$TEMP_DIR/${german_name}.png"

    echo "Downloading $german_name..."

    # Use Pokemon.com as the reliable source
    local pokemon_com_path=$(jq -r ".${pokemon_key}.image_sources.pokemon_com" "$EXPERT_DB")

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

# Function to create advanced visual variants (expert difficulty)
create_expert_image_variants() {
    local input_file=$1
    local target_dir=$2
    local base_name=$3

    echo "Creating expert-level image variants for $base_name"

    # Standard base image (least challenging for experts)
    convert "$input_file" -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-100.jpg"

    # Advanced silhouette variants (medium difficulty)
    convert "$input_file" -threshold 40% -negate -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-silhouette-clean-200.jpg"
    convert "$input_file" -threshold 60% -negate -gravity center -crop 70%x80% -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-silhouette-partial-300.jpg"
    convert "$input_file" -threshold 30% -negate -blur 0x1 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-silhouette-blur-400.jpg"

    # Complex filter combinations (high difficulty)
    convert "$input_file" -blur 0x4 -sepia-tone 60% -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-blur-sepia-200.jpg"
    convert "$input_file" -negate -blur 0x2 -sepia-tone 40% -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-invert-blur-sepia-300.jpg"
    convert "$input_file" -sketch 0x30+140 -blur 0x1 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-sketch-blur-400.jpg"

    # Extreme distortion effects (expert level)
    convert "$input_file" -blur 0x6 -modulate 120,30,100 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-extreme-blur-saturation-300.jpg"
    convert "$input_file" -sketch 0x40+160 -negate -blur 0x3 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-sketch-invert-blur-400.jpg"
    convert "$input_file" -implode 0.3 -blur 0x2 -sepia-tone 70% -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-implode-blur-sepia-500.jpg"
    convert "$input_file" -swirl 45 -blur 0x4 -modulate 110,50,120 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-swirl-blur-modulate-500.jpg"

    # Abstract artistic effects (maximum difficulty)
    convert "$input_file" -paint 6 -blur 0x2 -negate -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-paint-blur-invert-400.jpg"
    convert "$input_file" -charcoal 3 -implode -0.2 -blur 0x1 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-charcoal-implode-blur-500.jpg"
    convert "$input_file" -edge 2 -blur 0x3 -sepia-tone 50% -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "${target_dir}/${base_name}-edge-blur-sepia-500.jpg"

    echo "✓ Created all expert variants for $base_name"
}

# Function to process Pokemon for expert categories
process_expert_category() {
    local category_name=$1
    local pokemon_list=("${@:2}")

    local category_dir="$OUTPUT_DIR/$category_name"
    mkdir -p "$category_dir"

    echo "=== Processing expert category: $category_name ==="

    for pokemon_key in "${pokemon_list[@]}"; do
        local german_name=$(jq -r ".${pokemon_key}.german" "$EXPERT_DB")

        if download_pokemon_image "$pokemon_key"; then
            local temp_file="$TEMP_DIR/${german_name}.png"

            if create_expert_image_variants "$temp_file" "$category_dir" "$german_name"; then
                echo "✓ Successfully processed $german_name"
            else
                echo "✗ Failed to create variants for $german_name"
            fi

            rm -f "$temp_file"
        fi
    done
}

# Main execution - Expert categories with challenging Pokemon
echo "=== Expert Pokemon Image Processor ==="
echo "Creating advanced visual challenges for expert players"

# Expert categories with carefully selected challenging Pokemon
process_expert_category "Legendäre Schatten" "mewtu" "dialga" "palkia" "giratina" "arceus" "reshiram" "zekrom"
process_expert_category "Mythische Rätsel" "mew" "celebi" "victini" "xerneas" "yveltal" "zygarde" "lunala" "solgaleo" "necrozma"
process_expert_category "Mega Mysterien" "lucario" "vikavolt" "toxtricity" "morpeko" "calyrex" "koraidon" "miraidon"
process_expert_category "Evolutionäre Extreme" "pichu" "raichu" "bummelz" "shinx" "plinfa" "igamaro" "froakie"
process_expert_category "Starter Strategien" "bisasam" "glumanda" "schiggy" "geckarbor" "hydropi" "sprigatito" "fuecoco" "quaxly"
process_expert_category "Typ Titanen" "pikachu" "lucario" "shinx" "vikavolt" "toxtricity" "morpeko" "koraidon" "miraidon"

# Cleanup
rm -rf "$TEMP_DIR"

echo "=== Expert Pokemon image processing completed ==="