const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
const forestSource = source.slice(source.indexOf('function forestTreeFits('), source.indexOf('function journeyPointAtY('));
for (const width of [390, 768, 1440, 1920]) {
  let count = 0, routeQueries = 0, renders = 0;
  const context = {
    journeyForest: {replaceChildren(fragment) { count = fragment.children.length; renders++; }},
    journeyRoute: {}, journeyViewportWidth: () => width,
    journeyPointAtY: y => { routeQueries++; return {x:width/2,y}; },
    lerp: (a,b,t) => a+(b-a)*t, clamp:(n,min,max)=>Math.min(max,Math.max(min,n)),
    document: {querySelectorAll:()=>[], createDocumentFragment:()=>({children:[],append(n){this.children.push(n);}}),
      createElementNS:()=>({setAttribute(){}})}
  };
  vm.createContext(context);
  vm.runInContext(forestSource, context);
  const anchors = Array.from({length:10}, (_,i)=>[
    {x:width/2,y:100+i*1500,routeBoundary:'exit'},
    {x:width/2,y:650+i*1500,routeBoundary:'entry'}]).flat();
  const start = performance.now();
  context.buildJourneyForest(anchors);
  const elapsed = performance.now()-start;
  console.log(JSON.stringify({width, instances:count, routeQueries, elapsedMs:Math.round(elapsed)}));
  if (source.includes('forestLayoutKey')) {
    assert(count < 2000, 'Forest instance budget exceeded');
    assert.equal(routeQueries, 0, 'Forest must not seek the full SVG route for each candidate');
    context.buildJourneyForest(anchors);
    assert.equal(renders,1,'Unchanged layout rebuilt the forest');
    anchors[1].y += 30;
    context.buildJourneyForest(anchors);
    assert.equal(renders,2,'Changed layout failed to invalidate the forest');
  }
}
