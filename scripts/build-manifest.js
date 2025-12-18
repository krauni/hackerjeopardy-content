#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Manifest Builder Script for Hacker Jeopardy Content
 * Automatically generates manifest.json from round directories
 */

class ManifestBuilder {
  constructor() {
    this.rounds = [];
    this.totalSize = 0;
  }

  buildManifest(roundsDir, outputFile) {
    console.log('🔨 Building content manifest...');

    if (!fs.existsSync(roundsDir)) {
      console.error(`❌ Rounds directory not found: ${roundsDir}`);
      process.exit(1);
    }

    // Find all round directories
    const roundDirs = fs.readdirSync(roundsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => ({
        id: dirent.name,
        path: path.join(roundsDir, dirent.name)
      }));

    console.log(`📂 Found ${roundDirs.length} round directories`);

    // Process each round
    roundDirs.forEach(({ id, path: roundPath }) => {
      try {
        const roundData = this.processRound(id, roundPath);
        if (roundData) {
          this.rounds.push(roundData);
          this.totalSize += roundData.size;
        }
      } catch (error) {
        console.warn(`⚠️  Skipping round ${id}: ${error.message}`);
      }
    });

    // Generate manifest
    const manifest = {
      name: 'Hacker Jeopardy Content Repository',
      description: 'Community-contributed question sets for Hacker Jeopardy',
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      totalRounds: this.rounds.length,
      totalSize: this.totalSize,
      rounds: this.rounds,
      contributors: [
        {
          name: 'Hacker Jeopardy Community',
          github: 'https://github.com/yourusername'
        }
      ],
      license: 'MIT'
    };

    // Write manifest file
    fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
    console.log(`✅ Manifest built successfully: ${outputFile}`);
    console.log(`   📊 ${this.rounds.length} rounds, ${this.formatBytes(this.totalSize)} total`);
  }

  processRound(roundId, roundPath) {
    const roundJsonPath = path.join(roundPath, 'round.json');

    if (!fs.existsSync(roundJsonPath)) {
      throw new Error('Missing round.json file');
    }

    const roundData = JSON.parse(fs.readFileSync(roundJsonPath, 'utf8'));
    const categories = roundData.categories || [];

    // Calculate round size
    let roundSize = this.getFileSize(roundJsonPath);

    // Add category file sizes
    categories.forEach(categoryName => {
      const catJsonPath = path.join(roundPath, categoryName, 'cat.json');
      if (fs.existsSync(catJsonPath)) {
        roundSize += this.getFileSize(catJsonPath);
      }

      // Add image sizes (rough estimate)
      const categoryDir = path.join(roundPath, categoryName);
      if (fs.existsSync(categoryDir)) {
        roundSize += this.getDirectorySize(categoryDir);
      }
    });

    return {
      id: roundId,
      name: roundData.name || roundId,
      language: roundData.lang || 'en',
      difficulty: roundData.difficulty || 'mixed',
      categories: categories,
      author: roundData.author || 'Community',
      lastModified: roundData.date || new Date().toISOString().split('T')[0],
      size: roundSize,
      description: roundData.comment || roundData.description,
      tags: roundData.tags || []
    };
  }

  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  getDirectorySize(dirPath) {
    let totalSize = 0;

    try {
      const items = fs.readdirSync(dirPath);

      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isFile()) {
          totalSize += stats.size;
        } else if (stats.isDirectory()) {
          totalSize += this.getDirectorySize(itemPath);
        }
      });
    } catch {
      // Directory doesn't exist or can't be read
    }

    return totalSize;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const roundsDir = args[0] || './rounds';
  const outputFile = args[1] || './manifest.json';

  console.log(`Building manifest from: ${roundsDir}`);
  console.log(`Output file: ${outputFile}`);

  const builder = new ManifestBuilder();
  builder.buildManifest(roundsDir, outputFile);
}

if (require.main === module) {
  main();
}

module.exports = ManifestBuilder;