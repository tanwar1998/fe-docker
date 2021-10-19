#!/bin/sh
echo "pruning unused npm modules..."
npm prune
echo "cleaning the npm cache..."
npm cache clean --force
echo "running npm update..."
npm update
echo "running npm install..."
npm install
echo "Done. Check for errors above!"
