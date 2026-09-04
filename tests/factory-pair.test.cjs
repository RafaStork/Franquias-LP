const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const js = fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const css = fs.readFileSync(path.join(__dirname,'../styles.css'),'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(js.slice(js.indexOf('function factoryLoadingPhase('),js.indexOf('function destinationEntrancePoint(')),context);
assert.equal(context.factoryLoadingPhase(0),0);
assert.equal(context.factoryLoadingPhase(.08),0);
assert(Math.abs(context.factoryLoadingPhase(.86)-1)<1e-12);
assert.equal(context.factoryLoadingPhase(1),1);
let previous=0;
for(let i=0;i<=1000;i++) {
  const phase=context.factoryLoadingPhase(i/1000);
  assert(phase>=previous && phase-previous<=.0013,'Single continuous loading timeline');
  previous=phase;
}
for(const scale of [.26,.34,.52,.78,1]) for(const angle of [-180,-97,0,83,90,180,270]) for(const lift of [0,.25,.5,1]) {
  const pose={x:230,y:320,angle,zoom:1+lift*.18};
  const [a,b]=context.factoryPanelPair(pose,scale);
  assert(Math.abs((a.x+b.x)/2-pose.x)<1e-8);
  assert(Math.abs((a.y+b.y)/2-pose.y)<1e-8);
  assert.equal(a.angle,b.angle);
  assert.equal(a.zoom,b.zoom);
  assert(Math.abs(Math.hypot(a.x-b.x,a.y-b.y)-35*scale*pose.zoom)<1e-8,'Rigid pair spacing while lifting');
}
const [one,two]=context.factoryPanelPair({x:106,y:69.5,angle:0,zoom:1},1);
assert.equal(one.x,106);assert.equal(one.y,52);
assert.equal(two.x,106);assert.equal(two.y,87);
assert(js.includes('const cargoTwoCycle = cargoOneCycle;'));
assert(!/cargoSwitch|panelTwoSpec|sourceTwoRaw|cargoTwoLoad/.test(js),'Second trip returned');
assert(js.includes('factoryPanelPair(panelPoseFor(cargoOneCycle,panelOneSpec),vehicleUnitScale)'));
assert(js.includes('if (cycle.phase < .2) return { x: spec.source.x, y: spec.source.y'),'Panels must stay on ground until contact');
assert(js.includes('const departureProgress = clamp((loadingProgress - .9) / .1)'),'Keep gradual truck departure after loading');
assert(css.includes('height: 620svh')&&css.includes('height: 680svh'));
assert(!css.includes('height: 1020svh')&&!css.includes('height: 1080svh'));
console.log('PASS: one loading cycle, rigid two-panel rotation/lift, exact truck slots and shortened scroll.');
