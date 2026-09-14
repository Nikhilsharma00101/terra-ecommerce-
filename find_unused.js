const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const allFiles = walk('src');
const homeComponentsDir = 'src/components/home';
const homeComponents = fs.readdirSync(homeComponentsDir).filter(f => f.endsWith('.tsx'));

const unused = [];

homeComponents.forEach(comp => {
  const compName = comp.replace('.tsx', '');
  let isUsed = false;
  allFiles.forEach(file => {
    // Ignore the component file itself
    if (file === `${homeComponentsDir}/${comp}`) return;
    
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(compName)) {
      isUsed = true;
    }
  });
  
  if (!isUsed) {
    unused.push(comp);
  }
});

console.log('Unused components in src/components/home:');
console.log(unused.join('\n'));
