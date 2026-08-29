const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts')) {
      let c = fs.readFileSync(p, 'utf8');
      let nc = c.replace(/from '(\.[^']+)'/g, "from '$1.js'").replace(/\.js\.js/g, '.js');
      if (c !== nc) {
        fs.writeFileSync(p, nc);
      }
    }
  });
}
walk('d:/gpfinal/backend/src');
