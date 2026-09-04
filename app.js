"use strict";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, amount) => a + (b - a) * amount;
const lerpAngle = (a, b, amount) => a + ((((b - a) % 360) + 540) % 360 - 180) * amount;
const smooth = (start, end, value) => {
  const amount = clamp((value - start) / Math.max(.0001, end - start));
  return amount * amount * (3 - 2 * amount);
};
const craneArc = (startY, apexY, endY, progress, settleStart = .64) => progress < settleStart
  ? lerp(startY, apexY, smooth(0, settleStart, progress))
  : lerp(apexY, endY, smooth(settleStart, 1, progress));
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

const journeyLayer = document.querySelector("[data-site-journey]");
const journeySvg = journeyLayer?.querySelector("[data-journey-svg]");
const journeyRoute = journeyLayer?.querySelector("[data-journey-route]");
const journeyRouteDash = journeyLayer?.querySelector("[data-journey-route-dash]");
const journeyRouteProgress = journeyLayer?.querySelector("[data-journey-route-progress]");
const journeyForest = journeyLayer?.querySelector("[data-journey-forest]");
const journeyVehicle = journeyLayer?.querySelector("[data-journey-vehicle]");
const journeyVehicleCargo = journeyLayer?.querySelector("[data-journey-vehicle-cargo]");
const journeyVehicleGraphic = journeyVehicle?.querySelector("svg");
const journeyCargoSvg = journeyVehicleCargo?.querySelector("svg");
const journeyCargoOne = journeyLayer?.querySelector("[data-journey-cargo-one]");
const journeyCargoTwo = journeyLayer?.querySelector("[data-journey-cargo-two]");
const journeyLoader = journeyLayer?.querySelector("[data-journey-loader]");
const journeyLoaderUnderlay = journeyLayer?.querySelector("[data-journey-loader-underlay]");
const journeyLoaderCable = journeyLayer?.querySelector("[data-journey-loader-cable]");
const heroJourney = document.querySelector(".motion-chapter--factory");
const factoryHeroCopy = heroJourney?.querySelector(".hero-copy");
const journeyDestination = document.querySelector("[data-journey-destination]");
const destinationFrame = journeyDestination?.querySelector(".journey-destination-frame");
const destinationVisual = journeyDestination?.querySelector(".destination-visual");
const destinationVisualSvg = journeyDestination?.querySelector(".destination-visual svg");
const destinationRoad = journeyDestination?.querySelector("[data-destination-road]");
const destinationRoadPath = journeyDestination?.querySelector("[data-destination-road-path]");
const destinationRoadEdge = journeyDestination?.querySelector("[data-destination-road-edge]");
const destinationRoadOrange = journeyDestination?.querySelector("[data-destination-road-orange]");
const destinationRoadDash = journeyDestination?.querySelector("[data-destination-road-dash]");
const destinationMachinery = journeyLayer?.querySelector(".destination-machinery");
const destinationMachinerySvg = destinationMachinery?.querySelector("[data-destination-machinery]");
const destinationModules = destinationMachinery?.querySelector("[data-destination-modules]");
const destinationModule = destinationMachinery?.querySelector("[data-destination-module]");
const destinationModuleTwo = destinationMachinery?.querySelector("[data-destination-module-two]");
const destinationArmBase = destinationMachinery?.querySelector("[data-destination-arm-base]");
const destinationArmFore = destinationMachinery?.querySelector("[data-destination-arm-fore]");
const destinationCable = destinationMachinery?.querySelector("[data-destination-cable]");
const destinationElbow = destinationMachinery?.querySelector("[data-destination-elbow]");
const destinationHook = destinationMachinery?.querySelector("[data-destination-hook]");
const destinationJoint = destinationMachinery?.querySelector("[data-destination-joint]");
const destinationRoof = journeyDestination?.querySelector("[data-destination-roof]");
const destinationRoofLeft = journeyDestination?.querySelector("[data-destination-roof-left]");
const destinationRoofRight = journeyDestination?.querySelector("[data-destination-roof-right]");
const destinationRoofDetails = journeyDestination?.querySelector("[data-destination-roof-details]");
const destinationDeck = journeyDestination?.querySelector("[data-destination-deck]");
const destinationFinishDetails = journeyDestination?.querySelector("[data-destination-finish-details]");
const destinationBeats = [...(journeyDestination?.querySelectorAll("[data-destination-beat]") || [])];
const destinationRoadPaths = [destinationRoadEdge, destinationRoadPath, destinationRoadOrange];
const destinationRoadDesktopD = "M250-35C250 140 240 290 210 390C193 438 195 470 220 490C232 500 248 503 265 503";
const destinationRoadMobileD = "M500-35C500 42 458 105 350 150C286 220 246 306 210 390C193 438 195 470 220 490C232 500 248 503 265 503";
const truckShadowTargets = [...document.querySelectorAll("main h1, main h2, main h3, main p, main summary, main .comparison-row > *, main .profile-mark")]
  .filter((target) => !target.closest(".journey-destination"));

let journeyRouteLength = 1;
let journeyStartScroll = 0;
let journeyStartY = 0;
let journeyEndY = 0;
let journeyTargetScroll = window.scrollY;
let journeyCurrentScroll = window.scrollY;
let journeyFrame = 0;
let journeyVisualAngle = 90;
let journeyAngleRemaining = 0;
let journeyLayoutWidth = document.documentElement.clientWidth || window.innerWidth;

function journeyViewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth;
}

function journeyX(ratio) {
  const viewportWidth = journeyViewportWidth();
  const edge = viewportWidth <= 720 ? 38 : 86;
  return clamp(viewportWidth * ratio, edge, viewportWidth - edge);
}

function gridCorridorX(selector, columnIndex = 1, fallbackRatio = .5) {
  const grid = document.querySelector(selector);
  if (!grid || journeyViewportWidth() <= 720) return journeyX(.91);
  const style = getComputedStyle(grid);
  const columns = [...style.gridTemplateColumns.matchAll(/([\d.]+)px/g)].map((match) => Number(match[1]));
  if (columns.length <= columnIndex) return journeyX(fallbackRatio);
  const gap = parseFloat(style.columnGap) || 0;
  const rect = grid.getBoundingClientRect();
  const preceding = columns.slice(0, columnIndex).reduce((sum, width) => sum + width, 0);
  return clamp(rect.left + preceding + gap * columnIndex + columns[columnIndex] * .5, 38, journeyViewportWidth() - 38);
}

function mobileReservedLaneX(selector, fallbackRatio = .91) {
  const container = document.querySelector(selector);
  if (!container || journeyViewportWidth() > 720) return journeyX(fallbackRatio);
  const style = getComputedStyle(container);
  const reservedWidth = parseFloat(style.getPropertyValue("--journey-mobile-reserve")) || 94;
  const rect = container.getBoundingClientRect();
  const laneInset = Math.max(36, reservedWidth * .42);
  return clamp(rect.right - laneInset, 38, journeyViewportWidth() - 38);
}

function sectionRouteAnchors(selector, x) {
  const section = document.querySelector(selector);
  if (!section) return [];
  const inset = Math.min(section.offsetHeight * .28, Math.max(130, window.innerHeight * .3));
  const protectedEntries = new Set(["#oportunidade", "#vantagens", "#perfil", "#territorios", "#duvidas"]);
  const transitionExits = new Set(["#oportunidade", "#processo", "#vantagens", "#perfil", "#territorios"]);
  const protectsVisualEntry = protectedEntries.has(selector);
  const entryInset = protectsVisualEntry
    ? Math.min(inset, Math.max(80, window.innerHeight * .12))
    : inset;
  const bottomPadding = parseFloat(getComputedStyle(section).paddingBottom) || inset;
  const exitInset = transitionExits.has(selector) && journeyViewportWidth() > 720
    ? Math.max(inset, bottomPadding - 72)
    : inset;
  const curveGuard = journeyViewportWidth() <= 720 ? 64 : 112;
  const topPadding = parseFloat(getComputedStyle(section).paddingTop) || inset;
  return [
    { x, y: section.offsetTop + (selector === "#modelo" ? Math.max(entryInset,topPadding-curveGuard) : entryInset), routeSection: selector, routeBoundary: "entry" },
    { x, y: section.offsetTop + section.offsetHeight - (selector === "#empresa" ? Math.max(exitInset,bottomPadding-curveGuard) : exitInset), routeSection: selector, routeBoundary: "exit" }
  ];
}

// Project the photographed buildings through the original CSS cover crop.
// Source coordinates include roof, deck and supports, but not water reflections.
function opportunityPhotoObstacles(box, sourceWidth = 1600, sourceHeight = 1067) {
  const scale = Math.max(box.width / sourceWidth, box.height / sourceHeight);
  const imageWidth = sourceWidth * scale, imageHeight = sourceHeight * scale;
  const imageLeft = box.left + (box.width - imageWidth) * .57;
  const imageTop = box.top + (box.height - imageHeight) * .56;
  return [[.447, .382, .722, .753], [.802, .464, 1, .754]].map(([l,t,r,b]) => ({
    left: Math.max(box.left, imageLeft + l * imageWidth),
    right: Math.min(box.left + box.width, imageLeft + r * imageWidth),
    top: Math.max(box.top, imageTop + t * imageHeight),
    bottom: Math.min(box.top + box.height, imageTop + b * imageHeight)
  })).filter(rect => rect.right > rect.left && rect.bottom > rect.top);
}

function opportunityLane(width, building, truckWidth, titleRight, copyLeft, preferredX) {
  const limit = (n,a,b) => Math.max(a,Math.min(b,n));
  const edge = Math.hypot(truckWidth,truckWidth*140/270)/2+12;
  const lateral = truckWidth*140/270/2+18;
  const low = Math.max(edge,titleRight+lateral);
  const high = Math.min(width-edge,copyLeft-lateral);
  // The marked line is just left of the chalet/deck, not the old grid center.
  // Mobile retains its reserved right-side lane; no off-screen alternatives.
  const target = width>720 && building ? building.left-lateral : preferredX;
  return low<=high ? limit(target,low,high) : limit(preferredX,edge,width-edge);
}

function opportunityRouteAnchors(preferredX) {
  const section = document.querySelector("#oportunidade");
  const photo = section?.querySelector(".manifesto-backdrop img");
  if (!section || !photo) return sectionRouteAnchors("#oportunidade",preferredX);
  const layoutRect = element => {
    let left=0,top=0,current=element;
    while(current) { left+=current.offsetLeft; top+=current.offsetTop; current=current.offsetParent; }
    return {left,top,width:element.offsetWidth,height:element.offsetHeight,
      right:left+element.offsetWidth,bottom:top+element.offsetHeight};
  };
  const box=layoutRect(section);
  const building=opportunityPhotoObstacles(box,photo.naturalWidth||1600,photo.naturalHeight||1067)[0];
  const title=layoutRect(section.querySelector(".manifesto-grid > :first-child"));
  const copy=layoutRect(section.querySelector(".manifesto-copy"));
  const truckWidth=journeyVehicle.offsetWidth||(box.width<=720?72:154);
  const x=opportunityLane(box.width,building,truckWidth,
    box.width<=720?copy.right:title.right,box.width<=720?box.width:copy.left,preferredX);
  // A straight passage throughout the photo. Turns occur in the adjacent bands.
  return [
    {x,y:box.top+40,routeSection:"#oportunidade",routeBoundary:"entry"},
    {x,y:box.bottom-40,routeSection:"#oportunidade",routeBoundary:"exit"}
  ];
}

function factoryLoadingPhase(progress) {
  return Math.max(0,Math.min(1,(progress-.08)/.78));
}

function factoryPanelPair(pose, unitScale) {
  const radians = pose.angle * Math.PI / 180;
  const halfGap = 17.5 * unitScale * pose.zoom;
  // Both panels belong to one rigid load, sharing the fork's rotation/lift.
  return [-1,1].map(side => ({...pose,
    x:pose.x-Math.sin(radians)*halfGap*side,
    y:pose.y+Math.cos(radians)*halfGap*side
  }));
}

function destinationEntrancePoint(sceneScale = .72) {
  if (!destinationVisual || !destinationVisualSvg || !destinationFrame || !journeyDestination) return null;
  const previousTransform = destinationVisual.style.transform;
  destinationVisual.style.transform = `scale(${sceneScale})`;
  const matrix = destinationVisualSvg.getScreenCTM();
  const point = destinationVisualSvg.createSVGPoint();
  const frameRect = destinationFrame.getBoundingClientRect();
  const roadStart = destinationRoadPath?.getPointAtLength(0);
  point.x = roadStart?.x ?? 250;
  point.y = roadStart?.y ?? -35;
  const screenPoint = matrix ? point.matrixTransform(matrix) : null;
  destinationVisual.style.transform = previousTransform;
  if (!screenPoint) return null;
  return {
    x: screenPoint.x - frameRect.left,
    y: journeyDestination.offsetTop + screenPoint.y - frameRect.top
  };
}

function buildJourneyRoute() {
  if (!journeyLayer || !journeySvg || !journeyRoute || !heroJourney || !journeyDestination) return;
  const viewportWidth = journeyViewportWidth();
  const opportunity = document.querySelector("#oportunidade");
  const opportunityTitle = opportunity?.querySelector(".manifesto-grid > :first-child");
  if (opportunity && opportunityTitle && viewportWidth <= 720) {
    // Layout offsets ignore the entrance animation and do not change the section height.
    const layoutTop = element => {
      let top = 0;
      for (let current = element; current; current = current.offsetParent) top += current.offsetTop;
      return top;
    };
    opportunity.style.setProperty("--opportunity-photo-top", `${layoutTop(opportunityTitle) + opportunityTitle.offsetHeight - layoutTop(opportunity)}px`);
  }
  const destinationRoadD = viewportWidth <= 720 ? destinationRoadMobileD : destinationRoadDesktopD;
  destinationRoadPaths.forEach((path) => path?.setAttribute("d", destinationRoadD));
  // Measure the real page end, not the absolute route layer's previous height.
  // Otherwise closing an accordion can leave a stale blank area below the footer.
  const pageEnd = document.querySelector(".footer-credit-bar") || document.querySelector("main");
  const pageHeight = pageEnd
    ? Math.ceil(pageEnd.getBoundingClientRect().bottom + window.scrollY + (parseFloat(getComputedStyle(pageEnd).marginBottom) || 0))
    : document.documentElement.scrollHeight;
  const mobile = viewportWidth <= 720;
  const tablet = viewportWidth > 720 && viewportWidth <= 1000;
  journeyLayer.style.height = `${pageHeight}px`;
  journeySvg.setAttribute("viewBox", `0 0 ${viewportWidth} ${pageHeight}`);
  journeyStartScroll = heroJourney.offsetTop + Math.max(0, heroJourney.offsetHeight - window.innerHeight);
  journeyStartY = journeyStartScroll + window.innerHeight * .56;
  const destinationEntrance = destinationEntrancePoint();
  journeyEndY = destinationEntrance?.y ?? journeyDestination.offsetTop + window.innerHeight * .56;

  const mobileLane = journeyX(.91);
  const territoryMobileLane = mobileReservedLaneX(".territory-layout", .91);
  const anchors = [{ x: journeyX(mobile ? .91 : .78), y: journeyStartY }];
  const routeSections = [
    ["#empresa", mobile ? mobileLane : gridCorridorX(".company-grid", 1, .5)],
    ["#oportunidade", mobile ? mobileLane : gridCorridorX(".manifesto-grid", 1, .56)],
    ["#modelo", mobile ? mobileLane : gridCorridorX(".pillar-grid", 1, .5)],
    ["#chales", mobile ? mobileLane : gridCorridorX(".chalet-gallery", 1, .5)],
    ["#franqueados", mobile ? mobileLane : gridCorridorX(".testimonials-grid", 1, .5)],
    ["#processo", mobile ? mobileLane : gridCorridorX(".process-layout", 1, .44)],
    ["#vantagens", mobile ? mobileLane : gridCorridorX(".comparison-row", 2, .58)],
    ["#perfil", mobile ? mobileLane : gridCorridorX(".profile-grid", 1, .43)],
    ["#territorios", mobile ? territoryMobileLane : gridCorridorX(".territory-layout", 1, .56)],
    ["#duvidas", mobile ? mobileLane : gridCorridorX(".faq-grid", 1, .42) - clamp(viewportWidth * .025, 28, 48)]
  ];
  routeSections.forEach(([selector, x]) => anchors.push(...(selector === "#oportunidade"
    ? opportunityRouteAnchors(x) : sectionRouteAnchors(selector, x))));
  anchors.push({ x: destinationEntrance?.x ?? journeyX(mobile ? .55 : tablet ? .5 : .55), y: journeyEndY });

  let routeData = `M ${anchors[0].x} ${anchors[0].y}`;
  for (let index = 1; index < anchors.length; index += 1) {
    const previous = anchors[index - 1];
    const current = anchors[index];
    const horizontalDistance = current.x - previous.x;
    const verticalDistance = current.y - previous.y;
    const curveSegments = Math.abs(horizontalDistance) > 1 ? 4 : 1;
    const smootherStep = (amount) => amount ** 3 * (amount * (amount * 6 - 15) + 10);
    const smootherSlope = (amount) => 30 * amount ** 2 * (amount - 1) ** 2;
    for (let segment = 0; segment < curveSegments; segment += 1) {
      const startAmount = segment / curveSegments;
      const endAmount = (segment + 1) / curveSegments;
      const interval = endAmount - startAmount;
      const startX = previous.x + horizontalDistance * smootherStep(startAmount);
      const startY = previous.y + verticalDistance * startAmount;
      const endX = previous.x + horizontalDistance * smootherStep(endAmount);
      const endY = previous.y + verticalDistance * endAmount;
      const controlOneX = startX + horizontalDistance * smootherSlope(startAmount) * interval / 3;
      const controlOneY = startY + verticalDistance * interval / 3;
      const controlTwoX = endX - horizontalDistance * smootherSlope(endAmount) * interval / 3;
      const controlTwoY = endY - verticalDistance * interval / 3;
      routeData += ` C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${endX} ${endY}`;
    }
  }
  [journeyRoute, journeyRouteDash, journeyRouteProgress].forEach((path) => path?.setAttribute("d", routeData));
  journeyRouteLength = Math.max(1, journeyRoute.getTotalLength());
  if (journeyRouteProgress) {
    journeyRouteProgress.style.strokeDasharray = String(journeyRouteLength);
    journeyRouteProgress.style.strokeDashoffset = String(journeyRouteLength);
  }
  scheduleJourneyForest(anchors);
}

let forestBuildJob = 0;
function scheduleJourneyForest(anchors) {
  if (forestBuildJob) {
    if (window.cancelIdleCallback) window.cancelIdleCallback(forestBuildJob);
    else clearTimeout(forestBuildJob);
  }
  const build = () => { forestBuildJob = 0; buildJourneyForest(anchors); };
  // The truck and content render first; decoration must not block initial paint.
  forestBuildJob = window.requestIdleCallback
    ? window.requestIdleCallback(build, { timeout: 800 }) : setTimeout(build, 80);
}

// Approved option 09: dense understory beneath broad, visibly branched crowns.
function forestTreeFits(tree, viewportWidth, protectedRects, roadPoints, trees, roadClearance) {
  const margin = tree.radius + 10;
  if (tree.bleed) {
    if (tree.x + tree.radius < 0 || tree.x - tree.radius > viewportWidth) return false;
  } else if (tree.x < margin || tree.x > viewportWidth - margin) return false;
  if (protectedRects.some(rect => tree.x + margin > rect.left && tree.x - margin < rect.right
    && tree.y + margin > rect.top && tree.y - margin < rect.bottom)) return false;
  // Test the complete polyline, including gaps between samples on steep bends.
  const roadRadiusSquared = (tree.radius + roadClearance + 2) ** 2;
  for (let index = 0; index < roadPoints.length; index += 1) {
    const a = roadPoints[index], b = roadPoints[index + 1] || a;
    const dx = b.x - a.x, dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared ? Math.max(0, Math.min(1, ((tree.x-a.x)*dx + (tree.y-a.y)*dy) / lengthSquared)) : 0;
    if ((tree.x-a.x-dx*t)**2 + (tree.y-a.y-dy*t)**2 < roadRadiusSquared) return false;
  }
  const spacing = tree.layer === 1 ? .72 : .52;
  return !trees.some(other => Math.hypot(tree.x - other.x, tree.y - other.y) < (tree.radius + other.radius) * spacing);
}

// Evaluate the same four cubic segments as buildJourneyRoute, without thousands
// of native getPointAtLength calls against a path spanning the entire page.
function forestRoadPoint(anchors, y) {
  if (y <= anchors[0].y) return { x: anchors[0].x, y };
  const end = anchors.findIndex(point => point.y >= y);
  if (end < 1) return { x: anchors[anchors.length - 1].x, y };
  const a = anchors[end - 1], b = anchors[end];
  const t = clamp((y - a.y) / Math.max(1, b.y - a.y), 0, 1);
  const segment = Math.min(3, Math.floor(t * 4));
  const u = t * 4 - segment, start = segment / 4, finish = (segment + 1) / 4;
  const ease = n => n ** 3 * (n * (n * 6 - 15) + 10);
  const slope = n => 30 * n ** 2 * (n - 1) ** 2;
  const p0 = ease(start), p1 = p0 + slope(start) / 12;
  const p3 = ease(finish), p2 = p3 - slope(finish) / 12;
  const blend = (1-u)**3*p0 + 3*(1-u)**2*u*p1 + 3*(1-u)*u*u*p2 + u**3*p3;
  return { x: lerp(a.x, b.x, blend), y };
}

let forestLayoutKey = "";
function buildJourneyForest(anchors) {
  if (!journeyForest || !journeyRoute) return;
  const width = journeyViewportWidth();
  const mobile = width <= 720;
  // Protect testimonial information, but leave the card's decorative edges open to foliage.
  const protectedRects = [...document.querySelectorAll("main h1, main h2, main h3, main p, main a, main figure, main li, .company-years, .company-photos, .pillar-card, .comparison-table, .profile-visual, .brazil-map-stage, .territory-city-list, .faq-intro, .lead-form, .testimonial-card blockquote, .testimonial-card footer, .testimonial-tag")]
    .filter(element => !element.closest(".journey-destination"))
    .map(element => {
      // Offset geometry is unaffected by reveal transforms and sticky scrolling.
      let left = 0, top = 0, current = element;
      while (current) { left += current.offsetLeft; top += current.offsetTop; current = current.offsetParent; }
      return { left, top, right: left + element.offsetWidth, bottom: top + element.offsetHeight };
    });
  const layoutKey = JSON.stringify([width, anchors, protectedRects]);
  if (layoutKey === forestLayoutKey) return;
  forestLayoutKey = layoutKey;
  const fragment = document.createDocumentFragment();
  for (let index = 1; index < anchors.length; index += 1) {
    const start = anchors[index - 1], end = anchors[index];
    if (start.routeBoundary !== "exit" || end.routeBoundary !== "entry") continue;
    const padding = mobile ? 90 : 150;
    const nearbyRects = protectedRects.filter(rect => rect.bottom >= start.y - padding && rect.top <= end.y + padding);
    const treesByLayer = [[], []];
    const roadPoints = [];
    for (let y = start.y - padding; y <= end.y + padding; y += 14) roadPoints.push(forestRoadPoint(anchors, y));
    const columns = Math.max(3, Math.ceil(width / (mobile ? 42 : 84)));
    const cellWidth = width / columns;
    const transitionTrees = [];
    for (let layer = 0; layer < 2; layer += 1) {
      const spacingY = layer === 0 ? (mobile ? 40 : 70) : (mobile ? 100 : 160);
      const steps = clamp(Math.ceil((end.y - start.y) / spacingY), layer === 0 ? 6 : 3, 22);
      for (let step = 1; step <= steps; step += 1) {
        const bandY = lerp(start.y, end.y, step / (steps + 1));
        // Fill the full free band. Stagger and jitter avoid straight plantation rows.
        for (let column = -1; column <= columns; column += 1) {
          const seed = index * 131 + step * 37 + column * 19 + layer * 157;
          const variation = (Math.sin(seed * 12.9898) * 43758.5453) % 1;
          const radius = layer === 0
            ? (mobile ? 27 + Math.abs(variation) * 9 : 48 + Math.abs(variation) * 18)
            : (mobile ? 38 + Math.abs(variation) * 12 : 70 + Math.abs(variation) * 24);
          const tree = { x: (column + .5 + (step % 2) * .3) * cellWidth + variation * cellWidth * .24,
            y: bandY + variation * (mobile ? 19 : 38), radius, layer, bleed: true,
            variant: layer === 1 ? [1, 2, 5, 6][Math.abs(seed) % 4] : 3 + Math.abs(seed) % 2,
            rotation: layer === 1 ? 0 : seed % 360 };
          if (!forestTreeFits(tree, width, nearbyRects, roadPoints, treesByLayer[layer], mobile ? 27 : 58)) continue;
          treesByLayer[layer].push(tree);
          transitionTrees.push(tree);
        }
      }
    }
    // Selective rear canopies retain small interior clearings.
    const shadowTrees = [];
    const shadowCell = mobile ? 40 : 72;
    const shadowColumns = Math.ceil(width / shadowCell);
    const shadowRows = Math.max(1, Math.ceil((end.y - start.y) / shadowCell));
    for (let row = 0; row < shadowRows; row += 1) {
      for (let column = -1; column <= shadowColumns; column += 1) {
        const seed = index * 173 + row * 31 + column * 47;
        const jitter = Math.sin(seed * 7.19);
        const tree = {
          x: (column + .5 + (row % 2) * .35) * shadowCell + jitter * shadowCell * .12,
          y: lerp(start.y, end.y, (row + .5) / shadowRows) + jitter * shadowCell * .12,
          radius: mobile ? 38 + Math.abs(jitter) * 6 : 66 + Math.abs(jitter) * 12,
          layer: -1, bleed: true, variant: 7 + Math.abs(seed) % 2, rotation: seed % 360
        };
        if (transitionTrees.some(other => Math.hypot(tree.x - other.x, tree.y - other.y) < other.radius * .65)) continue;
        if (!forestTreeFits(tree, width, nearbyRects, roadPoints, shadowTrees, mobile ? 27 : 58)) continue;
        shadowTrees.push(tree);
      }
    }
    // The same irregular grove continues beyond the viewport. No separate
    // edge rows: clipping simply crops the ordinary crowns at the screen edge.
    transitionTrees.push(...shadowTrees);
    // Rear shade, middle foliage, then upright branched crowns.
    transitionTrees.sort((a, b) => a.layer - b.layer || a.y - b.y).forEach(tree => {
      const sprite = document.createElementNS("http://www.w3.org/2000/svg", "use");
      sprite.setAttribute("href", `#forest-09-${tree.variant}`);
      sprite.setAttribute("data-canopy-layer", String(tree.layer));
      sprite.setAttribute("x", String(-tree.radius));
      sprite.setAttribute("y", String(-tree.radius));
      sprite.setAttribute("width", String(tree.radius * 2));
      sprite.setAttribute("height", String(tree.radius * 2));
      sprite.setAttribute("transform", `translate(${tree.x.toFixed(2)} ${tree.y.toFixed(2)}) rotate(${tree.rotation})`);
      fragment.append(sprite);
    });
  }
  journeyForest.replaceChildren(fragment);
}

function journeyPointAtY(documentY) {
  let low = 0;
  let high = journeyRouteLength;
  for (let index = 0; index < 15; index += 1) {
    const middle = (low + high) * .5;
    const point = journeyRoute.getPointAtLength(middle);
    if (point.y < documentY) low = middle;
    else high = middle;
  }
  const distance = (low + high) * .5;
  const point = journeyRoute.getPointAtLength(distance);
  const maximumWindow = clamp(journeyViewportWidth() * .022, 18, 44);
  const remaining = journeyRouteLength - distance;
  const tangentWindow = clamp(Math.min(maximumWindow, Math.max(5, remaining * .42)), 5, maximumWindow);
  const previous = journeyRoute.getPointAtLength(Math.max(0, distance - tangentWindow));
  const next = journeyRoute.getPointAtLength(Math.min(journeyRouteLength, distance + tangentWindow));
  const routeAngle = Math.atan2(next.y - previous.y, next.x - previous.x) * 180 / Math.PI;
  return { x: point.x, y: point.y, distance, angle: routeAngle };
}

function updateTruckTextShadows(vehicleOpacity) {
  if (!journeyVehicle) return;
  if (vehicleOpacity < .12) {
    truckShadowTargets.forEach((target) => target.classList.remove("truck-shadowed"));
    return;
  }
  const truck = journeyVehicleGraphic?.getBoundingClientRect() || journeyVehicle.getBoundingClientRect();
  truckShadowTargets.forEach((target) => {
    const rect = target.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < window.innerHeight;
    const overlapX = Math.max(0, Math.min(truck.right, rect.right) - Math.max(truck.left, rect.left));
    const overlapY = Math.max(0, Math.min(truck.bottom, rect.bottom) - Math.max(truck.top, rect.top));
    target.classList.toggle("truck-shadowed", visible && overlapX * overlapY > 24);
  });
}

function syncDestinationRoadAppearance(destinationMatrix, progress) {
  if (!destinationMatrix || !destinationRoadPath || !journeyRoute) return;
  const roadLength = destinationRoadPath.getTotalLength();
  const svgScale = Math.max(.001, Math.hypot(destinationMatrix.a, destinationMatrix.b));
  const routeStyle = getComputedStyle(journeyRoute);
  const routeDashStyle = journeyRouteDash ? getComputedStyle(journeyRouteDash) : routeStyle;
  const routeProgressStyle = journeyRouteProgress ? getComputedStyle(journeyRouteProgress) : routeStyle;
  const routeWidth = parseFloat(routeStyle.strokeWidth) || 68;
  const routeCenterWidth = parseFloat(routeProgressStyle.strokeWidth) || 4;
  const dashPattern = (routeDashStyle.strokeDasharray.match(/[\d.]+/g) || []).map(Number);
  destinationRoadEdge?.setAttribute("stroke-width", String(routeWidth / svgScale));
  destinationRoadOrange?.setAttribute("stroke-width", String(routeCenterWidth / svgScale));
  destinationRoadDash?.setAttribute("stroke-width", String(routeCenterWidth / svgScale));
  if (destinationRoadEdge) destinationRoadEdge.style.stroke = routeStyle.stroke;
  if (destinationRoadDash) {
    destinationRoadDash.style.stroke = routeDashStyle.stroke;
    destinationRoadDash.setAttribute("stroke-dasharray", `${(dashPattern[0] || 15) / svgScale} ${(dashPattern[1] || 20) / svgScale}`);
  }
  if (destinationRoadOrange) {
    destinationRoadOrange.style.stroke = routeProgressStyle.stroke;
    destinationRoadOrange.setAttribute("stroke-dasharray", `${roadLength} ${roadLength}`);
    destinationRoadOrange.setAttribute("stroke-dashoffset", String(roadLength * (1 - progress)));
  }
}

function renderJourney(scrollPosition) {
  if (!journeyLayer || !journeyVehicle || !journeyRoute || !journeyDestination) return;
  const destinationRange = Math.max(1, journeyDestination.offsetHeight - window.innerHeight);
  const destinationRawProgress = clamp((scrollPosition - journeyDestination.offsetTop) / destinationRange);
  const destinationProgress = destinationRawProgress <= .27
    ? lerp(0, .38, destinationRawProgress / .27)
    : destinationRawProgress <= .78
      ? lerp(.38, 1, (destinationRawProgress - .27) / .51)
      : 1;
  const journeyEndScroll = journeyDestination.offsetTop + journeyDestination.offsetHeight;
  const loadingProgress = clamp(scrollPosition / Math.max(1, journeyStartScroll));
  const loadingMotionProgress = loadingProgress;
  const departureProgress = clamp((loadingProgress - .9) / .1);
  const departureAcceleration = departureProgress * departureProgress * (2 - departureProgress);
  const roadAccelerationProgress = clamp((scrollPosition - journeyStartScroll) / Math.max(1, window.innerHeight * 1.35));
  const roadAcceleration = roadAccelerationProgress * roadAccelerationProgress * (2 - roadAccelerationProgress);
  const journeySpeed = scrollPosition <= journeyStartScroll
    ? departureAcceleration * .42
    : lerp(.42, 1, roadAcceleration);
  const mobileFactory = journeyViewportWidth() <= 720;
  const mobileCameraAmount = mobileFactory
    ? smooth(.06, .18, loadingProgress) * (1 - smooth(.74, .895, loadingProgress))
    : 0;
  const mobileCameraZoom = 1 + mobileCameraAmount * .28;
  const mobileCameraFocus = {
    x: journeyViewportWidth() * .73,
    y: window.innerHeight * .54
  };
  const mobileSceneReveal = mobileFactory ? smooth(.035, .075, loadingProgress) : 1;
  if (factoryHeroCopy) factoryHeroCopy.style.opacity = String(mobileFactory ? 1 - smooth(.02, .075, loadingProgress) : 1);
  heroJourney?.style.setProperty("--factory-scene-reveal", String(mobileSceneReveal));
  heroJourney?.style.setProperty("--factory-obstruction-opacity", String(1 - smooth(.035, .15, loadingProgress)));
  heroJourney?.style.setProperty("--factory-camera-zoom", String(mobileCameraZoom));
  heroJourney?.style.setProperty("--factory-camera-shift-x", "0px");
  heroJourney?.style.setProperty("--factory-camera-shift-y", "0px");
  const arrivalProgress = smooth(.01, .18, destinationRawProgress);
  const cameraZoomProgress = smooth(.18, .25, destinationRawProgress);
  const roadHandoffProgress = smooth(
    journeyDestination.offsetTop - window.innerHeight * .16,
    journeyDestination.offsetTop + window.innerHeight * .04,
    scrollPosition
  );
  const truckExit = smooth(.93, .99, destinationProgress);
  const sceneScale = lerp(.72, 1, cameraZoomProgress);
  if (destinationVisual) destinationVisual.style.transform = `scale(${sceneScale})`;
  if (destinationMachinery) destinationMachinery.style.transform = `scale(${sceneScale})`;
  const destinationMatrix = destinationVisualSvg?.getScreenCTM();
  syncDestinationRoadAppearance(destinationMatrix, arrivalProgress);
  if (destinationRoad) destinationRoad.style.opacity = String(roadHandoffProgress * (1 - cameraZoomProgress));
  let vehiclePoint;
  let vehicleScale = 1;

  if (scrollPosition <= journeyStartScroll) {
    const loadingOnMobile = journeyViewportWidth() <= 720;
    vehiclePoint = {
      x: journeyX(loadingOnMobile ? .91 : .78),
      y: window.innerHeight * .56,
      angle: 90,
      distance: 0
    };
  } else if (scrollPosition < journeyDestination.offsetTop) {
    const destinationViewportY = journeyEndY - journeyDestination.offsetTop;
    const approachViewportY = lerp(
      window.innerHeight * .56,
      destinationViewportY,
      smooth(
        journeyDestination.offsetTop - window.innerHeight * 1.15,
        journeyDestination.offsetTop,
        scrollPosition
      )
    );
    vehiclePoint = journeyPointAtY(clamp(scrollPosition + approachViewportY, journeyStartY, journeyEndY));
    vehiclePoint.y -= scrollPosition;
  } else {
    let stageX = journeyX(.55);
    let stageY = window.innerHeight * .56;
    let stageAngle = 0;
    const stagePoint = destinationVisualSvg?.createSVGPoint();
    if (destinationMatrix && stagePoint && destinationRoadPath) {
      const roadLength = destinationRoadPath.getTotalLength();
      const localPoint = destinationRoadPath.getPointAtLength(roadLength * arrivalProgress);
      const localPrevious = destinationRoadPath.getPointAtLength(Math.max(0, roadLength * arrivalProgress - 18));
      const localNext = destinationRoadPath.getPointAtLength(Math.min(roadLength, roadLength * arrivalProgress + 18));
      stagePoint.x = localPoint.x;
      stagePoint.y = localPoint.y;
      const stageScreen = stagePoint.matrixTransform(destinationMatrix);
      stagePoint.x = localNext.x;
      stagePoint.y = localNext.y;
      const nextScreen = stagePoint.matrixTransform(destinationMatrix);
      const svgScale = Math.max(.001, Math.hypot(destinationMatrix.a, destinationMatrix.b));
      stageX = stageScreen.x;
      stageY = stageScreen.y;
      stagePoint.x = localPrevious.x;
      stagePoint.y = localPrevious.y;
      const previousScreen = stagePoint.matrixTransform(destinationMatrix);
      stageAngle = Math.atan2(nextScreen.y - previousScreen.y, nextScreen.x - previousScreen.x) * 180 / Math.PI;
      vehicleScale = lerp(1, (250 * svgScale) / Math.max(1, journeyVehicle.offsetWidth), arrivalProgress);
    }
    const routeHandoff = journeyPointAtY(journeyEndY);
    const handoffProgress = smooth(0, .075, destinationRawProgress);
    stageX = lerp(routeHandoff.x, stageX, handoffProgress);
    stageY = lerp(journeyEndY - journeyDestination.offsetTop, stageY, handoffProgress);
    stageAngle = lerpAngle(routeHandoff.angle, stageAngle, handoffProgress);
    vehicleScale = lerp(1, vehicleScale, handoffProgress);
    vehiclePoint = {
      x: stageX,
      y: stageY,
      angle: stageAngle,
      distance: journeyRouteLength
    };
  }

  const departureAdvance = departureAcceleration
    * (1 - roadHandoffProgress)
    * (mobileFactory ? 24 : 34);
  const departureRadians = vehiclePoint.angle * Math.PI / 180;
  vehiclePoint.x += Math.cos(departureRadians) * departureAdvance;
  vehiclePoint.y += Math.sin(departureRadians) * departureAdvance;
  if (mobileCameraAmount > 0) {
    vehiclePoint.x = mobileCameraFocus.x + (vehiclePoint.x - mobileCameraFocus.x) * mobileCameraZoom;
    vehiclePoint.y = mobileCameraFocus.y + (vehiclePoint.y - mobileCameraFocus.y) * mobileCameraZoom;
  }

  const vehicleFade = (scrollPosition > journeyEndScroll ? 0 : 1 - truckExit) * mobileSceneReveal;
  journeyVisualAngle = vehiclePoint.angle;
  journeyAngleRemaining = 0;
  journeyVehicle.style.opacity = String(vehicleFade);
  journeyVehicle.style.transform = `translate3d(${vehiclePoint.x}px, ${vehiclePoint.y}px, 0) translate(-50%, -50%) rotate(${journeyVisualAngle}deg) scale(${mobileCameraZoom})`;
  journeyVehicle.style.setProperty("--journey-zoom", String(vehicleScale));
  journeyVehicle.style.setProperty("--journey-speed", String(journeySpeed));
  journeyVehicle.style.setProperty("--journey-departure", String(departureAcceleration));
  if (journeyVehicleCargo) {
    journeyVehicleCargo.style.opacity = String(vehicleFade);
    journeyVehicleCargo.style.transform = `translate3d(${vehiclePoint.x}px, ${vehiclePoint.y}px, 0) translate(-50%, -50%) rotate(${journeyVisualAngle}deg) scale(${mobileCameraZoom})`;
    journeyVehicleCargo.style.setProperty("--journey-zoom", String(vehicleScale));
    journeyVehicleCargo.style.setProperty("--journey-speed", String(journeySpeed));
    journeyVehicleCargo.style.setProperty("--journey-departure", String(departureAcceleration));
  }
  journeyLayer.classList.toggle("is-driving", scrollPosition > journeyStartScroll && scrollPosition < journeyDestination.offsetTop);
  journeyLayer.classList.toggle("is-arriving", scrollPosition >= journeyDestination.offsetTop);

  const cargoOneLoad = factoryLoadingPhase(loadingMotionProgress);
  const forkliftCycle = (progress) => {
    const approach = smooth(0, .2, progress);
    const contact = smooth(.2, .28, progress);
    const liftUp = smooth(.28, .4, progress);
    const travel = smooth(.4, .78, progress);
    const lower = smooth(.78, .9, progress);
    const release = smooth(.9, 1, progress);
    return {
      phase: progress,
      approach,
      engage: smooth(.16, .28, progress) * (1 - release),
      contact,
      pickup: liftUp,
      lift: liftUp * (1 - lower),
      travel,
      lower,
      release,
      drive: approach * .28 + travel * .58 + release * .14
    };
  };
  const cargoOneCycle = forkliftCycle(cargoOneLoad);
  const cargoTwoCycle = cargoOneCycle;
  const cargoOneLift = cargoOneCycle.lift;
  const cargoTwoLift = cargoTwoCycle.lift;
  const cargoOneSceneFade = 1 - smooth(.435, .455, destinationProgress);
  const cargoTwoSceneFade = 1 - smooth(.715, .735, destinationProgress);
  if (journeyLoader) {
    const loaderFade = mobileSceneReveal * (1 - smooth(.895, .915, loadingMotionProgress));
    const cargoScreenAngle = journeyVisualAngle;
    const activeLift = cargoOneLift;
    const activeEngage = cargoOneCycle.engage;
    const activeTravel = cargoOneCycle.travel;
    const viewportWidth = journeyViewportWidth();
    const mobileForklift = viewportWidth <= 720;
    const forkliftBaseScale = mobileForklift ? .52 * mobileCameraZoom : viewportWidth <= 1000 ? .78 : 1;
    const motionScale = mobileForklift ? .52 * mobileCameraZoom : viewportWidth <= 1000 ? .76 : 1;
    const factoryRect = heroJourney?.querySelector(".factory-environment")?.getBoundingClientRect();
    const vehicleCssWidth = parseFloat(getComputedStyle(journeyVehicleCargo || journeyVehicle).width) || 140;
    const vehicleUnitScale = vehicleCssWidth / 270 * vehicleScale * mobileCameraZoom;
    const vehicleLocalToScreen = (x, y) => {
      const localX = (x - 141.5) * vehicleUnitScale;
      const localY = (y - 70) * vehicleUnitScale;
      const radians = cargoScreenAngle * Math.PI / 180;
      return {
        x: vehiclePoint.x + localX * Math.cos(radians) - localY * Math.sin(radians),
        y: vehiclePoint.y + localX * Math.sin(radians) + localY * Math.cos(radians)
      };
    };
    const clearBounds = factoryRect ? {
      left: factoryRect.left + factoryRect.width * (mobileForklift ? .18 : .2),
      right: factoryRect.right - factoryRect.width * (mobileForklift ? .1 : .18),
      top: factoryRect.top + factoryRect.height * (mobileForklift ? .2 : .17),
      bottom: factoryRect.bottom - factoryRect.height * (mobileForklift ? .13 : .15)
    } : { left: 20, right: viewportWidth - 20, top: 90, bottom: window.innerHeight - 24 };
    const clampToAisle = (point, padding = 0) => ({
      x: clamp(point.x, clearBounds.left + padding, clearBounds.right - padding),
      y: clamp(point.y, clearBounds.top + padding, clearBounds.bottom - padding)
    });
    const cubicPose = (start, controlOne, controlTwo, end, progress) => {
      const inverse = 1 - progress;
      const x = inverse ** 3 * start.x + 3 * inverse ** 2 * progress * controlOne.x + 3 * inverse * progress ** 2 * controlTwo.x + progress ** 3 * end.x;
      const y = inverse ** 3 * start.y + 3 * inverse ** 2 * progress * controlOne.y + 3 * inverse * progress ** 2 * controlTwo.y + progress ** 3 * end.y;
      const tangentX = 3 * inverse ** 2 * (controlOne.x - start.x) + 6 * inverse * progress * (controlTwo.x - controlOne.x) + 3 * progress ** 2 * (end.x - controlTwo.x);
      const tangentY = 3 * inverse ** 2 * (controlOne.y - start.y) + 6 * inverse * progress * (controlTwo.y - controlOne.y) + 3 * progress ** 2 * (end.y - controlTwo.y);
      return { x, y, heading: Math.atan2(tangentY, tangentX) * 180 / Math.PI };
    };
    const supportReach = (lift) => (70 + lift * 10.4) * forkliftBaseScale;
    const sourceOneRaw = vehicleLocalToScreen(6, 177);
    const sourceOne = clampToAisle(sourceOneRaw, 46 * forkliftBaseScale);
    const finalPair = vehicleLocalToScreen(106, 69.5);
    const makePanelSpec = (source, target, initialRotation, index) => {
      const sourceAngle = cargoScreenAngle + initialRotation;
      const targetAngle = cargoScreenAngle;
      const sourceHeading = sourceAngle - 90;
      const targetHeading = targetAngle - 90;
      const sourceRadians = sourceHeading * Math.PI / 180;
      const targetRadians = targetHeading * Math.PI / 180;
      const sourceContact = {
        x: source.x - Math.cos(sourceRadians) * supportReach(0),
        y: source.y - Math.sin(sourceRadians) * supportReach(0)
      };
      const targetContact = {
        x: target.x - Math.cos(targetRadians) * supportReach(1),
        y: target.y - Math.sin(targetRadians) * supportReach(1)
      };
      const approachDistance = (index === 0 ? 112 : 104) * motionScale;
      const approachSide = (index === 0 ? -34 : 26) * motionScale;
      const sourceNormal = { x: -Math.sin(sourceRadians), y: Math.cos(sourceRadians) };
      const approachStart = clampToAisle({
        x: sourceContact.x - Math.cos(sourceRadians) * approachDistance + sourceNormal.x * approachSide,
        y: sourceContact.y - Math.sin(sourceRadians) * approachDistance + sourceNormal.y * approachSide
      }, 46 * forkliftBaseScale);
      const travelDistance = Math.max(80, Math.hypot(target.x - source.x, target.y - source.y));
      return {
        source,
        target,
        sourceAngle,
        targetAngle,
        sourceHeading,
        targetHeading,
        sourceContact,
        targetContact,
        approachStart,
        approachControlOne: clampToAisle({
          x: approachStart.x + Math.cos(sourceRadians) * 52 * motionScale,
          y: approachStart.y + Math.sin(sourceRadians) * 52 * motionScale
        }, 42 * forkliftBaseScale),
        approachControlTwo: {
          x: sourceContact.x - Math.cos(sourceRadians) * 34 * motionScale,
          y: sourceContact.y - Math.sin(sourceRadians) * 34 * motionScale
        },
        travelControlOne: {
          x: source.x + Math.cos(sourceRadians) * travelDistance * .36,
          y: source.y + Math.sin(sourceRadians) * travelDistance * .36
        },
        travelControlTwo: {
          x: target.x - Math.cos(targetRadians) * travelDistance * .3,
          y: target.y - Math.sin(targetRadians) * travelDistance * .3
        }
      };
    };
    const panelOneSpec = makePanelSpec(sourceOne, finalPair, -7, 0);
    const carriedPanelPose = (cycle, spec) => {
      if (cycle.phase < .4) return { ...spec.source, heading: spec.sourceHeading };
      if (cycle.phase < .78) return cubicPose(
        spec.source,
        spec.travelControlOne,
        spec.travelControlTwo,
        spec.target,
        cycle.travel
      );
      return { ...spec.target, heading: spec.targetHeading };
    };
    const contactPoint = (panelPose, lift) => {
      const radians = panelPose.heading * Math.PI / 180;
      const reach = supportReach(lift);
      return {
        x: panelPose.x - Math.cos(radians) * reach,
        y: panelPose.y - Math.sin(radians) * reach,
        heading: panelPose.heading
      };
    };
    const cyclePose = (cycle, spec, retreatDistance = 58) => {
      if (cycle.phase < .2) {
        const pose = cubicPose(spec.approachStart, spec.approachControlOne, spec.approachControlTwo, spec.sourceContact, cycle.approach);
        return { frontX: pose.x, frontY: pose.y, heading: pose.heading, gear: 1 };
      }
      const panelPose = carriedPanelPose(cycle, spec);
      const contact = contactPoint(panelPose, cycle.lift);
      if (cycle.phase < .9) return { frontX: contact.x, frontY: contact.y, heading: contact.heading, gear: 1 };
      const radians = contact.heading * Math.PI / 180;
      return {
        frontX: contact.x - Math.cos(radians) * retreatDistance * motionScale * cycle.release,
        frontY: contact.y - Math.sin(radians) * retreatDistance * motionScale * cycle.release,
        heading: contact.heading,
        gear: -1
      };
    };
    const forkliftPlanAt = (timelineProgress) => {
      return cyclePose(forkliftCycle(factoryLoadingPhase(timelineProgress)),panelOneSpec);
    };
    const plan = forkliftPlanAt(loadingMotionProgress);
    let cameraShiftX = 0;
    let cameraShiftY = 0;
    if (mobileCameraAmount > 0) {
      const planRadians = plan.heading * Math.PI / 180;
      const loaderCenterX = plan.frontX - Math.cos(planRadians) * 13 * forkliftBaseScale;
      const loaderCenterY = plan.frontY - Math.sin(planRadians) * 13 * forkliftBaseScale;
      const pairCenterX = (vehiclePoint.x + loaderCenterX) * .5;
      const pairCenterY = (vehiclePoint.y + loaderCenterY) * .5;
      cameraShiftX = (window.innerWidth * .5 - pairCenterX) * mobileCameraAmount;
      cameraShiftY = (window.innerHeight * .5 - pairCenterY) * mobileCameraAmount;
      heroJourney?.style.setProperty("--factory-camera-shift-x", `${cameraShiftX}px`);
      heroJourney?.style.setProperty("--factory-camera-shift-y", `${cameraShiftY}px`);
      const centeredVehicleTransform = `translate3d(${vehiclePoint.x + cameraShiftX}px, ${vehiclePoint.y + cameraShiftY}px, 0) translate(-50%, -50%) rotate(${journeyVisualAngle}deg) scale(${mobileCameraZoom})`;
      journeyVehicle.style.transform = centeredVehicleTransform;
      if (journeyVehicleCargo) journeyVehicleCargo.style.transform = centeredVehicleTransform;
    }
    const panelPoseFor = (cycle, spec) => {
      if (cycle.phase < .2) return { x: spec.source.x, y: spec.source.y, angle: spec.sourceAngle, zoom: 1 };
      if (cycle.phase >= .9) return { x: spec.target.x, y: spec.target.y, angle: spec.targetAngle, zoom: 1 };
      const loaderPose = cyclePose(cycle, spec);
      const radians = loaderPose.heading * Math.PI / 180;
      return {
        x: loaderPose.frontX + Math.cos(radians) * supportReach(cycle.lift),
        y: loaderPose.frontY + Math.sin(radians) * supportReach(cycle.lift),
        angle: loaderPose.heading + 90,
        zoom: 1 + cycle.lift * .18
      };
    };
    const applyRigidPanelPose = (element, centerY, pose) => {
      if (!element) return;
      element.style.width = `${128 * vehicleUnitScale}px`;
      element.style.opacity = String((centerY === 52 ? cargoOneSceneFade : cargoTwoSceneFade) * vehicleFade);
      element.style.transform = `translate3d(${pose.x + cameraShiftX}px, ${pose.y + cameraShiftY}px, 0) translate(-50%, -50%) rotate(${pose.angle}deg) scale(${pose.zoom})`;
    };
    const pair = factoryPanelPair(panelPoseFor(cargoOneCycle,panelOneSpec),vehicleUnitScale);
    applyRigidPanelPose(journeyCargoOne,52,pair[0]);
    applyRigidPanelPose(journeyCargoTwo,87,pair[1]);
    if (journeyCargoOne) journeyCargoOne.style.filter = `drop-shadow(0 ${lerp(3, 16, cargoOneLift)}px ${lerp(2, 9, cargoOneLift)}px rgba(5,16,7,${lerp(.18, .34, cargoOneLift)}))`;
    if (journeyCargoTwo) journeyCargoTwo.style.filter = `drop-shadow(0 ${lerp(3, 16, cargoTwoLift)}px ${lerp(2, 9, cargoTwoLift)}px rgba(5,16,7,${lerp(.18, .34, cargoTwoLift)}))`;
    const nearStep = .012;
    const before = forkliftPlanAt(clamp(loadingMotionProgress - nearStep));
    const after = forkliftPlanAt(clamp(loadingMotionProgress + nearStep));
    const steering = plan.heading;
    const travelledDistance = Math.hypot(after.frontX - before.frontX, after.frontY - before.frontY);
    const headingChange = ((((after.heading - before.heading) % 360) + 540) % 360) - 180;
    const stableGear = before.gear === plan.gear && after.gear === plan.gear;
    const curvature = travelledDistance > .1 && stableGear
      ? (headingChange * Math.PI / 180) / (travelledDistance * plan.gear) * smooth(.6, 2, travelledDistance)
      : 0;
    const wheelbase = 40 * forkliftBaseScale;
    const track = 48 * forkliftBaseScale;
    const turnRadius = Math.abs(curvature) > .0001 ? 1 / Math.abs(curvature) : Infinity;
    const innerSteer = Number.isFinite(turnRadius)
      ? Math.atan(wheelbase / Math.max(wheelbase * .7, turnRadius - track * .5)) * 180 / Math.PI
      : 0;
    const outerSteer = Number.isFinite(turnRadius)
      ? Math.atan(wheelbase / (turnRadius + track * .5)) * 180 / Math.PI
      : 0;
    const rearSteerSign = curvature === 0 ? 0 : -Math.sign(curvature);
    const rearTopSteer = clamp(rearSteerSign * (curvature < 0 ? innerSteer : outerSteer), -34, 34);
    const rearBottomSteer = clamp(rearSteerSign * (curvature > 0 ? innerSteer : outerSteer), -34, 34);
    const wheelRoll = -cargoOneCycle.approach * 55
      - cargoOneCycle.travel * 95
      + cargoOneCycle.release * 36;
    const bodyBob = Math.sin(wheelRoll * .18) * .8;
    const forkliftTransform = `translate3d(${plan.frontX + cameraShiftX}px, ${plan.frontY + cameraShiftY}px, 0) rotate(${steering}deg) scale(${forkliftBaseScale}) translate(-69px, -37px)`;
    journeyLoader.style.opacity = String(loaderFade);
    journeyLoader.style.transform = forkliftTransform;
    journeyLoader.style.setProperty("--forklift-lift", String(activeLift));
    journeyLoader.style.setProperty("--forklift-engage", String(activeEngage));
    journeyLoader.style.setProperty("--forklift-drive", String(activeTravel));
    journeyLoader.style.setProperty("--forklift-steer-top", String(rearTopSteer));
    journeyLoader.style.setProperty("--forklift-steer-bottom", String(rearBottomSteer));
    journeyLoader.style.setProperty("--forklift-roll", String(wheelRoll));
    journeyLoader.style.setProperty("--forklift-bob", String(bodyBob));
    journeyLoader.style.setProperty("--forklift-lean", String(-(rearTopSteer + rearBottomSteer) * .018));
    if (journeyLoaderUnderlay) {
      journeyLoaderUnderlay.style.opacity = String(loaderFade);
      journeyLoaderUnderlay.style.transform = forkliftTransform;
      journeyLoaderUnderlay.style.setProperty("--forklift-lift", String(activeLift));
      journeyLoaderUnderlay.style.setProperty("--forklift-engage", String(activeEngage));
    }
  }
  if (journeyLoaderCable) journeyLoaderCable.style.opacity = String(mobileSceneReveal * (1 - smooth(.895, .915, loadingMotionProgress)));

  const loadingSceneFade = 1 - departureAcceleration;
  const factoryRailOpacity = (mobileFactory ? .48 : .82) * loadingSceneFade * mobileSceneReveal;
  heroJourney?.style.setProperty("--factory-loading-opacity", String(factoryRailOpacity));

  const routeProgress = clamp(vehiclePoint.distance / journeyRouteLength);
  if (journeyRouteProgress) journeyRouteProgress.style.strokeDashoffset = String(journeyRouteLength * (1 - routeProgress));
  if (journeySvg) {
    const roadRevealOpacity = departureAcceleration;
    journeySvg.style.opacity = String(roadRevealOpacity * (1 - roadHandoffProgress));
  }

  if (destinationModules) destinationModules.style.opacity = "1";
  const machineryMatrix = destinationMachinerySvg?.getScreenCTM();
  const machineryInverse = machineryMatrix?.inverse();
  const machineryScale = machineryMatrix ? Math.max(.001, Math.hypot(machineryMatrix.a, machineryMatrix.b)) : 1;
  const cargoState = (cargo, fallbackY) => {
    const rect = cargo?.getBoundingClientRect();
    if (!rect || !destinationMachinerySvg || !machineryInverse) return { x: 122, y: fallbackY, scale: .72, angle: 0 };
    const point = destinationMachinerySvg.createSVGPoint();
    point.x = rect.left + rect.width * .5;
    point.y = rect.top + rect.height * .5;
    const local = point.matrixTransform(machineryInverse);
    return { x: local.x, y: local.y, scale: rect.width / (128 * machineryScale), angle: 0 };
  };
  const sourceOne = cargoState(journeyCargoOne, 451);
  const sourceTwo = cargoState(journeyCargoTwo, 484);
  const visualMatrix = destinationVisualSvg?.getScreenCTM();
  const visualScale = visualMatrix ? Math.max(.001, Math.hypot(visualMatrix.a, visualMatrix.b)) : machineryScale;
  const visualAngle = visualMatrix ? Math.atan2(visualMatrix.b, visualMatrix.a) * 180 / Math.PI : 0;
  const machineryAngle = machineryMatrix ? Math.atan2(machineryMatrix.b, machineryMatrix.a) * 180 / Math.PI : 0;
  const foundationTarget = (x, y) => {
    if (!destinationVisualSvg || !destinationMachinerySvg || !visualMatrix || !machineryInverse) {
      return { x, y, scale: 1.75, angle: 90 };
    }
    const visualPoint = destinationVisualSvg.createSVGPoint();
    visualPoint.x = x;
    visualPoint.y = y;
    const screenPoint = visualPoint.matrixTransform(visualMatrix);
    const machineryPoint = destinationMachinerySvg.createSVGPoint();
    machineryPoint.x = screenPoint.x;
    machineryPoint.y = screenPoint.y;
    const localPoint = machineryPoint.matrixTransform(machineryInverse);
    return {
      x: localPoint.x,
      y: localPoint.y,
      scale: 1.75 * visualScale / machineryScale,
      angle: 90 + visualAngle - machineryAngle
    };
  };
  const targetOne = foundationTarget(421, 300);
  const targetTwo = foundationTarget(469, 300);
  const carryState = (source, target, progress) => ({
    x: lerp(source.x, target.x, progress),
    y: lerp(source.y, target.y, progress) - 142 * Math.sin(Math.PI * progress),
    scale: lerp(source.scale, target.scale, progress),
    angle: lerp(source.angle, target.angle, smooth(.12, .86, progress))
  });
  const mixState = (from, to, progress, lift = 0) => ({
    x: lerp(from.x, to.x, progress),
    y: lerp(from.y, to.y, progress) - lift * Math.sin(Math.PI * progress),
    scale: lerp(from.scale, to.scale, progress),
    angle: lerp(from.angle, to.angle, progress)
  });
  const unloadOne = smooth(.44, .62, destinationProgress);
  const unloadTwo = smooth(.72, .9, destinationProgress);
  const moduleOneState = carryState(sourceOne, targetOne, unloadOne);
  const moduleTwoState = carryState(sourceTwo, targetTwo, unloadTwo);
  const setModuleTransform = (module, state) => module?.setAttribute("transform", `translate(${state.x} ${state.y}) rotate(${state.angle}) scale(${state.scale}) translate(-64 -13.5)`);
  setModuleTransform(destinationModule, moduleOneState);
  setModuleTransform(destinationModuleTwo, moduleTwoState);

  let hookTarget = sourceOne;
  if (destinationProgress >= .44 && destinationProgress < .62) {
    hookTarget = moduleOneState;
  } else if (destinationProgress >= .62 && destinationProgress < .68) {
    hookTarget = mixState(targetOne, sourceTwo, smooth(.62, .68, destinationProgress), 54);
  } else if (destinationProgress >= .68 && destinationProgress < .72) {
    hookTarget = sourceTwo;
  } else if (destinationProgress >= .72 && destinationProgress < .9) {
    hookTarget = moduleTwoState;
  } else if (destinationProgress >= .9) {
    hookTarget = mixState(targetTwo, { x: 255, y: 410, scale: 1, angle: 0 }, smooth(.9, .96, destinationProgress), 34);
  }
  const craneOpacity = smooth(.38, .42, destinationProgress) * (1 - truckExit);
  let baseX = 338;
  let baseY = 471;
  const truckRect = journeyVehicleGraphic?.getBoundingClientRect();
  if (truckRect && destinationMachinerySvg && machineryInverse) {
    const truckJoint = destinationMachinerySvg.createSVGPoint();
    truckJoint.x = truckRect.left + truckRect.width * .79;
    truckJoint.y = truckRect.top + truckRect.height * .5;
    const localJoint = truckJoint.matrixTransform(machineryInverse);
    baseX = localJoint.x;
    baseY = localJoint.y;
  }
  const targetX = hookTarget.x;
  const targetY = hookTarget.y;
  const deltaX = targetX - baseX;
  const deltaY = targetY - baseY;
  const craneLength = Math.max(1, Math.hypot(deltaX, deltaY));
  const elbowX = baseX + deltaX * .46 - deltaY / craneLength * 64;
  const elbowY = baseY + deltaY * .46 + deltaX / craneLength * 64;
  const hookX = targetX - deltaX / craneLength * 32;
  const hookY = targetY - deltaY / craneLength * 32;
  if (destinationArmBase) {
    destinationArmBase.setAttribute("x1", String(baseX));
    destinationArmBase.setAttribute("y1", String(baseY));
    destinationArmBase.setAttribute("x2", String(elbowX));
    destinationArmBase.setAttribute("y2", String(elbowY));
    destinationArmBase.style.opacity = String(craneOpacity);
  }
  if (destinationArmFore) {
    destinationArmFore.setAttribute("x1", String(elbowX));
    destinationArmFore.setAttribute("y1", String(elbowY));
    destinationArmFore.setAttribute("x2", String(hookX));
    destinationArmFore.setAttribute("y2", String(hookY));
    destinationArmFore.style.opacity = String(craneOpacity);
  }
  if (destinationCable) {
    destinationCable.setAttribute("x1", String(hookX));
    destinationCable.setAttribute("y1", String(hookY));
    destinationCable.setAttribute("x2", String(targetX));
    destinationCable.setAttribute("y2", String(targetY));
    destinationCable.style.opacity = String(craneOpacity);
  }
  if (destinationElbow) {
    destinationElbow.setAttribute("cx", String(elbowX));
    destinationElbow.setAttribute("cy", String(elbowY));
    destinationElbow.style.opacity = String(craneOpacity);
  }
  if (destinationHook) {
    destinationHook.setAttribute("cx", String(hookX));
    destinationHook.setAttribute("cy", String(hookY));
    destinationHook.style.opacity = String(craneOpacity);
  }
  if (destinationJoint) {
    destinationJoint.setAttribute("cx", String(baseX));
    destinationJoint.setAttribute("cy", String(baseY));
    destinationJoint.style.opacity = String(craneOpacity);
  }
  const moduleFade = 1 - smooth(.92, .97, destinationProgress);
  if (destinationModule) destinationModule.style.opacity = String(smooth(.435, .455, destinationProgress) * moduleFade);
  if (destinationModuleTwo) destinationModuleTwo.style.opacity = String(smooth(.715, .735, destinationProgress) * moduleFade);
  const roofProgress = smooth(.92, .985, destinationProgress);
  if (destinationRoof) destinationRoof.style.opacity = "1";
  if (destinationRoofLeft) {
    destinationRoofLeft.style.opacity = String(roofProgress);
    destinationRoofLeft.style.transform = `translateX(${lerp(-78, 0, roofProgress)}px) rotate(${lerp(-6, 0, roofProgress)}deg)`;
  }
  if (destinationRoofRight) {
    destinationRoofRight.style.opacity = String(roofProgress);
    destinationRoofRight.style.transform = `translateX(${lerp(78, 0, roofProgress)}px) rotate(${lerp(6, 0, roofProgress)}deg)`;
  }
  const roofDetailsProgress = smooth(.95, .99, destinationProgress);
  if (destinationRoofDetails) destinationRoofDetails.style.opacity = String(roofDetailsProgress);
  const deckProgress = smooth(.955, .995, destinationProgress);
  if (destinationDeck) {
    destinationDeck.style.opacity = String(deckProgress);
    destinationDeck.style.transform = `scaleX(${deckProgress})`;
  }
  const finishProgress = smooth(.975, 1, destinationProgress);
  if (destinationFinishDetails) {
    destinationFinishDetails.style.opacity = String(finishProgress);
    destinationFinishDetails.style.transform = `scale(${lerp(.7, 1, finishProgress)})`;
  }
  const beatIndex = destinationProgress < .4 ? 0 : destinationProgress < .92 ? 1 : 2;
  destinationBeats.forEach((beat, index) => beat.classList.toggle("is-active", index === beatIndex));
  updateTruckTextShadows(vehicleFade);
}

function journeyTick() {
  journeyFrame = 0;
  journeyCurrentScroll = journeyTargetScroll;
  renderJourney(journeyCurrentScroll);
  if (!motionPreference.matches && journeyAngleRemaining > .08) {
    journeyFrame = requestAnimationFrame(journeyTick);
  }
}

function readJourneyState() {
  journeyTargetScroll = window.scrollY;
  if (!journeyFrame) journeyFrame = requestAnimationFrame(journeyTick);
}

if (journeyLayer && journeyRoute && journeyVehicle && heroJourney && journeyDestination) {
  const rebuildJourney = () => {
    buildJourneyRoute();
    journeyCurrentScroll = window.scrollY;
    journeyTargetScroll = window.scrollY;
    renderJourney(window.scrollY);
  };
  const resizeJourney = () => {
    const viewportWidth = journeyViewportWidth();
    if (Math.abs(viewportWidth - journeyLayoutWidth) <= 2) {
      if (journeyFrame) cancelAnimationFrame(journeyFrame);
      journeyFrame = 0;
      journeyCurrentScroll = window.scrollY;
      journeyTargetScroll = window.scrollY;
      renderJourney(window.scrollY);
      return;
    }
    journeyLayoutWidth = viewportWidth;
    rebuildJourney();
  };
  rebuildJourney();
  window.addEventListener("scroll", readJourneyState, { passive: true });
  window.addEventListener("resize", resizeJourney, { passive: true });
  motionPreference.addEventListener?.("change", rebuildJourney);
  document.fonts?.ready.then(rebuildJourney);
  document.querySelector(".manifesto-backdrop img")?.addEventListener("load", rebuildJourney);
  if ("ResizeObserver" in window) {
    let layoutFrame = 0;
    const layoutObserver = new ResizeObserver(() => {
      if (layoutFrame) cancelAnimationFrame(layoutFrame);
      layoutFrame = requestAnimationFrame(() => { layoutFrame = 0; rebuildJourney(); });
    });
    document.querySelectorAll("main > section, .motion-chapter--factory").forEach(section => layoutObserver.observe(section));
  }
}

const siteHeader = document.querySelector("[data-header]");
const updateHeader = () => siteHeader?.classList.toggle("is-scrolled", window.scrollY > 32);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

if ("IntersectionObserver" in window && !motionPreference.matches) {
  const revealTargets = [...document.querySelectorAll(".company-copy, .company-photos figure, .manifesto-grid > :not(.motion-slot), .section-heading, .pillar-card, .chalet-showcase-heading > *, .chalet-photo, .testimonials-heading > *, .testimonial-card, .process-list li, .comparison-table, .profile-grid > :not(.motion-slot), .territory-layout > :not(.motion-slot), .faq-list details, .lead-section > :not(.motion-slot)")];
  revealTargets.forEach((target, index) => {
    target.setAttribute("data-reveal", "");
    target.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`);
  });
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .1, rootMargin: "0px 0px -4% 0px" });
  revealTargets.forEach((target) => revealObserver.observe(target));
}

const faqList = document.querySelector(".faq-list");
if (faqList) {
  const closeTimers = new WeakMap();
  faqList.classList.add("faq-enhanced");
  faqList.querySelectorAll("details").forEach((detail) => {
    const summary = detail.querySelector("summary");
    const answer = detail.querySelector(".faq-answer");
    const startsOpen = detail.hasAttribute("open");
    detail.classList.toggle("is-expanded", startsOpen);
    summary?.setAttribute("aria-expanded", String(startsOpen));
    answer?.setAttribute("aria-hidden", String(!startsOpen));
    summary?.addEventListener("click", (event) => {
      event.preventDefault();
      const timer = closeTimers.get(detail);
      if (timer) clearTimeout(timer);
      const willOpen = !detail.classList.contains("is-expanded");
      summary.setAttribute("aria-expanded", String(willOpen));
      answer?.setAttribute("aria-hidden", String(!willOpen));
      if (willOpen) {
        detail.open = true;
        detail.classList.remove("is-closing");
        requestAnimationFrame(() => detail.classList.add("is-expanded"));
        return;
      }
      detail.classList.remove("is-expanded");
      detail.classList.add("is-closing");
      const closeDelay = motionPreference.matches ? 0 : 430;
      closeTimers.set(detail, setTimeout(() => {
        detail.open = false;
        detail.classList.remove("is-closing");
        closeTimers.delete(detail);
      }, closeDelay));
    });
  });
}

const customSelects = [];
document.querySelectorAll(".lead-form select").forEach((select, index) => {
  const shell = document.createElement("div");
  const trigger = document.createElement("div");
  const valueLabel = document.createElement("span");
  const chevron = document.createElement("i");
  const menu = document.createElement("div");
  const menuId = `select-menu-${index + 1}`;
  const fieldLabel = select.closest("label")?.childNodes[0]?.textContent?.trim() || "Selecionar opção";
  let menuCloseTimer = 0;

  shell.className = "custom-select";
  trigger.className = "custom-select-trigger";
  trigger.tabIndex = 0;
  trigger.setAttribute("role", "combobox");
  trigger.setAttribute("aria-label", fieldLabel);
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", menuId);
  chevron.setAttribute("aria-hidden", "true");
  menu.className = "custom-select-menu";
  menu.id = menuId;
  menu.setAttribute("role", "listbox");
  menu.setAttribute("aria-label", fieldLabel);
  select.classList.add("custom-select-native");
  select.tabIndex = -1;
  select.setAttribute("aria-hidden", "true");

  const close = (restoreFocus = false) => {
    shell.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    clearTimeout(menuCloseTimer);
    const finishClose = () => shell.classList.remove("opens-up");
    if (motionPreference.matches) finishClose();
    else menuCloseTimer = window.setTimeout(finishClose, 280);
    if (restoreFocus) trigger.focus();
  };
  const sync = () => {
    const selected = select.options[select.selectedIndex];
    valueLabel.textContent = selected?.textContent || "Selecione";
    trigger.classList.toggle("has-value", Boolean(select.value));
    trigger.classList.remove("is-invalid");
    menu.querySelectorAll("[role='option']").forEach((option) => {
      option.setAttribute("aria-selected", String(option.dataset.value === select.value));
    });
  };
  const open = () => {
    customSelects.forEach((item) => item.shell !== shell && item.close());
    clearTimeout(menuCloseTimer);
    const rect = trigger.getBoundingClientRect();
    shell.classList.toggle("opens-up", window.innerHeight - rect.bottom < 250 && rect.top > 250);
    shell.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  };
  const choose = (option) => {
    select.value = option.dataset.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    sync();
    close(true);
  };
  const buildOptions = () => {
    menu.replaceChildren();
    [...select.options].forEach((sourceOption) => {
      if (!sourceOption.value) return;
      const option = document.createElement("div");
      option.tabIndex = -1;
      option.className = "custom-select-option";
      option.dataset.value = sourceOption.value;
      option.setAttribute("role", "option");
      option.textContent = sourceOption.textContent;
      option.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        choose(option);
      });
      menu.append(option);
    });
    sync();
  };

  trigger.append(valueLabel, chevron);
  shell.append(trigger, menu);
  select.before(shell);
  shell.append(select);
  customSelects.push({ select, shell, close, refresh: buildOptions });
  buildOptions();

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    shell.classList.contains("is-open") ? close() : open();
  });
  trigger.addEventListener("keydown", (event) => {
    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      shell.classList.contains("is-open") ? close() : open();
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!shell.classList.contains("is-open")) open();
      const options = [...menu.querySelectorAll("[role='option']")];
      const selectedIndex = Math.max(0, options.findIndex((option) => option.getAttribute("aria-selected") === "true"));
      const targetIndex = event.key === "End" ? options.length - 1 : event.key === "ArrowUp" ? Math.max(0, selectedIndex - 1) : event.key === "Home" ? 0 : Math.min(options.length - 1, selectedIndex + 1);
      options[targetIndex]?.focus();
    } else if (event.key === "Escape") {
      close();
    }
  });
  menu.addEventListener("keydown", (event) => {
    const options = [...menu.querySelectorAll("[role='option']")];
    const current = options.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (["Enter", " "].includes(event.key) && current >= 0) {
      event.preventDefault();
      choose(options[current]);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      options[clamp(current + direction, 0, options.length - 1)]?.focus();
    }
  });
  select.addEventListener("change", sync);
  select.addEventListener("invalid", () => {
    trigger.classList.add("is-invalid");
    trigger.focus();
  });
});

document.addEventListener("click", (event) => {
  customSelects.forEach((item) => !item.shell.contains(event.target) && item.close());
});

const stateSelect = document.querySelector("select[name='estado']");
const cityInput = document.querySelector("input[name='cidade']");
const ibgeBaseUrl = "https://servicodados.ibge.gov.br/api/v1/localidades";

if (stateSelect && cityInput) {
  const stateCustomSelect = customSelects.find((item) => item.select === stateSelect);
  const cityLabel = cityInput.closest("label");
  const cityShell = document.createElement("div");
  const cityMenu = document.createElement("div");
  const cityCode = document.createElement("input");
  const cityCache = new Map();
  const cityMenuId = "city-options";
  let availableCities = [];
  let cityRequest = 0;
  let cityCloseTimer = 0;

  cityShell.className = "city-combobox";
  cityMenu.className = "city-options";
  cityMenu.id = cityMenuId;
  cityMenu.setAttribute("role", "listbox");
  cityMenu.setAttribute("aria-label", "Cidades do estado selecionado");
  cityCode.type = "hidden";
  cityCode.name = "cidade_ibge";
  cityInput.setAttribute("role", "combobox");
  cityInput.setAttribute("aria-controls", cityMenuId);
  cityInput.setAttribute("aria-expanded", "false");
  cityInput.setAttribute("aria-autocomplete", "list");
  cityInput.before(cityShell);
  cityShell.append(cityInput, cityMenu, cityCode);

  const normalizeLocation = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
  const closeCityMenu = () => {
    cityShell.classList.remove("is-open");
    cityInput.setAttribute("aria-expanded", "false");
    clearTimeout(cityCloseTimer);
    const finishClose = () => cityShell.classList.remove("opens-up");
    if (motionPreference.matches) finishClose();
    else cityCloseTimer = window.setTimeout(finishClose, 280);
  };
  const chooseCity = (city) => {
    cityInput.value = city.nome;
    cityCode.value = String(city.id);
    cityInput.setCustomValidity("");
    cityInput.classList.add("is-valid");
    cityInput.classList.remove("is-invalid");
    closeCityMenu();
  };
  const renderCityOptions = (query = "") => {
    const normalizedQuery = normalizeLocation(query);
    const matches = normalizedQuery
      ? availableCities.filter((city) => normalizeLocation(city.nome).includes(normalizedQuery))
      : availableCities;
    cityMenu.replaceChildren();
    const fragment = document.createDocumentFragment();
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "city-option-empty";
      empty.textContent = "Nenhuma cidade encontrada";
      fragment.append(empty);
    } else {
      matches.forEach((city) => {
        const option = document.createElement("div");
        option.className = "city-option";
        option.tabIndex = -1;
        option.dataset.cityId = String(city.id);
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", String(cityCode.value === String(city.id)));
        option.textContent = city.nome;
        option.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          chooseCity(city);
        });
        fragment.append(option);
      });
    }
    cityMenu.append(fragment);
  };
  const openCityMenu = () => {
    if (cityInput.disabled || !availableCities.length) return;
    customSelects.forEach((item) => item.close());
    clearTimeout(cityCloseTimer);
    renderCityOptions(cityInput.value);
    const rect = cityInput.getBoundingClientRect();
    cityShell.classList.toggle("opens-up", window.innerHeight - rect.bottom < 250 && rect.top > 250);
    cityShell.classList.add("is-open");
    cityInput.setAttribute("aria-expanded", "true");
  };
  const resetCity = (placeholder) => {
    availableCities = [];
    cityInput.value = "";
    cityCode.value = "";
    cityInput.disabled = true;
    cityInput.placeholder = placeholder;
    cityInput.classList.remove("is-valid", "is-invalid");
    cityInput.setCustomValidity("");
    cityMenu.replaceChildren();
    closeCityMenu();
  };
  const loadCities = async () => {
    const state = stateSelect.value;
    const requestId = ++cityRequest;
    if (!state) {
      resetCity("Selecione o estado primeiro");
      return;
    }
    resetCity("Carregando cidades do IBGE...");
    cityShell.classList.add("is-loading");
    try {
      const cached = cityCache.get(state);
      const cities = cached || await fetch(`${ibgeBaseUrl}/estados/${encodeURIComponent(state)}/municipios?orderBy=nome`).then((response) => {
        if (!response.ok) throw new Error("IBGE indisponível");
        return response.json();
      });
      if (requestId !== cityRequest) return;
      const collator = new Intl.Collator("pt-BR");
      availableCities = cities.map(({ id, nome }) => ({ id, nome })).sort((a, b) => collator.compare(a.nome, b.nome));
      cityCache.set(state, availableCities);
      cityInput.disabled = false;
      cityInput.placeholder = "Pesquise ou selecione a cidade";
      cityInput.focus();
      openCityMenu();
    } catch {
      if (requestId !== cityRequest) return;
      cityInput.disabled = false;
      cityInput.placeholder = "Não foi possível carregar. Selecione o estado novamente";
      cityInput.setCustomValidity("Não foi possível consultar as cidades no IBGE. Selecione o estado novamente.");
      cityInput.classList.add("is-invalid");
    } finally {
      if (requestId === cityRequest) cityShell.classList.remove("is-loading");
    }
  };

  cityInput.addEventListener("focus", openCityMenu);
  cityInput.addEventListener("click", openCityMenu);
  cityInput.addEventListener("input", () => {
    cityCode.value = "";
    const exactCity = availableCities.find((city) => normalizeLocation(city.nome) === normalizeLocation(cityInput.value));
    if (exactCity) {
      cityCode.value = String(exactCity.id);
      cityInput.setCustomValidity("");
      cityInput.classList.add("is-valid");
      cityInput.classList.remove("is-invalid");
    } else {
      cityInput.setCustomValidity("Selecione uma cidade da lista do IBGE.");
      cityInput.classList.remove("is-valid");
      cityInput.classList.toggle("is-invalid", Boolean(cityInput.value));
    }
    renderCityOptions(cityInput.value);
    cityShell.classList.add("is-open");
    cityInput.setAttribute("aria-expanded", "true");
  });
  cityInput.addEventListener("blur", () => {
    window.setTimeout(() => {
      if (!cityCode.value && cityInput.value) {
        cityInput.setCustomValidity("Selecione uma cidade da lista do IBGE.");
        cityInput.classList.add("is-invalid");
      }
      if (!cityShell.contains(document.activeElement)) closeCityMenu();
    }, 120);
  });
  cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeCityMenu();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!cityShell.classList.contains("is-open")) openCityMenu();
      const options = [...cityMenu.querySelectorAll("[role='option']")];
      const direction = event.key === "ArrowDown" ? 1 : -1;
      options[direction > 0 ? 0 : options.length - 1]?.focus();
    }
  });
  cityMenu.addEventListener("keydown", (event) => {
    const options = [...cityMenu.querySelectorAll("[role='option']")];
    const current = options.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      cityInput.focus();
      closeCityMenu();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      options[clamp(current + direction, 0, options.length - 1)]?.focus();
    } else if (["Enter", " "].includes(event.key) && current >= 0) {
      event.preventDefault();
      const city = availableCities.find((item) => String(item.id) === options[current].dataset.cityId);
      if (city) chooseCity(city);
    }
  });
  document.addEventListener("click", (event) => {
    if (!cityShell.contains(event.target)) closeCityMenu();
  });
  stateSelect.addEventListener("change", loadCities);

  fetch(`${ibgeBaseUrl}/estados?orderBy=nome`)
    .then((response) => response.ok ? response.json() : Promise.reject())
    .then((states) => {
      const selectedState = stateSelect.value;
      const placeholder = new Option("Selecione o estado", "");
      const stateOptions = states.map((state) => new Option(`${state.nome} (${state.sigla})`, state.sigla));
      stateSelect.replaceChildren(placeholder, ...stateOptions);
      stateSelect.value = selectedState;
      stateCustomSelect?.refresh();
    })
    .catch(() => stateCustomSelect?.refresh());
}

const whatsappInput = document.querySelector("input[name='whatsapp']");
const formatWhatsapp = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length < 3) return `(${digits}`;
  const areaCode = digits.slice(0, 2);
  const subscriber = digits.slice(2);
  if (subscriber.length <= 4) return `(${areaCode}) ${subscriber}`;
  if (subscriber.length <= 8) return `(${areaCode}) ${subscriber.slice(0, 4)}-${subscriber.slice(4)}`;
  return `(${areaCode}) ${subscriber.slice(0, 5)}-${subscriber.slice(5)}`;
};

whatsappInput?.addEventListener("input", () => {
  const cursor = whatsappInput.selectionStart ?? whatsappInput.value.length;
  const digitsBeforeCursor = whatsappInput.value.slice(0, cursor).replace(/\D/g, "").length;
  whatsappInput.value = formatWhatsapp(whatsappInput.value);
  let nextCursor = whatsappInput.value.length;
  if (digitsBeforeCursor < whatsappInput.value.replace(/\D/g, "").length) {
    let seenDigits = 0;
    nextCursor = 0;
    while (nextCursor < whatsappInput.value.length && seenDigits < digitsBeforeCursor) {
      if (/\d/.test(whatsappInput.value[nextCursor])) seenDigits += 1;
      nextCursor += 1;
    }
  }
  whatsappInput.setSelectionRange(nextCursor, nextCursor);
  const digitCount = whatsappInput.value.replace(/\D/g, "").length;
  whatsappInput.setCustomValidity(digitCount === 10 || digitCount === 11 ? "" : "Informe um WhatsApp com DDD.");
});

whatsappInput?.addEventListener("blur", () => {
  const digitCount = whatsappInput.value.replace(/\D/g, "").length;
  whatsappInput.setCustomValidity(digitCount === 10 || digitCount === 11 ? "" : "Informe um WhatsApp com DDD.");
});

const emailInput = document.querySelector("input[name='email']");
if (emailInput) {
  const emailLabel = emailInput.closest("label");
  const emailFeedback = document.createElement("span");
  const emailFeedbackId = "email-feedback";
  const strictEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;
  emailFeedback.className = "field-feedback";
  emailFeedback.id = emailFeedbackId;
  emailFeedback.setAttribute("aria-live", "polite");
  emailLabel?.classList.add("has-field-feedback");
  emailLabel?.append(emailFeedback);
  emailInput.setAttribute("aria-describedby", emailFeedbackId);

  const validateEmail = () => {
    const value = emailInput.value.trim();
    emailInput.setCustomValidity("");
    const isValid = Boolean(value) && !emailInput.validity.typeMismatch && strictEmailPattern.test(value);
    const isInvalid = Boolean(value) && !isValid;
    emailInput.classList.toggle("is-valid", isValid);
    emailInput.classList.toggle("is-invalid", isInvalid);
    emailFeedback.classList.toggle("is-valid", isValid);
    emailFeedback.classList.toggle("is-invalid", isInvalid);
    emailFeedback.textContent = isValid ? "E-mail válido" : isInvalid ? "Verifique o e-mail" : "";
    emailInput.setAttribute("aria-invalid", String(isInvalid));
    if (isInvalid) emailInput.setCustomValidity("Informe um endereço de e-mail válido.");
  };

  emailInput.addEventListener("input", validateEmail);
  emailInput.addEventListener("blur", validateEmail);
}

const leadForm = document.querySelector("#lead-form");
const formMessage = document.querySelector("#form-message");
leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!leadForm.reportValidity() || !formMessage) return;
  formMessage.hidden = false;
  formMessage.textContent = "Pré-cadastro validado. A conexão com o CRM será ativada antes da publicação comercial.";
});
