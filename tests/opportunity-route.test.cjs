const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../styles.css'),'utf8');
const limit=(n,a,b)=>Math.max(a,Math.min(b,n));
const context={};
vm.createContext(context);
vm.runInContext(source.slice(source.indexOf('function opportunityPhotoObstacles('),source.indexOf('function opportunityRouteAnchors(')),context);
let cases=0,cleared=0;
for(const width of [320,360,390,430,720,768,1024,1280,1440,1920,2560]) {
  const mobile=width<=720,tablet=width<=1000&&!mobile;
  const shell=mobile?width-24:tablet?width-32:Math.min(1320,width-48);
  const shellLeft=(width-shell)/2;
  const gap=tablet?limit(width*.024,18,28):limit(width*.025,22,36);
  const middle=tablet?limit(width*.15,112,145):limit(width*.15,170,210);
  const first=(shell-middle-2*gap)*(tablet?.5:.575);
  const titleRight=mobile?width-112:shellLeft+first-limit(width*.11,80,200);
  const copyLeft=mobile?width:shellLeft+first+middle+2*gap;
  const truckWidth=mobile?72:tablet?limit(width*.14,94,126):limit(width*.11,118,154);
  const edge=Math.hypot(truckWidth,truckWidth*140/270)/2+12;
  const side=truckWidth*140/270/2+18;
  for(const height of [650,800,1000]) {
    const building=context.opportunityPhotoObstacles({left:0,top:2000,width,height})[0];
    const preferred=mobile?Math.min(width-38,width*.91):shellLeft+first+gap+middle/2;
    const x=context.opportunityLane(width,building,truckWidth,titleRight,copyLeft,preferred);
    assert(x>=edge-.001&&x<=width-edge+.001,'Whole truck must remain on screen');
    assert(x>=titleRight+side-.001,'Truck touches reduced title');
    assert(x<=copyLeft-side+.001,'Truck touches body copy');
    if(!mobile && building.left-side>=titleRight+side) {
      assert(Math.abs(x-(building.left-side))<.001,'Must use the marked lane beside the chalet');
      cleared++;
    }
    cases++;
  }
}
// Reference position: chalet/deck begins at x=810; marked line is near x=765.
assert(Math.abs(context.opportunityLane(1600,{left:810},126,650,1146,940)-759.3333333333334)<.001);
assert(!source.includes('planOpportunityBypass'),'Rejected zig-zag planner returned');
assert(source.includes('{x,y:box.top+40,routeSection:"#oportunidade",routeBoundary:"entry"}'));
assert(source.includes('{x,y:box.bottom-40,routeSection:"#oportunidade",routeBoundary:"exit"}'));
assert(css.includes('width: calc(100% - clamp(80px, 11vw, 200px))'));
assert(css.includes('.manifesto h2 { font-size: min(4rem, 14cqi)'));
assert(css.includes('object-position: 57% 56%'),'Preserve photo framing');
// Long blank neighboring bands, not a tight bend next to the title.
assert(css.includes('.company-story { padding-bottom: calc(clamp(92px, 12vw, 184px) + clamp(160px, 18vw, 340px))'));
assert(css.includes('.pillars { padding-top: calc(clamp(90px, 11vw, 160px) + clamp(160px, 18vw, 340px))'));
assert(source.includes('Math.max(entryInset,topPadding-curveGuard)'));
assert(source.includes('Math.max(exitInset,bottomPadding-curveGuard)'));
for (const width of [320,360,390,430,600,720]) {
  const height = limit(width*.85,340,560);
  const chalet = context.opportunityPhotoObstacles({left:0,top:0,width,height})[0];
  assert(chalet.left >= 0 && chalet.right <= width, 'Mobile chalet must fit horizontally in its dedicated photo band');
  assert(chalet.top >= height*.12 && chalet.bottom <= height*.88, 'Roof and supports must remain inside the unfaded photo band');
}
console.log('PASS: '+cases+' responsive lane fixtures; '+cleared+' desktop cases reach the chalet-side target. Straight passage, extended entry/exit bands and six mobile photo frames verified.');
