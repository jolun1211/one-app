const fs = require('fs');
const path = require('path');

const EXCLUDES = ['@core', 'spa'];
(() => {
  const dirs = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory());
  const projectList = dirs(path.join(__dirname, '../packages')).filter(i => !EXCLUDES.includes(i));
  console.log(projectList);
  fs.writeFileSync(path.join(__dirname, '../plist.json'), JSON.stringify(projectList));
  console.log('write file plist.json');
})();