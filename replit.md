# Hummingbird Game

## Overview
A simple HTML5 game built with Phaser.js where you control a hummingbird collecting nectar from flowers to maintain energy.

## Project Architecture
- **Frontend**: Static HTML5 game using Phaser.js framework
- **No backend**: This is a client-side only game
- **No build system**: Runs directly in the browser

## File Structure
- `index.html` - Main entry point
- `game.js` - Game logic and Phaser implementation
- `phaser.js` - Phaser game framework library
- `img/` - Sprite images and animations
- `spritesheet1.json` - Sprite configuration

## Recent Changes
- 2025-10-22: Initial project import and Replit environment setup
  - Added HTTP server for local development
  - Configured workflow to serve on port 5000
  - Made game fully responsive with dynamic UI layout
    - Added layoutUI() function that repositions elements based on viewport size
    - UI elements now use percentage-based positioning instead of fixed pixels
    - Added resize callback to handle window size changes
    - Game maintains aspect ratio using Phaser SHOW_ALL scale mode
  - Replaced purple square placeholders with lavender flower graphics
    - Implemented two-layer flower system: 10x10 hitbox for precise collision + decorative image
    - Generated AI lavender flower sprite for visual appeal
    - Maintained exact 10x10 pixel collision detection for precise refueling gameplay
    - Added fade-out effect as nectar depletes from flowers

## How to Run
The game runs via a simple HTTP server on port 5000. Use arrow keys or click to move the hummingbird and collect nectar from flowers.
