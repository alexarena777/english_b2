const fs = require('fs');
let content = fs.readFileSync('D:/Progetti/english b2/lib/curriculum/uni-exam-data.ts', 'utf8');
content = content.replace(/`n/g, '');
fs.writeFileSync('D:/Progetti/english b2/lib/curriculum/uni-exam-data.ts', content);
