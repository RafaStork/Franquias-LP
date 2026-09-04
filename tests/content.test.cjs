const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

assert(html.indexOf('id="empresa"') < html.indexOf('id="oportunidade"'));
assert.match(html, /desde 1985/);
assert.match(html, /40<span>\+<\/span>/);
assert(html.indexOf('<h3>Análise da COF') < html.indexOf('<h3>Contrato de franquia'));
assert(html.indexOf('<h3>Contrato de franquia') < html.indexOf('<h3>Implantação e treinamento'));
assert.equal((html.match(/class="faq-answer"/g) || []).length, 6);
for (const text of ['R$ 380 mil', '90 dias', '12 meses', 'não de uma garantia de retorno', 'turismo de experiência']) assert(html.includes(text), text);
for (const field of ['recurso_investimento', 'envolvimento_operacao']) assert(html.includes(`name="${field}"`));
assert(!/name="(?:capital|prazo)"/.test(html));
const involvement = html.match(/name="envolvimento_operacao"[\s\S]*?<\/select>/)[0];
assert.equal((involvement.match(/<option/g) || []).length, 4);

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate IDs');
for (const match of html.matchAll(/aria-controls="([^"]+)"/g)) assert(ids.includes(match[1]), `Missing controlled element: ${match[1]}`);
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]), `Missing fragment: ${match[1]}`);
const assets = new Set();
for (const match of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)(?:[?#][^"]*)?"/g)) assets.add(match[1]);
for (const match of html.matchAll(/srcset="([^"]+)"/g)) for (const item of match[1].split(',')) assets.add(item.trim().split(/\s+/)[0]);
for (const asset of assets) assert(fs.existsSync(path.join(root, asset)), `Missing asset: ${asset}`);
for (const tag of html.match(/<img\b[^>]*>/g)) assert(/\balt=/.test(tag), 'Image without alternative text');
assert.match(js, /\["#empresa", mobile \? mobileLane : gridCorridorX\("\.company-grid"/);
assert.match(js, /layoutObserver\.observe\(section\)/);
assert(!html.includes('comparison-verdict'), 'Comparison symbols should be inside table headers');
assert.match(html, /role="columnheader"><i class="comparison-cross"/);
assert.match(html, /role="columnheader"><i class="comparison-check"/);
assert.match(html, /class="market-highlight"/);
assert(html.includes('chale-sistema-1600.webp'));
assert(html.includes('chale-faq-expandido-992.webp'));
assert(!html.includes('empresa-detalhe-'));
assert(!html.includes('journey-tree-crown'));
for (let variant = 1; variant <= 8; variant++) assert(html.includes(`<symbol id="forest-09-${variant}"`));
for (const variant of [7,8]) {
  const symbol = html.match(new RegExp(`<symbol id="forest-09-${variant}"[\\s\\S]*?</symbol>`))[0];
  assert.equal((symbol.match(/<path/g)||[]).length,1,'Rear trees must remain single-path vectors');
  assert(!/filter=|<image/.test(symbol));
}
assert.equal((html.match(/class="photo-blend"/g) || []).length, 2);
assert(!html.includes('class="faq-photo"'));
assert(html.includes('<span class="faq-title-word">expansão.</span>'));
assert.match(css,/\.faq-title-word \{ white-space: nowrap;/);
assert.match(css,/\.faq-intro h2 \{[^}]*14cqi[^}]*hyphens: none;/);
assert.match(css,/\.faq-grid \{ grid-template-columns: minmax\(0, 1fr\) clamp\(180px, 15vw, 215px\) minmax\(0, 1\.1fr\);/);
assert(html.includes('clip-path="url(#forest-viewport-clip)"'));
assert.match(html, /class="faq-intro">\s*<div class="faq-intro-copy">[\s\S]*?faq-intro-note[\s\S]*?<\/div>\s*<picture class="faq-backdrop"/);
assert.match(css, /\.faq-backdrop \{ display: block; position: absolute; inset: 0;/);
assert.match(css, /\.faq-backdrop img \{[^}]*height: 100%; object-fit: cover; object-position: center bottom;/);
assert.match(css, /grid-template-rows: minmax\(max-content, 13fr\) 7fr/,'Keep copy in upper 65% of the expanded photograph');
assert.match(css, /\.faq-intro::after \{ content: ""; grid-row: 2;/,'Reserve lower area for chalet');
assert.match(css, /\.faq-intro::after \{[^}]*min-height: 56cqi/,'Prevent a short panel cropping the generated sky and lifting the chalet behind copy');
for(const width of [208,254,284,360,460,620]) for(const copyHeight of [200,400,600]) {
  const height = Math.max(copyHeight / 13, width * .56 / 7) * 20;
  const scale = Math.max(width / 992, height / 1586);
  const roofY = height - (1586 - 1138) * scale;
  assert(roofY > height * .65, 'Chalet roof must remain below the text track');
}
for(const width of [600,992]) assert(fs.statSync(path.join(root,`assets/chale-faq-expandido-${width}.webp`)).size < 150000,'Outpaint must remain lightweight');
assert.match(html, /id="oportunidade"[^>]*>\s*<picture class="manifesto-backdrop"[\s\S]*?<\/picture>\s*<div class="section-shell manifesto-grid">/);
assert(!html.includes('class="manifesto-intro"'), 'Opportunity photo must not be confined to a side panel');
assert.match(css, /\.manifesto-backdrop img \{[^}]*width: 100%; height: 100%; object-fit: cover; object-position: 57% 56%;/);
assert.match(js, /\? opportunityRouteAnchors\(x\) : sectionRouteAnchors\(selector, x\)/);
assert.match(css, /\.liquid-glass-panel,\s*\.profile-items \{[^}]*border-radius: 24px[^}]*backdrop-filter: blur\(28px\) saturate\(145%\)/);
assert(html.includes('class="manifesto-copy liquid-glass-panel"'));
assert(css.includes('width: min(100%, 340px)'));
assert(!css.includes('margin-right: min(0px, calc((1320px - 100vw) / 2 + 24px))'), 'Keep the same outer gutters on both sides');
assert(css.includes('margin-inline: 0;'));
assert(css.includes('.manifesto-copy.liquid-glass-panel { grid-row: 3; }'));
assert(css.includes('height: var(--opportunity-photo-space)'));
assert(js.includes('opportunityTitle.offsetHeight - layoutTop(opportunity)'));
assert.match(css, /\.profile-items > div:first-child \{ border-top: 0; \}/);
assert.match(css, /\.profile-items > div:last-child \{ border-bottom: 0; \}/);
const testimonialCards = [...html.matchAll(/<article class="testimonial-card[^\"]*">([\s\S]*?)<\/article>/g)].map(match=>match[1]);
assert.equal(testimonialCards.length, 3);
for (const [index, name, city, initials] of [[0,'Lucas Rabelo','Palhoça-SC e Araranguá-SC','LR'], [1,'Lucas Miranda','Ribeirão Preto-SP','LM'], [2,'Tiago','Blumenau-SC','T']]) {
  assert(testimonialCards[index].includes(`<strong>${name}</strong>`));
  assert(testimonialCards[index].includes(city));
  assert(testimonialCards[index].includes(`aria-hidden="true">${initials}</span>`));
}
for (const selector of ['.testimonial-card blockquote', '.testimonial-card footer', '.testimonial-tag']) {
  assert(js.match(/const protectedRects = \[\.\.\.document.querySelectorAll\("([^"]+)"\)/)[1].split(', ').includes(selector));
}
assert(!html.includes('Prazos e condições variam conforme projeto, terreno, licenças, logística e escopo contratado.'));
assert(!html.includes('Conteúdo provisório para aprovação visual — substituir pelos depoimentos reais antes da publicação comercial.'));
assert.match(css, /\.profile-items p \{ color: #fff; font-weight: 550;/);
assert.match(css, /\.faq-intro \.faq-intro-note \{[^}]*color: #fff;/);
assert(!css.includes('liquidGlassShine') && !css.includes('liquidGlassDrift'),'Header illumination animation returned');
assert(css.includes('backdrop-filter: blur(28px) saturate(145%)'),'Preserve liquid glass');
const luminance = rgb => rgb.map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
const faqWorstBackground = [8,22,9].map(n=>n*.68+255*.32);
for(const color of [[255,255,255],[255,226,163]]) {
  assert((luminance(color)+.05)/(luminance(faqWorstBackground)+.05)>=4.5,'FAQ copy background contrast');
}
// Both panels occupy the right column, where the section overlay is at least .65.
// Mobile has stronger section overlays. Sample the actual green gradient stops.
assert(css.includes('rgba(8,22,9,.65) 43%'), 'Recheck contrast if the profile overlay changes');
for (const [rgb, alpha] of [[[55,96,50],.60],[[24,63,27],.50],[[62,100,53],.60]]) {
  assert(css.includes(`rgba(${rgb.join(',')},.${Math.round(alpha*100)})`));
  const background = rgb.map((n,i)=>(n*alpha+([8,22,9][i]*.65+255*.35)*(1-alpha))*.92+255*.08);
  for (const color of [[255,255,255],[255,242,213]]) assert((luminance(color)+.05)/(luminance(background)+.05)>=4.5,'Green glass text contrast');
}
assert(html.includes('perfil-franqueado-1600.webp'));
assert(!html.includes('forest-paper-key'));
const destinationTrees = html.match(/<g class="destination-trees">([\s\S]*?)<\/g>/)[1];
assert.equal((destinationTrees.match(/<use /g)||[]).length,3,'Keep three destination trees');
assert(!/<circle|rotate\(/.test(destinationTrees),'Destination trees must use upright forest variants');
assert.equal(new Set([...destinationTrees.matchAll(/href="([^"]+)"/g)].map(match=>match[1])).size,3,'Vary the destination trees');
const destinationCenters = [...destinationTrees.matchAll(/x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)]
  .map(([,x,y,w,h])=>[+x+w/2,+y+h/2]);
assert.deepEqual(destinationCenters,[[75,115],[550,105],[570,520]],'Destination tree centers moved');
assert(html.includes('Montserrat-Variable.woff2'));
assert(css.includes('format("woff2")'));
assert(!html.includes('Montserrat-Variable.ttf'));
assert.match(html, /<img src="\.\/assets\/brazil-states-map-natural-earth.svg"[^>]*loading="lazy"/);
for (const selector of ['.company-photos img', '.faq-photo img', '.photo-blend']) {
  const rules = css.split('}').filter(rule => rule.includes(selector));
  assert(rules.every(rule => !rule.includes('mask-image')), `Rejected edge fade remains: ${selector}`);
}
assert.match(css, /\.comparison-row > span:nth-child\(2\) \{ background: #f3e3d9;/);

const geometry = js.slice(js.indexOf('function forestTreeFits('), js.indexOf('function buildJourneyForest('));
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${geometry}; this.fits = forestTreeFits;`, sandbox);
for (const width of [320,360,390,430,720,768,1024,1440,1920]) {
  const radius = width <= 720 ? 12 : 30;
  const road = [{x:width/2,y:200}];
  assert(!sandbox.fits({x:width/2,y:200,radius},width,[],road,[],30), 'Tree on road');
  assert(!sandbox.fits({x:3,y:200,radius},width,[],[],[],30), 'Tree outside viewport');
  assert(!sandbox.fits({x:width/2,y:200,radius},width,[],[{x:0,y:100},{x:width,y:300}],[],30), 'Tree between road samples');
  assert(!sandbox.fits({x:width/2,y:200,radius},width,[{left:width/2-8,right:width/2+8,top:190,bottom:210}],[],[],30), 'Tree on text');
  assert(!sandbox.fits({x:width/2,y:200,radius},width,[],[],[{x:width/2,y:210,radius}],30), 'Overlapping trees');
  assert(sandbox.fits({x:width/2,y:400,radius},width,[],road,[],30), 'Free roadside space rejected');
}
// Test horizontal distribution in a free transition fixture (not browser layout QA).
const forestSource = js.slice(js.indexOf('function forestTreeFits('), js.indexOf('function journeyPointAtY('));
for (const width of [320,360,390,430,720,768,1024,1440,1920]) {
  let placed = [];
  const context = {
    journeyForest: {replaceChildren(fragment) { placed = fragment.children; }},
    journeyRoute: {}, journeyViewportWidth: () => width,
    journeyPointAtY: y => ({x: width / 2, y, angle:90}),
    lerp: (a,b,t) => a+(b-a)*t,
    clamp: (n,min,max) => Math.min(max,Math.max(min,n)),
    document: {
      querySelectorAll: () => [],
      createDocumentFragment: () => ({children:[],append(node){this.children.push(node);}}),
      createElementNS: () => ({attributes:{},setAttribute(k,v){this.attributes[k]=v;}})
    }
  };
  vm.createContext(context);
  vm.runInContext(`${forestSource}; buildJourneyForest([{x:${width/2},y:100,routeBoundary:'exit'},{x:${width/2},y:650,routeBoundary:'entry'}]);`, context);
  const xs = placed.map(node => Number(node.attributes.transform.match(/translate\(([-\d.]+)/)[1]));
  assert(xs.length > 10, `Insufficient horizontal grove at ${width}`);
  assert(Math.min(...xs) < width*.25 && Math.max(...xs) > width*.75, `Grove restricted to road edge at ${width}`);
  assert(placed.every(node => /^#forest-09-[1-8]$/.test(node.attributes.href)));
  assert(placed.every(node => node.attributes.filter === undefined));
  assert(!forestSource.includes('"image"'), 'Raster trees must not return');
  const understory = placed.filter(node => node.attributes['data-canopy-layer'] === '0');
  const crowns = placed.filter(node => node.attributes['data-canopy-layer'] === '1');
  const shadows = placed.filter(node => node.attributes['data-canopy-layer'] === '-1');
  assert(placed.every(node => node.attributes['data-forest-edge'] === undefined),'Separate edge wall returned');
  const cropped = placed.filter(node => {
    const x = +node.attributes.transform.match(/translate\(([-\d.]+)/)[1];
    const radius = +node.attributes.width / 2;
    return x - radius < 0 || x + radius > width;
  });
  assert(cropped.length >= 4, `Ordinary crowns should continue beyond viewport at ${width}`);
  assert(cropped.some(node => node.attributes['data-canopy-layer'] === '1'),'Screen edge needs normal branched crowns too');
  assert(new Set(cropped.map(node => node.attributes.transform.split(' ')[0])).size > 3,'Edge crowns aligned into a vertical wall');
  assert(shadows.length >= 3, `Missing rear gap filler at ${width}`);
  assert(shadows.every(node => /forest-09-[78]$/.test(node.attributes.href)));
  const firstForeground = placed.findIndex(node => node.attributes['data-canopy-layer'] !== '-1');
  assert(placed.slice(firstForeground).every(node => node.attributes['data-canopy-layer'] !== '-1'), 'Rear shade covers foreground trees');
  assert(understory.length > 15, `Sparse understory at ${width}`);
  assert(crowns.length >= 2, `Missing broad crowns at ${width}`);
  assert(understory.every(node => /forest-09-[34]$/.test(node.attributes.href)));
  assert(crowns.every(node => /forest-09-[1256]$/.test(node.attributes.href)));
  assert(crowns.every(node => /rotate\(0\)$/.test(node.attributes.transform)), 'Branched trees must stay upright');
  assert(new Set(crowns.map(node => node.attributes.href)).size >= 2, `Repeated crown variant at ${width}`);
  if (width >= 1440) assert.equal(new Set(crowns.map(node => node.attributes.href)).size,4,'All four broad-crown variants should be used');
  const shapes = placed.map(node => {
    const [,x,y] = node.attributes.transform.match(/translate\(([-\d.]+) ([-\d.]+)\)/);
    return {x:+x,y:+y,r:+node.attributes.width*.35,shadow:node.attributes['data-canopy-layer']==='-1'};
  });
  let newlyCovered = 0;
  for(let y=140;y<610;y+=12) for(let x=20;x<width-20;x+=12) {
    const covers = tree => Math.hypot(tree.x-x,tree.y-y)<tree.r;
    if(!shapes.some(tree=>!tree.shadow&&covers(tree)) && shapes.some(tree=>tree.shadow&&covers(tree))) newlyCovered++;
  }
  assert(newlyCovered>5,`Rear trees are not filling gaps at ${width}`);
  const firstCrown = placed.findIndex(node => node.attributes['data-canopy-layer'] === '1');
  assert(placed.slice(firstCrown).every(node => node.attributes['data-canopy-layer'] === '1'), 'Understory covers visible branches');
  assert(Math.min(...crowns.map(node=>+node.attributes.width)) > Math.max(...understory.map(node=>+node.attributes.width)), 'Crown sizes do not match approved hierarchy');
  for (const node of placed) {
    const x = Number(node.attributes.transform.match(/translate\(([-\d.]+)/)[1]);
    const radius = Number(node.attributes.width) / 2;
    assert(Math.abs(x-width/2) >= radius + (width<=720 ? 27 : 58), `Crown overlaps road at ${width}`);
  }
}
const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,'');
let braces = 0;
for (const char of cleanCss) { if(char==='{')braces++; if(char==='}')braces--; assert(braces>=0,'Invalid CSS nesting'); }
assert.equal(braces,0,'Unbalanced CSS');
console.log(`PASS: content, six FAQ answers, fields, ${assets.size} local references, CSS and roadside geometry at nine widths.`);
