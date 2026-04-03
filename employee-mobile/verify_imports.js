const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');

const tsconfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'tsconfig.json'), 'utf8'));
const paths = tsconfig.compilerOptions.paths || {};
const baseUrl = tsconfig.compilerOptions.baseUrl || '.';

function resolveImport(importPath, currentFileDir) {
  // Check if it's an alias
  for (const alias in paths) {
    const aliasPattern = alias.replace('*', '(.*)');
    const regex = new RegExp(`^${aliasPattern}$`);
    const match = importPath.match(regex);
    if (match) {
      const replacements = paths[alias];
      for (const replacement of replacements) {
        const resolvedPath = replacement.replace('*', match[1] || '');
        const absolutePath = path.resolve(rootDir, baseUrl, resolvedPath);
        const exists = checkExistence(absolutePath);
        if (exists) return exists;
      }
    }
  }

  // Check if it's relative
  if (importPath.startsWith('.')) {
    const absolutePath = path.resolve(currentFileDir, importPath);
    const exists = checkExistence(absolutePath);
    if (exists) return exists;
  }

  return null;
}

function checkExistence(absPath) {
  const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.d.ts', '.png', '.jpg', '.jpeg', '.svg', '.json'];
  for (const ext of extensions) {
    const fullPath = absPath + ext;
    if (fs.existsSync(fullPath) && !fs.lstatSync(fullPath).isDirectory()) {
      return fullPath;
    }
  }
  
  // Check if it's a directory with an index file
  if (fs.existsSync(absPath) && fs.lstatSync(absPath).isDirectory()) {
    for (const indexExt of ['/index.ts', '/index.tsx', '/index.js', '/index.jsx']) {
      const indexPath = path.join(absPath, indexExt);
      if (fs.existsSync(indexPath)) {
        return indexPath;
      }
    }
  }
  
  return null;
}

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = getFiles(srcDir);
const brokenImports = [];
let checkedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /(?:import|export)\s+(?:.*?\s+from\s+)?['"](.*?)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Skip library imports (not starting with @/ or .)
    // Note: We also check for our specific aliases from tsconfig
    const isAliased = Object.keys(paths).some(alias => {
        const aliasPrefix = alias.split('*')[0];
        return importPath.startsWith(aliasPrefix);
    });
    const isRelative = importPath.startsWith('.');

    if (isAliased || isRelative) {
      checkedCount++;
      const resolved = resolveImport(importPath, path.dirname(file));
      if (!resolved) {
        brokenImports.push({
          file: path.relative(rootDir, file),
          import: importPath
        });
      }
    }
  }
});

console.log(`Checked ${checkedCount} imports across ${files.length} files.`);

if (brokenImports.length > 0) {
  console.log('Broken Imports found:');
  brokenImports.forEach(bi => {
    console.log(`${bi.file}: Broken import "${bi.import}"`);
  });
} else {
  console.log('No broken imports found.');
}
