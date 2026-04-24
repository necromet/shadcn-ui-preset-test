const fs = require('fs');
const path = require('path');

const mockPath = path.join(__dirname, 'crm-dashboard/src/data/mock.js');
let content = fs.readFileSync(mockPath, 'utf8');

// Replace status: with status_after: and add status_before: null
// We'll do a line-by-line transformation for lines inside the cnx_jemaat_status_history array
const lines = content.split('\n');
let inArray = false;
let arrayStartLine = -1;
let arrayEndLine = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('const cnx_jemaat_status_history = [')) {
    inArray = true;
    arrayStartLine = i;
    continue;
  }
  if (inArray && line.trim() === '];') {
    arrayEndLine = i;
    break;
  }
}

if (arrayStartLine === -1 || arrayEndLine === -1) {
  console.error('Could not find cnx_jemaat_status_history array');
  process.exit(1);
}

// Transform lines between start and end
for (let i = arrayStartLine + 1; i < arrayEndLine; i++) {
  const line = lines[i];
  // Skip comment lines
  if (line.trim().startsWith('//')) continue;
  // Replace status: with status_after:
  let newLine = line.replace(/\bstatus:/g, 'status_after:');
  // Add status_before: null after status_after
  // We'll insert before changed_at
  newLine = newLine.replace(/(status_after: '[^']+',)/, '$1 status_before: null,');
  lines[i] = newLine;
}

const newContent = lines.join('\n');
fs.writeFileSync(mockPath, newContent, 'utf8');
console.log('Updated mock data');