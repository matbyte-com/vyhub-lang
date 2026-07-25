const fs = require('fs');
const path = require('path');

const DIR = __dirname;

function flatten(obj, prefix, out) {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const p = prefix ? prefix + '.' + key : key;
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      flatten(val, p, out);
    } else {
      out[p] = val;
    }
  }
  return out;
}

function setDeep(obj, dottedKey, value) {
  const parts = dottedKey.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (typeof cur[k] !== 'object' || cur[k] === null || Array.isArray(cur[k])) {
      cur[k] = {};
    }
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}

function load(f) {
  return JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
}

const cmd = process.argv[2];

if (cmd === 'dump') {
  // dump missing keys for a language as flat {key: englishValue}
  const lang = process.argv[3];
  const en = flatten(load('en.json'), '', {});
  const cur = flatten(load(lang + '.json'), '', {});
  const missing = {};
  for (const k of Object.keys(en)) {
    if (!(k in cur)) missing[k] = en[k];
  }
  process.stdout.write(JSON.stringify(missing, null, 2));
} else if (cmd === 'merge') {
  // merge a flat patch json file into a language file, preserving existing content
  const lang = process.argv[3];
  const patchFile = process.argv[4];
  const data = load(lang + '.json');
  const patch = JSON.parse(fs.readFileSync(patchFile, 'utf8'));
  for (const k of Object.keys(patch)) {
    setDeep(data, k, patch[k]);
  }
  fs.writeFileSync(path.join(DIR, lang + '.json'), JSON.stringify(data, null, 4) + '\n');
  // report remaining missing
  const en = flatten(load('en.json'), '', {});
  const cur = flatten(data, '', {});
  const missing = Object.keys(en).filter(k => !(k in cur));
  console.log(`${lang}: applied ${Object.keys(patch).length}, remaining missing ${missing.length}`);
} else if (cmd === 'status') {
  const en = flatten(load('en.json'), '', {});
  const enKeys = Object.keys(en);
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json') && f !== 'en.json' && !f.startsWith('.'));
  for (const f of files) {
    const cur = flatten(load(f), '', {});
    const missing = enKeys.filter(k => !(k in cur));
    console.log(`${f}: missing ${missing.length}`);
  }
}
