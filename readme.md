Shortcut to set up the base minimum of my preferred front-end SPA stack. 
- Vue SFC
- Pug
- Typescript
- esbuild (not webpack)
- Jasmine

This package brings in all the usual dependencies. Copy the contents of the "example" directory for a starter structure.
Add these commands to package.json/scripts:
- "build": "NODE_ENV=production node build/build.js"
- "dev": "node build/build.js --watch"
- "test": "node build/test.js"
- "test-watch": "nodemon build/test.js -e ts,js"
