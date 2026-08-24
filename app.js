"use strict";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, amount) => a + (b - a) * amount;
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
const journeyVehicle = journeyLayer?.querySelector("[data-journey-vehicle]");
const journeyVehicleGraphic = journeyVehicle?.querySelector("svg");
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
const destinationRoadSurface = journeyDestination?.querySelector("[data-destination-road-surface]");
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

function sectionRouteAnchors(selector, x) {
  const section = document.querySelector(selector);
  if (!section) return [];
  const inset = Math.min(section.offsetHeight * .2, Math.max(90, window.innerHeight * .2));
  return [
    { x, y: section.offsetTop + inset },
    { x, y: section.offsetTop + section.offsetHeight - inset }
  ];
}

function destinationEntrancePoint(sceneScale = .72) {
  if (!destinationVisual || !destinationVisualSvg || !destinationFrame || !journeyDestination) return null;
  const previousTransform = destinationVisual.style.transform;
  destinationVisual.style.transform = `scale(${sceneScale})`;
  const matrix = destinationVisualSvg.getScreenCTM();
  const point = destinationVisualSvg.createSVGPoint();
  const frameRect = destinationFrame.getBoundingClientRect();
  point.x = 250;
  point.y = -35;
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
  const pageHeight = document.documentElement.scrollHeight;
  const mobile = viewportWidth <= 720;
  const tablet = viewportWidth > 720 && viewportWidth <= 1000;
  journeyLayer.style.height = `${pageHeight}px`;
  journeySvg.setAttribute("viewBox", `0 0 ${viewportWidth} ${pageHeight}`);
  journeyStartScroll = heroJourney.offsetTop + Math.max(0, heroJourney.offsetHeight - window.innerHeight);
  journeyStartY = journeyStartScroll + window.innerHeight * .56;
  const destinationEntrance = destinationEntrancePoint();
  journeyEndY = destinationEntrance?.y ?? journeyDestination.offsetTop + window.innerHeight * .56;

  const mobileLane = journeyX(.91);
  const anchors = [{ x: journeyX(mobile ? .91 : .78), y: journeyStartY }];
  const routeSections = [
    ["#oportunidade", mobile ? mobileLane : gridCorridorX(".manifesto-grid", 1, .56)],
    ["#modelo", mobile ? mobileLane : gridCorridorX(".pillar-grid", 1, .5)],
    ["#chales", mobile ? mobileLane : gridCorridorX(".chalet-gallery", 1, .5)],
    ["#processo", mobile ? mobileLane : gridCorridorX(".process-layout", 1, .44)],
    ["#vantagens", mobile ? mobileLane : gridCorridorX(".comparison-row", 2, .58)],
    ["#perfil", mobile ? mobileLane : gridCorridorX(".profile-grid", 1, .43)],
    ["#territorios", mobile ? mobileLane : gridCorridorX(".territory-layout", 1, .56)],
    ["#duvidas", mobile ? mobileLane : gridCorridorX(".faq-grid", 1, .42)]
  ];
  routeSections.forEach(([selector, x]) => anchors.push(...sectionRouteAnchors(selector, x)));
  anchors.push({ x: destinationEntrance?.x ?? journeyX(mobile ? .55 : tablet ? .5 : .55), y: journeyEndY });

  let routeData = `M ${anchors[0].x} ${anchors[0].y}`;
  for (let index = 1; index < anchors.length; index += 1) {
    const previous = anchors[index - 1];
    const current = anchors[index];
    const controlY = (previous.y + current.y) * .5;
    const finalSegment = index === anchors.length - 1;
    const secondControlX = current.x;
    const secondControlY = finalSegment ? current.y - Math.min(180, Math.max(70, (current.y - previous.y) * .24)) : controlY;
    routeData += ` C ${previous.x} ${controlY}, ${secondControlX} ${secondControlY}, ${current.x} ${current.y}`;
  }
  [journeyRoute, journeyRouteDash, journeyRouteProgress].forEach((path) => path?.setAttribute("d", routeData));
  journeyRouteLength = Math.max(1, journeyRoute.getTotalLength());
  if (journeyRouteProgress) {
    journeyRouteProgress.style.strokeDasharray = String(journeyRouteLength);
    journeyRouteProgress.style.strokeDashoffset = String(journeyRouteLength);
  }
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
  const tangentWindow = clamp(journeyViewportWidth() * .045, 42, 76);
  const previous = journeyRoute.getPointAtLength(Math.max(0, distance - tangentWindow));
  const next = journeyRoute.getPointAtLength(Math.min(journeyRouteLength, distance + tangentWindow));
  return { x: point.x, y: point.y, distance, angle: Math.atan2(next.y - previous.y, next.x - previous.x) * 180 / Math.PI };
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

function renderJourney(scrollPosition) {
  if (!journeyLayer || !journeyVehicle || !journeyRoute || !journeyDestination) return;
  const destinationRange = Math.max(1, journeyDestination.offsetHeight - window.innerHeight);
  const destinationRawProgress = clamp((scrollPosition - journeyDestination.offsetTop) / destinationRange);
  const destinationProgress = destinationRawProgress <= .25
    ? lerp(0, .38, destinationRawProgress / .25)
    : destinationRawProgress <= .72
      ? lerp(.38, 1, (destinationRawProgress - .25) / .47)
      : 1;
  const journeyEndScroll = journeyDestination.offsetTop + journeyDestination.offsetHeight;
  const loadingProgress = clamp(scrollPosition / Math.max(1, journeyStartScroll));
  const mobileFactory = journeyViewportWidth() <= 720;
  const mobileSceneReveal = mobileFactory ? smooth(.035, .075, loadingProgress) : 1;
  if (factoryHeroCopy) factoryHeroCopy.style.opacity = String(mobileFactory ? 1 - smooth(.02, .075, loadingProgress) : 1);
  heroJourney?.style.setProperty("--factory-scene-reveal", String(mobileSceneReveal));
  const arrivalProgress = smooth(.01, .18, destinationRawProgress);
  const cameraZoomProgress = smooth(.18, .25, destinationRawProgress);
  const truckExit = smooth(.93, .99, destinationProgress);
  const sceneScale = lerp(.72, 1, cameraZoomProgress);
  if (destinationVisual) destinationVisual.style.transform = `scale(${sceneScale})`;
  if (destinationMachinery) destinationMachinery.style.transform = `scale(${sceneScale})`;
  if (destinationRoad) destinationRoad.style.opacity = String(1 - cameraZoomProgress);
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
    vehiclePoint = journeyPointAtY(clamp(scrollPosition + window.innerHeight * .56, journeyStartY, journeyEndY));
    vehiclePoint.y -= scrollPosition;
  } else {
    let stageX = journeyX(.55);
    let stageY = window.innerHeight * .56;
    let stageAngle = 0;
    const destinationMatrix = destinationVisualSvg?.getScreenCTM();
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
      const routeWidth = parseFloat(getComputedStyle(journeyRoute).strokeWidth) || 68;
      const routeCenterWidth = parseFloat(getComputedStyle(journeyRouteProgress || journeyRoute).strokeWidth) || 4;
      destinationRoadEdge?.setAttribute("stroke-width", String(routeWidth / svgScale));
      destinationRoadSurface?.setAttribute("stroke-width", String(Math.max(8, routeWidth - 10) / svgScale));
      destinationRoadOrange?.setAttribute("stroke-width", String(routeCenterWidth / svgScale));
      destinationRoadDash?.setAttribute("stroke-width", String(routeCenterWidth / svgScale));
      stageX = stageScreen.x;
      stageY = stageScreen.y;
      stagePoint.x = localPrevious.x;
      stagePoint.y = localPrevious.y;
      const previousScreen = stagePoint.matrixTransform(destinationMatrix);
      stageAngle = Math.atan2(nextScreen.y - previousScreen.y, nextScreen.x - previousScreen.x) * 180 / Math.PI;
      vehicleScale = lerp(1, (250 * svgScale) / Math.max(1, journeyVehicle.offsetWidth), arrivalProgress);
    }
    vehiclePoint = {
      x: stageX,
      y: stageY,
      angle: stageAngle,
      distance: journeyRouteLength
    };
  }

  const vehicleFade = (scrollPosition > journeyEndScroll ? 0 : 1 - truckExit) * mobileSceneReveal;
  journeyVisualAngle = vehiclePoint.angle;
  journeyAngleRemaining = 0;
  journeyVehicle.style.opacity = String(vehicleFade);
  journeyVehicle.style.transform = `translate3d(${vehiclePoint.x}px, ${vehiclePoint.y}px, 0) translate(-50%, -50%) rotate(${journeyVisualAngle}deg)`;
  journeyVehicle.style.setProperty("--journey-zoom", String(vehicleScale));
  journeyLayer.classList.toggle("is-driving", scrollPosition > journeyStartScroll && scrollPosition < journeyDestination.offsetTop);
  journeyLayer.classList.toggle("is-arriving", scrollPosition >= journeyDestination.offsetTop);

  const cargoOneLoad = smooth(.025, .37, loadingProgress);
  const cargoTwoLoad = smooth(.53, .875, loadingProgress);
  const forkliftCycle = (progress) => {
    const approach = smooth(.04, .22, progress);
    const contact = smooth(.25, .3, progress);
    const liftUp = smooth(.3, .52, progress);
    const travel = smooth(.48, .75, progress);
    const lower = smooth(.75, .91, progress);
    const release = smooth(.94, 1, progress);
    return {
      engage: approach * (1 - release),
      contact,
      pickup: liftUp,
      lift: liftUp * (1 - lower),
      travel,
      lower,
      release
    };
  };
  const cargoOneCycle = forkliftCycle(cargoOneLoad);
  const cargoTwoCycle = forkliftCycle(cargoTwoLoad);
  const cargoOneLift = cargoOneCycle.lift;
  const cargoTwoLift = cargoTwoCycle.lift;
  const cargoOneZoom = 1 + cargoOneLift * .18;
  const cargoTwoZoom = 1 + cargoTwoLift * .18;
  const panelPath = (travel, startX, startY, curveY) => {
    const point = (amount) => ({
      x: lerp(startX, 0, amount),
      y: lerp(startY, 0, amount) + curveY * Math.sin(Math.PI * amount)
    });
    const current = point(travel);
    const previous = point(clamp(travel - .025));
    const next = point(clamp(travel + .025));
    return {
      localX: current.y,
      localY: -current.x,
      heading: Math.atan2(next.y - previous.y, next.x - previous.x) * 180 / Math.PI
    };
  };
  const cargoOnePath = panelPath(cargoOneCycle.travel, -125, -80, 20);
  const cargoTwoPath = panelPath(cargoTwoCycle.travel, -135, 70, -18);
  const panelRotation = (initialRotation, path, cycle) => {
    const carriedRotation = lerp(initialRotation, path.heading, cycle.pickup);
    return lerp(carriedRotation, 0, cycle.lower);
  };
  const cargoOneRotation = panelRotation(-7, cargoOnePath, cargoOneCycle);
  const cargoTwoRotation = panelRotation(7, cargoTwoPath, cargoTwoCycle);
  journeyCargoOne?.setAttribute("transform", `translate(${cargoOnePath.localX} ${cargoOnePath.localY}) rotate(${cargoOneRotation} 106 52) translate(106 52) scale(${cargoOneZoom}) translate(-106 -52)`);
  journeyCargoTwo?.setAttribute("transform", `translate(${cargoTwoPath.localX} ${cargoTwoPath.localY}) rotate(${cargoTwoRotation} 106 87) translate(106 87) scale(${cargoTwoZoom}) translate(-106 -87)`);
  if (journeyCargoOne) journeyCargoOne.style.filter = `drop-shadow(0 ${lerp(3, 16, cargoOneLift)}px ${lerp(2, 9, cargoOneLift)}px rgba(5,16,7,${lerp(.18, .34, cargoOneLift)}))`;
  if (journeyCargoTwo) journeyCargoTwo.style.filter = `drop-shadow(0 ${lerp(3, 16, cargoTwoLift)}px ${lerp(2, 9, cargoTwoLift)}px rgba(5,16,7,${lerp(.18, .34, cargoTwoLift)}))`;
  const cargoOneSceneFade = 1 - smooth(.435, .455, destinationProgress);
  const cargoTwoSceneFade = 1 - smooth(.715, .735, destinationProgress);
  if (journeyCargoOne) journeyCargoOne.style.opacity = String(cargoOneSceneFade);
  if (journeyCargoTwo) journeyCargoTwo.style.opacity = String(cargoTwoSceneFade);
  if (journeyLoader) {
    const loaderFade = mobileSceneReveal * (1 - smooth(.875, 1, loadingProgress));
    const cargoOneRect = journeyCargoOne?.getBoundingClientRect();
    const cargoTwoRect = journeyCargoTwo?.getBoundingClientRect();
    const cargoSwitch = smooth(.38, .52, loadingProgress);
    const cargoOneTop = cargoOneRect?.top ?? window.innerHeight * .4;
    const cargoTwoTop = cargoTwoRect?.top ?? cargoOneTop;
    const cargoOneCenter = cargoOneRect ? cargoOneRect.left + cargoOneRect.width * .5 : vehiclePoint.x;
    const cargoTwoCenter = cargoTwoRect ? cargoTwoRect.left + cargoTwoRect.width * .5 : cargoOneCenter;
    const cargoOneMiddle = cargoOneRect ? cargoOneRect.top + cargoOneRect.height * .5 : cargoOneTop;
    const cargoTwoMiddle = cargoTwoRect ? cargoTwoRect.top + cargoTwoRect.height * .5 : cargoTwoTop;
    const activeCargoWidth = lerp(cargoOneRect?.width ?? 90, cargoTwoRect?.width ?? 90, cargoSwitch);
    const activeLift = lerp(cargoOneLift, cargoTwoLift, cargoSwitch);
    const activeEngage = lerp(cargoOneCycle.engage, cargoTwoCycle.engage, cargoSwitch);
    const activeTravel = lerp(cargoOneCycle.travel, cargoTwoCycle.travel, cargoSwitch);
    const viewportWidth = journeyViewportWidth();
    const forkliftBaseScale = viewportWidth <= 720 ? .58 : viewportWidth <= 1000 ? .9 : 1;
    const motionScale = viewportWidth <= 720 ? .56 : viewportWidth <= 1000 ? .84 : 1;
    const parkedOffset = clamp(activeCargoWidth * 1.7, 140 * motionScale, 160 * motionScale);
    const engagedOffset = clamp(activeCargoWidth * .9, 96 * motionScale, 102 * motionScale);
    const forkliftPose = (centerX, centerY, path, cycle) => {
      const alignmentTurn = (1 - cycle.engage) * (cycle.release > .25 ? 22 : -22);
      const heading = path.heading + alignmentTurn;
      const distance = lerp(parkedOffset, engagedOffset, cycle.engage);
      const radians = heading * Math.PI / 180;
      return { x: centerX - Math.cos(radians) * distance, y: centerY - Math.sin(radians) * distance, heading };
    };
    const cargoOnePose = forkliftPose(cargoOneCenter, cargoOneMiddle, cargoOnePath, cargoOneCycle);
    const cargoTwoPose = forkliftPose(cargoTwoCenter, cargoTwoMiddle, cargoTwoPath, cargoTwoCycle);
    const transferCurve = Math.sin(Math.PI * cargoSwitch);
    const forkliftX = lerp(cargoOnePose.x, cargoTwoPose.x, cargoSwitch) - 44 * motionScale * transferCurve;
    const forkliftY = lerp(cargoOnePose.y, cargoTwoPose.y, cargoSwitch) + 72 * motionScale * transferCurve;
    const steering = lerp(cargoOnePose.heading, cargoTwoPose.heading, cargoSwitch) - 76 * transferCurve;
    const forkliftTransform = `translate3d(${forkliftX}px, ${forkliftY}px, 0) translate(-50%, -50%) rotate(${steering}deg) scale(${forkliftBaseScale})`;
    journeyLoader.style.opacity = String(loaderFade);
    journeyLoader.style.transform = forkliftTransform;
    journeyLoader.style.setProperty("--forklift-lift", String(activeLift));
    journeyLoader.style.setProperty("--forklift-engage", String(activeEngage));
    journeyLoader.style.setProperty("--forklift-drive", String(activeTravel));
    if (journeyLoaderUnderlay) {
      journeyLoaderUnderlay.style.opacity = String(loaderFade);
      journeyLoaderUnderlay.style.transform = forkliftTransform;
      journeyLoaderUnderlay.style.setProperty("--forklift-lift", String(activeLift));
      journeyLoaderUnderlay.style.setProperty("--forklift-engage", String(activeEngage));
    }
  }
  if (journeyLoaderCable) journeyLoaderCable.style.opacity = String(mobileSceneReveal * (1 - smooth(.875, 1, loadingProgress)));

  const loadingSceneFade = 1 - smooth(.875, 1, loadingProgress);
  const factoryRailOpacity = (mobileFactory ? .48 : .82) * loadingSceneFade * mobileSceneReveal;
  heroJourney?.style.setProperty("--factory-loading-opacity", String(factoryRailOpacity));

  const routeProgress = clamp(vehiclePoint.distance / journeyRouteLength);
  if (journeyRouteProgress) journeyRouteProgress.style.strokeDashoffset = String(journeyRouteLength * (1 - routeProgress));
  if (journeySvg) {
    const roadExitOpacity = scrollPosition < journeyDestination.offsetTop ? 1 : 1 - smooth(0, .07, destinationProgress);
    const roadRevealOpacity = smooth(.875, 1, loadingProgress);
    journeySvg.style.opacity = String(roadRevealOpacity * roadExitOpacity);
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
  const targetOne = { x: 421, y: 300, scale: 1.75, angle: 90 };
  const targetTwo = { x: 469, y: 300, scale: 1.75, angle: 90 };
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
}

const siteHeader = document.querySelector("[data-header]");
const updateHeader = () => siteHeader?.classList.toggle("is-scrolled", window.scrollY > 32);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

if ("IntersectionObserver" in window && !motionPreference.matches) {
  const revealTargets = [...document.querySelectorAll(".manifesto-grid > :not(.motion-slot), .section-heading, .pillar-card, .chalet-showcase-heading > *, .chalet-photo, .process-list li, .comparison-table, .profile-grid > :not(.motion-slot), .territory-layout > :not(.motion-slot), .faq-list details, .lead-section > :not(.motion-slot)")];
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
