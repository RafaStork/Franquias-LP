// Asset-only preview, not a browser screenshot or responsive layout test.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sharp = require('C:/Users/Rafael/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const source = fs.readFileSync(path.join(root,'app.js'),'utf8');
const defs = html.match(/<defs>\s*<!-- Option 09[\s\S]*?<\/defs>/)[0];
let trees = [];
const context = {
  journeyForest:{replaceChildren(f){trees=f.children;}}, journeyRoute:{}, journeyViewportWidth:()=>1000,
  clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),lerp:(a,b,t)=>a+(b-a)*t,
  document:{querySelectorAll:()=>[],createDocumentFragment:()=>({children:[],append(n){this.children.push(n);}}),
    createElementNS:()=>({attrs:{},setAttribute(k,v){this.attrs[k]=v;}})}
};
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('function forestTreeFits('),source.indexOf('function journeyPointAtY(')),context);
const anchors=[{x:360,y:0,routeBoundary:'exit'},{x:620,y:640,routeBoundary:'entry'}];
context.buildJourneyForest(anchors);
const road = Array.from({length:129},(_,i)=>{const p=context.forestRoadPoint(anchors,i*5);return `${i?'L':'M'}${p.x} ${p.y}`;}).join(' ');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="640" viewBox="0 0 1000 640">${defs}<path fill="#f3f2e8" d="M0 0H1000V640H0Z"/>${trees.map(n=>`<use ${Object.entries(n.attrs).map(([k,v])=>`${k}="${v}"`).join(' ')}/>`).join('')}<path d="${road}" fill="none" stroke="#dce5d4" stroke-width="84"/><path d="${road}" fill="none" stroke="#f2bb41" stroke-width="4" stroke-dasharray="18 18"/></svg>`;
sharp(Buffer.from(svg)).png().toFile(path.resolve(root,'../../.tmp-forest-vector-preview.png')).then(()=>console.log('Vector asset preview rendered.'));
const destination = html.match(/<svg class="destination-base" viewBox="0 0 620 620">([\s\S]*?)<\/svg>/)[1].replace(/\sdata-[\w-]+(?=[\s>])/g,'');
const destinationSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="620" viewBox="0 0 620 620">${defs}<style>.destination-road-edge{stroke:#bbcdb2}.destination-road-dash{stroke:#e6b742}.destination-road-orange{stroke:#ed6b1d}</style>${destination}</svg>`;
sharp(Buffer.from(destinationSvg)).png().toFile(path.resolve(root,'../../.tmp-destination-tree-preview.png')).then(()=>console.log('Destination vector asset preview rendered.'));
