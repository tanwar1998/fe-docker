#!/bin/sh
echo "Setting registry to Adobe Artifactory"
npm cache clean --force
npm config set registry https://artifactory.corp.adobe.com/artifactory/api/npm/npm-dexter-release/
echo "Publishing package..."
npm publish
echo "Resetting to default NPM registry..."
npm config set registry https://registry.npmjs.org/
echo "Done. Check for errors above!"
