// Rasterize actual vectors: small interior clearings are intentional; outer edges stay filled.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sharp = require('C:/Users/Rafael/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(__dirname,'..');
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
const js = fs.readFileSync(path.join(root,'app.js'),'utf8');
const defs = html.match(/<defs>\s*<!-- Option 09[\s\S]*?<\/defs>/)[0];
(async()=>{
  for(const width of [390,768,1440,1920]) {
    const height=640;
    let trees=[];
    const context={journeyForest:{replaceChildren(f){trees=f.children;}},journeyRoute:{},journeyViewportWidth:()=>width,
      clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),lerp:(a,b,t)=>a+(b-a)*t,
      document:{querySelectorAll:()=>[],createDocumentFragment:()=>({children:[],append(n){this.children.push(n);}}),
        createElementNS:()=>({attrs:{},setAttribute(k,v){this.attrs[k]=v;}})}};
    vm.createContext(context);
    vm.runInContext(js.slice(js.indexOf('function forestTreeFits('),js.indexOf('function journeyPointAtY(')),context);
    context.buildJourneyForest([{x:width*.36,y:0,routeBoundary:'exit'},{x:width*.62,y:height,routeBoundary:'entry'}]);
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${defs}${trees.map(n=>`<use ${Object.entries(n.attrs).map(([k,v])=>`${k}="${v}"`).join(' ')}/>`).join('')}</svg>`;
    const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const visited=new Uint8Array(width*height),queue=new Int32Array(width*height);
    let holes=0,largest=0;
    for(let start=0;start<visited.length;start++) {
      if(visited[start]||data[start*info.channels+3]>=128)continue;
      let head=0,tail=1,touchesEdge=false;queue[0]=start;visited[start]=1;
      while(head<tail) {
        const p=queue[head++],x=p%width,y=Math.floor(p/width);
        if(x===0||y===0||x===width-1||y===height-1)touchesEdge=true;
        const neighbors=[];
        if(x>0)neighbors.push(p-1);if(x<width-1)neighbors.push(p+1);
        if(y>0)neighbors.push(p-width);if(y<height-1)neighbors.push(p+width);
        for(const n of neighbors)if(!visited[n]&&data[n*info.channels+3]<128){visited[n]=1;queue[tail++]=n;}
      }
      if(!touchesEdge&&tail>4){holes++;largest=Math.max(largest,tail);}
    }
    console.log(JSON.stringify({width,enclosedGaps:holes,largestGapPixels:largest}));
    if(width>=768)assert(holes>0,`Interior clearings disappeared at ${width}px`);
    for(const x of [0,width-1]) {
      let covered=0;
      for(let y=20;y<height-20;y++) if(data[(y*width+x)*info.channels+3]>=128)covered++;
      assert(covered/(height-40)>.65,`Grove does not continue to screen edge at ${width}:${x}`);
    }
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
