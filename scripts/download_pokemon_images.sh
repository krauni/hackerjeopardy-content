#!/bin/bash
# pokemon_image_downloader.sh - Download and crop Pokemon images from Pokewiki.de

# Usage: ./pokemon_image_downloader.sh
# Requires: curl, convert (ImageMagick)

# Mapping of Pokemon German names to their Bulbapedia image paths (Gen 1 focus)
# URLs are from archives.bulbagarden.net/media/upload/ (corrected paths)
declare -A POKEMON_MAP=(
    ["Bisasam"]="/media/upload/f/fb/0001Bulbasaur.png"
    ["Glumanda"]="/media/upload/2/27/0004Charmander.png"
    ["Schiggy"]="/media/upload/5/54/0007Squirtle.png"
    ["Pikachu"]="/media/upload/4/4a/0025Pikachu.png"
    ["Mew"]="/media/upload/9/9a/0151Mew.png"
    ["Mewtu"]="/media/upload/8/89/0150Mewtwo.png"
    ["Arktos"]="/media/upload/0/0f/0144Articuno.png"
    ["Lavados"]="/media/upload/2/22/0146Moltres.png"
    ["Zapdos"]="/media/upload/c/c6/0145Zapdos.png"
    ["Pichu"]="/media/upload/f/f3/0172Pichu.png"
    ["Rattikarl"]="/media/upload/4/42/0020Raticate.png"
    ["Schnurrla"]="/media/upload/b/b0/0053Persian.png"
    ["Garados"]="/media/upload/b/bc/0130Gyarados.png"
    ["Feurio"]="/media/upload/f/f7/0158Totodile.png"
    ["Abra"]="/media/upload/8/81/0063Abra.png"
    ["Kleinstein"]="/media/upload/7/7c/0074Geodude.png"
    ["Glurak"]="/media/upload/3/38/0006Charizard.png"
    ["Turtok"]="/media/upload/7/79/0009Blastoise.png"
    ["Kabuto"]="/media/upload/0/03/0140Kabuto.png"
    ["Aerodactyl"]="/media/upload/5/5f/0142Aerodactyl.png"
)

OUTPUT_DIR="rounds/klassische_pokemon_stars"
IMAGE_SIZE=300

# Function to download and crop image
download_crop() {
    local pokemon=$1
    local target=$2
    local path=${POKEMON_MAP[$pokemon]}
    
    if [ -z "$path" ]; then
        echo "Warning: No mapping found for $pokemon"
        return 1
    fi
    
    local url="https://archives.bulbagarden.net$path"
    local temp_file="/tmp/${target}.png"
    local output_file="${OUTPUT_DIR}/${target}.jpg"
    
    echo "Downloading $pokemon -> $target.jpg"
    
    # Download with timeout and follow redirects
    if curl -L -s --max-time 30 "$url" -o "$temp_file"; then
        # Check if file exists and has content
        if [ -s "$temp_file" ] && file "$temp_file" | grep -q "PNG\|JPEG\|image"; then
            # Crop to square and resize
            convert "$temp_file" -gravity center -crop ${IMAGE_SIZE}x${IMAGE_SIZE}+0+0 -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "$output_file" 2>/dev/null
            if [ $? -eq 0 ]; then
                echo "Successfully processed $target.jpg"
            else
                echo "Failed to convert $target.jpg"
                # Try without cropping if conversion fails
                convert "$temp_file" -resize ${IMAGE_SIZE}x${IMAGE_SIZE} "$output_file" 2>/dev/null
            fi
        else
            echo "Downloaded file is not a valid image for $pokemon"
        fi
    else
        echo "Failed to download $url for $pokemon"
    fi
    
    # Clean up
    rm -f "$temp_file"
}

# Download all images from the round
echo "Starting Pokemon image download and cropping..."

# From Starter-Sternchen
download_crop "Bisasam" "bisasam-100"
download_crop "Glumanda" "glumanda-200"
download_crop "Schiggy" "schiggy-300"
download_crop "Glurak" "glurak-500"

# From Legendäre Wesen
download_crop "Mew" "mew-100"
download_crop "Mewtu" "mewtu-200"
download_crop "Zapdos" "zapdos-500"

# From Familienbande
download_crop "Pichu" "pichu-100"
download_crop "Pikachu" "pikachu-200"
download_crop "Schnurrla" "schnurrla-400"
download_crop "Garados" "garados-500"

# From Typen-Titanen
download_crop "Feurio" "feurio-200"
download_crop "Mew" "mew-500"

# From Anime-Asse
download_crop "Pikachu" "pikachu-100"
download_crop "Glurak" "glurak-200"
download_crop "Mewtu" "mewtu-400"

# From Retro-Raritäten
download_crop "Kabuto" "kabuto-300"
download_crop "Aerodactyl" "aerodactyl-400"
download_crop "Mew" "mew-500"

echo "Image download and cropping completed."