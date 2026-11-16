'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DELHI_STOPS, DELHI_CORRIDORS, BusStop, TransitCorridor } from '@/data/delhiTransitData';
import { METRO_LINES, METRO_STATIONS, INTERCHANGE_SURVEYS } from '@/lib/multimodal/networkGraph';
import { DELHI_MOBILITY_ZONES } from '@/lib/demand/odMatrixEngine';

export type CameraPreset = 'overview' | 'corridor' | 'street' | 'simulation' | 'journey';

export type DigitalTwinLayer =
  | 'all'
  | 'metro'
  | 'buses'
  | 'interchanges'
  | 'accessibility'
  | 'demand'
  | 'flow'
  | 'utilization'
  | 'disruption'
  | 'flood_risk'
  | 'demographics';

interface DelhiCityCanvasProps {
  interactive?: boolean;
  activeCorridorId?: string | null;
  activeStopId?: string | null;
  onSelectCorridor?: (corridor: TransitCorridor | null) => void;
  onSelectStop?: (stop: BusStop | null) => void;
  preset?: CameraPreset;
  timeHour?: number; // 6 to 22
  showBuses?: boolean;
  className?: string;
  splitMode?: boolean;
  isSimulatedVariant?: boolean;
  activeLayer?: DigitalTwinLayer;
  viewMode?: '3D' | '2D';
}

export default function DelhiCityCanvas({
  interactive = true,
  activeCorridorId = null,
  activeStopId = null,
  onSelectCorridor,
  onSelectStop,
  preset = 'overview',
  timeHour = 9,
  showBuses = true,
  className = '',
  splitMode = false,
  isSimulatedVariant = false,
  activeLayer = 'all',
  viewMode = '3D',
}: DelhiCityCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Wide, cinematic three-quarter aerial perspective by default
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(48, 54, 62));
  const currentCamPos = useRef<THREE.Vector3>(new THREE.Vector3(48, 54, 62));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const previousMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitAngle = useRef<{ theta: number; phi: number }>({ theta: 0.82, phi: 0.65 });

  const [hoveredStop, setHoveredStop] = useState<BusStop | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Entity references
  const busEntitiesRef = useRef<
    {
      group: THREE.Group;
      corridor: TransitCorridor;
      progress: number;
      speed: number;
    }[]
  >([]);
  const corridorCurvesRef = useRef<Map<string, THREE.CatmullRomCurve3>>(new Map());
  const stopMarkersRef = useRef<Map<string, THREE.Group>>(new Map());
  const pulseParticlesRef = useRef<
    {
      mesh: THREE.Mesh;
      corridorId: string;
      progress: number;
      speed: number;
    }[]
  >([]);

  // Phase 10 Analytical Geospatial Layer Groups Ref
  const layerGroupsRef = useRef<Record<string, THREE.Group>>({});

  // Lighting references
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Camera presets & 2D/3D view mode
  useEffect(() => {
    if (viewMode === '2D') {
      targetCamPos.current.set(0, 88, 0.01);
      targetLookAt.current.set(0, 0, 0);
      return;
    }
    if (preset === 'overview') {
      targetCamPos.current.set(48, 54, 62);
      targetLookAt.current.set(0, 0, 0);
    } else if (preset === 'corridor') {
      targetCamPos.current.set(24, 30, 36);
      targetLookAt.current.set(6, 0, 14);
    } else if (preset === 'street') {
      targetCamPos.current.set(14, 12, 18);
      targetLookAt.current.set(0, 1.2, 0);
    } else if (preset === 'journey') {
      targetCamPos.current.set(26, 32, 38);
      targetLookAt.current.set(6, 0, 12);
    } else if (preset === 'simulation') {
      targetCamPos.current.set(40, 46, 52);
      targetLookAt.current.set(2, 0, 4);
    }
  }, [preset, viewMode]);

  // Phase 10 Dynamic Geospatial Layer Visibility
  useEffect(() => {
    const lg = layerGroupsRef.current;
    if (!lg || !lg.metro) return;
    lg.metro.visible = activeLayer === 'all' || activeLayer === 'metro';
    lg.buses.visible = activeLayer === 'all' || activeLayer === 'buses';
    lg.interchanges.visible = activeLayer === 'all' || activeLayer === 'interchanges';
    lg.accessibility.visible = activeLayer === 'accessibility';
    lg.demand.visible = activeLayer === 'demand';
    lg.flow.visible = activeLayer === 'flow';
    lg.utilization.visible = activeLayer === 'utilization';
    lg.disruption.visible = activeLayer === 'disruption';
    lg.flood_risk.visible = activeLayer === 'flood_risk';
    lg.demographics.visible = activeLayer === 'demographics';
  }, [activeLayer]);

  // Dynamic focus on selected corridor or stop
  useEffect(() => {
    if (activeCorridorId) {
      const corridor = DELHI_CORRIDORS.find((c) => c.id === activeCorridorId);
      if (corridor && corridor.path.length > 0) {
        const midPoint = corridor.path[Math.floor(corridor.path.length / 2)];
        targetLookAt.current.set(midPoint[0], 0, midPoint[2]);
        targetCamPos.current.set(midPoint[0] + 22, 26, midPoint[2] + 28);
      }
    }
  }, [activeCorridorId]);

  useEffect(() => {
    if (activeStopId) {
      const stop = DELHI_STOPS.find((s) => s.id === activeStopId);
      if (stop) {
        targetLookAt.current.set(stop.coordinates[0], 0.5, stop.coordinates[1]);
        targetCamPos.current.set(stop.coordinates[0] + 14, 16, stop.coordinates[1] + 16);
      }
    }
  }, [activeStopId]);

  // Lighting time-of-day changes
  useEffect(() => {
    if (!sunLightRef.current || !ambientLightRef.current || !sceneRef.current) return;
    const isMorningPeak = timeHour >= 8 && timeHour <= 10;
    const isEveningPeak = timeHour >= 17 && timeHour <= 19;
    const isNight = timeHour >= 20 || timeHour <= 6;

    if (isMorningPeak) {
      sunLightRef.current.position.set(45, 55, 40);
      sunLightRef.current.intensity = 1.6;
      sunLightRef.current.color.setHex(0xfff5e6);
      ambientLightRef.current.intensity = 0.8;
    } else if (isEveningPeak) {
      // Golden Hour over Delhi
      sunLightRef.current.position.set(-38, 32, 52);
      sunLightRef.current.intensity = 1.4;
      sunLightRef.current.color.setHex(0xffdfb8);
      ambientLightRef.current.intensity = 0.7;
    } else if (isNight) {
      sunLightRef.current.position.set(20, 40, 20);
      sunLightRef.current.intensity = 0.5;
      sunLightRef.current.color.setHex(0xd0d8e8);
      ambientLightRef.current.intensity = 0.5;
    } else {
      sunLightRef.current.position.set(30, 65, 30);
      sunLightRef.current.intensity = 1.65;
      sunLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 0.85;
    }
  }, [timeHour]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const bgFogColor = splitMode ? (isSimulatedVariant ? 0xf0ece2 : 0xede6da) : 0xf5f0e6;
    scene.background = new THREE.Color(bgFogColor);
    scene.fog = new THREE.FogExp2(bgFogColor, 0.0075);

    const aspect = container.clientWidth / container.clientHeight;
    // 36-degree FoV for telephoto/isometric architectural photography feel
    const camera = new THREE.PerspectiveCamera(36, aspect, 0.5, 400);
    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentLookAt.current);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      });
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 500;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.06;

      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to 2D vector schematic:', e);
      setWebglSupported(false);
      return;
    }

    // 2. Architectural Materials
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xede7dc,
      roughness: 0.94,
      metalness: 0.03,
    });

    const roadAsphaltMaterial = new THREE.MeshStandardMaterial({
      color: 0x514d48, // Design token asphalt
      roughness: 0.88,
      metalness: 0.08,
    });

    const brtLaneMaterial = new THREE.MeshStandardMaterial({
      color: 0xb84c32, // Terracotta bus lane
      roughness: 0.75,
      metalness: 0.05,
    });

    const buildingMatWhite = new THREE.MeshStandardMaterial({
      color: 0xf6f3ec,
      roughness: 0.76,
      metalness: 0.06,
    });

    const buildingMatStone = new THREE.MeshStandardMaterial({
      color: 0xd9cebe,
      roughness: 0.82,
      metalness: 0.1,
    });

    const buildingMatSandstone = new THREE.MeshStandardMaterial({
      color: 0xb86048, // Dholpur Red Sandstone
      roughness: 0.85,
      metalness: 0.05,
    });

    const parkGreenMaterial = new THREE.MeshStandardMaterial({
      color: 0xc4cca8,
      roughness: 0.95,
      metalness: 0.0,
    });

    const treeFoliageMaterial = new THREE.MeshStandardMaterial({
      color: 0xa2b292,
      roughness: 0.9,
    });

    // 3. Ground & Topography
    const groundGeo = new THREE.PlaneGeometry(220, 220, 1, 1);
    const ground = new THREE.Mesh(groundGeo, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(180, 36, 0xdcd3c4, 0xe8e2d4);
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);

    // 4. Urban Geometry: Connaught Place Architecture
    const cpCenterPark = new THREE.Mesh(
      new THREE.CylinderGeometry(5.2, 5.2, 0.08, 36),
      parkGreenMaterial
    );
    cpCenterPark.position.set(0, 0.04, 0);
    cpCenterPark.receiveShadow = true;
    scene.add(cpCenterPark);

    // Central Pool & Flagpole
    const poolMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 0.09, 24),
      new THREE.MeshStandardMaterial({ color: 0x8ba6b8, roughness: 0.25 })
    );
    poolMesh.position.set(0, 0.05, 0);
    scene.add(poolMesh);

    const flagPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 4.8, 8),
      new THREE.MeshStandardMaterial({ color: 0xc89b53, metalness: 0.6, roughness: 0.2 })
    );
    flagPole.position.set(0, 2.4, 0);
    scene.add(flagPole);

    // Connaught Place Inner Circle Arcade (12 Colonnaded Georgian blocks)
    const innerBlocks = 12;
    const innerRadius = 8.6;
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const innerInstanced = new THREE.InstancedMesh(boxGeo, buildingMatWhite, innerBlocks);
    innerInstanced.castShadow = true;
    innerInstanced.receiveShadow = true;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < innerBlocks; i++) {
      const angle = (i / innerBlocks) * Math.PI * 2;
      const x = Math.cos(angle) * innerRadius;
      const z = Math.sin(angle) * innerRadius;
      const height = 2.4 + (i % 2) * 0.4;
      dummy.position.set(x, height / 2, z);
      dummy.rotation.y = -angle + Math.PI / 2;
      dummy.scale.set(2.8, height, 2.0);
      dummy.updateMatrix();
      innerInstanced.setMatrixAt(i, dummy.matrix);
    }
    scene.add(innerInstanced);

    // Outer Circle Commercial Blocks (18 blocks with varied heights & setbacks)
    const outerBlocks = 18;
    const outerRadius = 14.8;
    const outerInstanced = new THREE.InstancedMesh(boxGeo, buildingMatStone, outerBlocks);
    outerInstanced.castShadow = true;
    outerInstanced.receiveShadow = true;

    for (let i = 0; i < outerBlocks; i++) {
      const angle = (i / outerBlocks) * Math.PI * 2;
      const x = Math.cos(angle) * outerRadius;
      const z = Math.sin(angle) * outerRadius;
      const height = 3.2 + (i % 3) * 0.9;
      dummy.position.set(x, height / 2, z);
      dummy.rotation.y = -angle + Math.PI / 2;
      dummy.scale.set(3.6, height, 2.6);
      dummy.updateMatrix();
      outerInstanced.setMatrixAt(i, dummy.matrix);
    }
    scene.add(outerInstanced);

    // 8 Radial Spoke Avenues as flat embedded road ribbons
    const radialAvenuesCount = 8;
    const radialRoadGeo = new THREE.PlaneGeometry(2.4, 40);
    for (let a = 0; a < radialAvenuesCount; a++) {
      const radAngle = (a / radialAvenuesCount) * Math.PI * 2;
      const radMesh = new THREE.Mesh(radialRoadGeo, roadAsphaltMaterial);
      radMesh.rotation.x = -Math.PI / 2;
      radMesh.rotation.z = radAngle;
      radMesh.position.set(Math.cos(radAngle) * 26, 0.015, Math.sin(radAngle) * 26);
      radMesh.receiveShadow = true;
      scene.add(radMesh);
    }

    // Modern Commercial High-Rise Towers (Barakhamba Road & Nehru Place)
    const cityBlocksCount = 140;
    const cityInstanced = new THREE.InstancedMesh(boxGeo, buildingMatWhite, cityBlocksCount);
    cityInstanced.castShadow = true;
    cityInstanced.receiveShadow = true;

    const stoneInstanced = new THREE.InstancedMesh(boxGeo, buildingMatStone, 70);
    stoneInstanced.castShadow = true;
    stoneInstanced.receiveShadow = true;

    let cIdx = 0;
    let sIdx = 0;

    for (let x = -54; x <= 54; x += 10.2) {
      for (let z = -54; z <= 54; z += 10.2) {
        const distToCenter = Math.hypot(x, z);
        if (distToCenter < 18.0) continue; // preserve Connaught Place rings
        if (Math.abs(x) < 3.5 || Math.abs(z) < 3.5) continue; // preserve major axial corridors

        const isNehruPlace = x > 16 && z > 22;
        const isBarakhamba = x > 8 && x < 30 && z > -14 && z < 14;
        const isHighDensity = isNehruPlace || isBarakhamba;

        const baseHeight = isHighDensity ? 6.8 : 2.5;
        const height =
          baseHeight +
          ((Math.abs(x * 7 + z * 13) % 10) / 10) * (isHighDensity ? 8.4 : 3.4);

        dummy.position.set(x + Math.sin(z) * 0.6, height / 2, z + Math.cos(x) * 0.6);
        dummy.rotation.y = (x * z) % 0.35;
        dummy.scale.set(5.2 + (x % 2) * 0.4, height, 5.6 + (z % 2) * 0.4);
        dummy.updateMatrix();

        if (cIdx < cityBlocksCount && (x + z) % 3 !== 0) {
          cityInstanced.setMatrixAt(cIdx++, dummy.matrix);
        } else if (sIdx < 70) {
          stoneInstanced.setMatrixAt(sIdx++, dummy.matrix);
        }
      }
    }
    scene.add(cityInstanced);
    scene.add(stoneInstanced);

    // India Gate Sandstone Pavilion (South Axis at [2, 0, 22])
    const indiaGateGroup = new THREE.Group();
    indiaGateGroup.position.set(2, 0, 22);

    const pillarLeft = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.4, 1.6), buildingMatSandstone);
    pillarLeft.position.set(-1.2, 2.2, 0);
    pillarLeft.castShadow = true;
    indiaGateGroup.add(pillarLeft);

    const pillarRight = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.4, 1.6), buildingMatSandstone);
    pillarRight.position.set(1.2, 2.2, 0);
    pillarRight.castShadow = true;
    indiaGateGroup.add(pillarRight);

    const lintelArch = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.4, 1.8), buildingMatSandstone);
    lintelArch.position.set(0, 4.6, 0);
    lintelArch.castShadow = true;
    indiaGateGroup.add(lintelArch);

    scene.add(indiaGateGroup);

    // AIIMS Elevated Flyover Interchange (South Axis at [0, 0, 36])
    const aiimsFlyoverGroup = new THREE.Group();
    aiimsFlyoverGroup.position.set(0, 0, 36);

    const flyoverDeck = new THREE.Mesh(
      new THREE.BoxGeometry(14.0, 0.35, 2.2),
      buildingMatStone
    );
    flyoverDeck.position.y = 1.2;
    flyoverDeck.castShadow = true;
    aiimsFlyoverGroup.add(flyoverDeck);

    for (let pIdx = -5; pIdx <= 5; pIdx += 5) {
      const pier = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 1.2, 8),
        buildingMatStone
      );
      pier.position.set(pIdx, 0.6, 0);
      pier.castShadow = true;
      aiimsFlyoverGroup.add(pier);
    }
    scene.add(aiimsFlyoverGroup);

    // Qutub Minar Historical Minaret (South Axis at [0, 0, 56])
    const qutubGroup = new THREE.Group();
    qutubGroup.position.set(0, 0, 56);
    const minarBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.4, 3.0, 12),
      buildingMatSandstone
    );
    minarBase.position.y = 1.5;
    minarBase.castShadow = true;
    qutubGroup.add(minarBase);

    const minarShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.75, 4.5, 12),
      buildingMatSandstone
    );
    minarShaft.position.y = 5.25;
    minarShaft.castShadow = true;
    qutubGroup.add(minarShaft);
    scene.add(qutubGroup);

    // Architectural Trees along Rajpath / Janpath
    const treeCount = 40;
    const treeInstanced = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.4, 0.6, 1.3, 6),
      treeFoliageMaterial,
      treeCount
    );
    treeInstanced.castShadow = true;

    for (let t = 0; t < treeCount; t++) {
      const tx = (t % 2 === 0 ? -1 : 1) * (3.0 + (t % 3) * 0.4);
      const tz = -16 + t * 1.4;
      dummy.position.set(tx, 0.65, tz);
      dummy.rotation.y = t * 0.4;
      dummy.scale.set(0.9, 1.1, 0.9);
      dummy.updateMatrix();
      treeInstanced.setMatrixAt(t, dummy.matrix);
    }
    scene.add(treeInstanced);

    // 5. Embedded Road Geometry & Corridors (Flush with terrain, not floating!)
    DELHI_CORRIDORS.forEach((corridor) => {
      // Points mapped flush at y = 0.02
      const points = corridor.path.map((p) => new THREE.Vector3(p[0], 0.02, p[2]));
      const curve = new THREE.CatmullRomCurve3(points, corridor.type === 'ring');
      corridorCurvesRef.current.set(corridor.id, curve);

      // Embedded Asphalt Road Surface
      const roadGeo = new THREE.TubeGeometry(curve, 120, 0.8, 4, false);
      const roadMesh = new THREE.Mesh(roadGeo, roadAsphaltMaterial);
      roadMesh.receiveShadow = true;
      scene.add(roadMesh);

      // Dedicated Terracotta BRT Marking
      const brtGeo = new THREE.TubeGeometry(curve, 120, 0.28, 4, false);
      const brtMesh = new THREE.Mesh(brtGeo, brtLaneMaterial);
      brtMesh.position.y = 0.005;
      scene.add(brtMesh);

      // Glowing Transit Conduit
      const isSelected = activeCorridorId === corridor.id;
      const transitGeo = new THREE.TubeGeometry(curve, 120, isSelected ? 0.22 : 0.12, 6, false);
      const transitColor = new THREE.Color(corridor.color);
      const transitMat = new THREE.MeshBasicMaterial({
        color: transitColor,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.6,
      });
      const transitMesh = new THREE.Mesh(transitGeo, transitMat);
      scene.add(transitMesh);

      // Luminous Flow Pulse Beads
      const pulseGeo = new THREE.SphereGeometry(0.28, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
      });

      for (let p = 0; p < 3; p++) {
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        scene.add(pulseMesh);
        pulseParticlesRef.current.push({
          mesh: pulseMesh,
          corridorId: corridor.id,
          progress: p / 3,
          speed: 0.0007 + Math.random() * 0.00025,
        });
      }
    });

    // -------------------------------------------------------------
    // Phase 10 Analytical Geospatial Layer Hierarchy
    // -------------------------------------------------------------
    const metroGroup = new THREE.Group();
    const busesGroup = new THREE.Group();
    const interchangesGroup = new THREE.Group();
    const accessibilityGroup = new THREE.Group();
    const demandGroup = new THREE.Group();
    const flowGroup = new THREE.Group();
    const utilizationGroup = new THREE.Group();
    const disruptionGroup = new THREE.Group();
    const floodRiskGroup = new THREE.Group();
    const demographicsGroup = new THREE.Group();

    scene.add(metroGroup);
    scene.add(busesGroup);
    scene.add(interchangesGroup);
    scene.add(accessibilityGroup);
    scene.add(demandGroup);
    scene.add(flowGroup);
    scene.add(utilizationGroup);
    scene.add(disruptionGroup);
    scene.add(floodRiskGroup);
    scene.add(demographicsGroup);

    layerGroupsRef.current = {
      metro: metroGroup,
      buses: busesGroup,
      interchanges: interchangesGroup,
      accessibility: accessibilityGroup,
      demand: demandGroup,
      flow: flowGroup,
      utilization: utilizationGroup,
      disruption: disruptionGroup,
      flood_risk: floodRiskGroup,
      demographics: demographicsGroup,
    };

    // 6. Bus Stop Totems & Animated Halos
    DELHI_STOPS.forEach((stop) => {
      const stopGroup = new THREE.Group();
      stopGroup.position.set(stop.coordinates[0], 0, stop.coordinates[1]);

      const pinColor = stop.crowdingLevel === 'critical' ? 0xb84c32 : 0xc89b53;
      const pinMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.8, 12), pinMat);
      pin.position.y = 0.9;
      stopGroup.add(pin);

      const haloGeo = new THREE.RingGeometry(0.65, 0.88, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = -Math.PI / 2;
      halo.position.y = 1.9;
      stopGroup.add(halo);

      // Pick target
      const pickGeo = new THREE.SphereGeometry(2.4, 8, 8);
      const pickMat = new THREE.MeshBasicMaterial({ visible: false });
      const pickMesh = new THREE.Mesh(pickGeo, pickMat);
      pickMesh.position.y = 1.0;
      pickMesh.userData = { type: 'stop', stop };
      stopGroup.add(pickMesh);

      busesGroup.add(stopGroup);
      stopMarkersRef.current.set(stop.id, stopGroup);
    });

    // 6b. DMRC Metro Lines & Spatial Rail Conduits (Phase 8 Multimodal Integration)
    METRO_LINES.forEach((line) => {
      const linePoints: THREE.Vector3[] = [];
      for (const stId of line.stations) {
        const st = METRO_STATIONS.find((s) => s.id === stId);
        if (st) {
          linePoints.push(new THREE.Vector3(st.coordinatesLocal[0], 0.12, st.coordinatesLocal[1]));
        }
      }
      if (linePoints.length > 1) {
        const metroCurve = new THREE.CatmullRomCurve3(linePoints, false);
        const metroGeo = new THREE.TubeGeometry(metroCurve, 80, 0.16, 6, false);
        const metroMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(line.color),
          transparent: true,
          opacity: 0.85,
        });
        const metroMesh = new THREE.Mesh(metroGeo, metroMat);
        metroGroup.add(metroMesh);
      }
    });

    // 6c. DMRC Metro Stations & Interchange Disc Portals
    METRO_STATIONS.forEach((station) => {
      const stGroup = new THREE.Group();
      stGroup.position.set(station.coordinatesLocal[0], 0, station.coordinatesLocal[1]);

      const discGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.08, 16);
      const discMat = new THREE.MeshBasicMaterial({ color: 0x1B6CA8 });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.position.y = 0.06;
      stGroup.add(disc);

      const ringGeo = new THREE.RingGeometry(0.5, 0.7, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.14;
      stGroup.add(ring);

      metroGroup.add(stGroup);
    });

    // 6d. Multimodal Interchange Beacon Rings (IFI Hubs)
    INTERCHANGE_SURVEYS.forEach((hub) => {
      const busStop = DELHI_STOPS.find((s) => s.id === hub.busStopId);
      if (!busStop) return;

      const hubGroup = new THREE.Group();
      hubGroup.position.set(busStop.coordinates[0], 0, busStop.coordinates[1]);

      const beaconRing = new THREE.Mesh(
        new THREE.RingGeometry(1.2, 1.5, 28),
        new THREE.MeshBasicMaterial({
          color: 0xc89b53, // Antique Gold
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        })
      );
      beaconRing.rotation.x = -Math.PI / 2;
      beaconRing.position.y = 0.22;
      hubGroup.add(beaconRing);

      interchangesGroup.add(hubGroup);
    });

    // -------------------------------------------------------------
    // Phase 10 Extended Analytical Layers Population
    // -------------------------------------------------------------

    // 1. Accessibility Catchment Rings (400m & 800m isochrone discs)
    [...DELHI_STOPS, ...METRO_STATIONS].forEach((node) => {
      const coords = 'coordinates' in node ? node.coordinates : (node as any).coordinatesLocal;
      const c400 = new THREE.Mesh(
        new THREE.CircleGeometry(2.4, 20),
        new THREE.MeshBasicMaterial({ color: 0x4a6b5d, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
      );
      c400.rotation.x = -Math.PI / 2;
      c400.position.set(coords[0], 0.02, coords[1]);
      accessibilityGroup.add(c400);

      const c800 = new THREE.Mesh(
        new THREE.CircleGeometry(4.8, 20),
        new THREE.MeshBasicMaterial({ color: 0x2a5c8a, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
      );
      c800.rotation.x = -Math.PI / 2;
      c800.position.set(coords[0], 0.015, coords[1]);
      accessibilityGroup.add(c800);
    });

    // 2. Demand Density Extrusions (Planning Zones)
    DELHI_MOBILITY_ZONES.forEach((z) => {
      const x = (z.centerCoordinates[1] - 77.2197) * 160;
      const zPos = -(z.centerCoordinates[0] - 28.6328) * 160;
      const height = (z.residentPopulationThousands / 3650) * 8.0 + 1.2;
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, height, 6),
        new THREE.MeshStandardMaterial({ color: 0xc89b53, roughness: 0.4, metalness: 0.2 })
      );
      col.position.set(x, height / 2, zPos);
      demandGroup.add(col);
    });

    // 3. Passenger Flow Parabolic Arcs (Top Desire Lines)
    const flowPairs = [
      { from: [-18, 0, -42], to: [0, 0, 0] },
      { from: [-30, 0, 18], to: [0, 0, 0] },
      { from: [24, 0, 0], to: [0, 0, 0] },
      { from: [6, 0, 24], to: [-26, 0, 48] },
      { from: [0, 0, 0], to: [32, 0, 8] },
    ];
    flowPairs.forEach((pair) => {
      const start = new THREE.Vector3(pair.from[0], 0.2, pair.from[2]);
      const end = new THREE.Vector3(pair.to[0], 0.2, pair.to[2]);
      const mid = new THREE.Vector3((pair.from[0] + pair.to[0]) / 2, 5.5, (pair.from[2] + pair.to[2]) / 2);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 32, 0.2, 6, false),
        new THREE.MeshBasicMaterial({ color: 0xf26522, transparent: true, opacity: 0.8 })
      );
      flowGroup.add(tube);
    });

    // 4. Corridor Utilization Glow Bands
    DELHI_CORRIDORS.forEach((corridor) => {
      const curve = corridorCurvesRef.current.get(corridor.id);
      if (!curve) return;
      const isOverload = corridor.id === 'corridor-ring-road' || corridor.id === 'corridor-heritage-spine';
      const utilColor = isOverload ? 0xe63946 : corridor.id === 'corridor-radial-south' ? 0xe8b923 : 0x2a9d8f;
      const utilTube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, 0.45, 6, false),
        new THREE.MeshBasicMaterial({ color: utilColor, transparent: true, opacity: 0.75 })
      );
      utilizationGroup.add(utilTube);
    });

    // 5. Disruption Incident Hotspot Beacons
    const disruptions = [
      { pos: [-10, 0.05, 16], name: 'Ring Road Moti Bagh Flood Hazard' },
      { pos: [-2, 0.05, -15], name: 'Yellow Line Signaling Interlock' },
      { pos: [12, 0.05, -2], name: 'ITO Vikas Marg Cross-River Block' },
    ];
    disruptions.forEach((d) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(2.2, 3.8, 24),
        new THREE.MeshBasicMaterial({ color: 0xff1744, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(d.pos[0], d.pos[1], d.pos[2]);
      disruptionGroup.add(ring);

      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 4.0, 8),
        new THREE.MeshBasicMaterial({ color: 0xff1744 })
      );
      pin.position.set(d.pos[0], 2.0, d.pos[2]);
      disruptionGroup.add(pin);
    });

    // 6. Yamuna Flood Plain & Waterlogging Risk
    const riverPoints = [
      new THREE.Vector3(-8, 0.02, -55),
      new THREE.Vector3(4, 0.02, -35),
      new THREE.Vector3(14, 0.02, -15),
      new THREE.Vector3(20, 0.02, 5),
      new THREE.Vector3(26, 0.02, 28),
      new THREE.Vector3(32, 0.02, 55),
    ];
    const riverCurve = new THREE.CatmullRomCurve3(riverPoints);
    const riverTube = new THREE.Mesh(
      new THREE.TubeGeometry(riverCurve, 40, 2.2, 6, false),
      new THREE.MeshBasicMaterial({ color: 0x4a7c8a, transparent: true, opacity: 0.85 })
    );
    floodRiskGroup.add(riverTube);

    const floodBuffer = new THREE.Mesh(
      new THREE.TubeGeometry(riverCurve, 40, 6.0, 6, false),
      new THREE.MeshBasicMaterial({ color: 0x8fa89b, transparent: true, opacity: 0.35 })
    );
    floodRiskGroup.add(floodBuffer);

    const waterloggedUnderpasses = [
      { pos: [1, 0.05, -5], name: 'Minto Bridge Underpass' },
      { pos: [16, 0.05, 34], name: 'Pul Prahladpur Underpass' },
      { pos: [-16, 0.05, -14], name: 'Zakhira Underpass' },
    ];
    waterloggedUnderpasses.forEach((u) => {
      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 2.8, 8),
        new THREE.MeshBasicMaterial({ color: 0x00bcd4 })
      );
      pin.position.set(u.pos[0], 1.4, u.pos[1]);
      floodRiskGroup.add(pin);
    });

    // 7. Demographics Density Overlays
    DELHI_MOBILITY_ZONES.forEach((z) => {
      const x = (z.centerCoordinates[1] - 77.2197) * 160;
      const zPos = -(z.centerCoordinates[0] - 28.6328) * 160;
      const isUltraDense = z.residentPopulationThousands > 2500;
      const color = isUltraDense ? 0xb84c32 : z.residentPopulationThousands > 1500 ? 0xc89b53 : 0xd9cebe;
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(5.5, 18),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
      );
      disc.rotation.x = -Math.PI / 2;
      disc.position.set(x, 0.02, zPos);
      demographicsGroup.add(disc);
    });

    // Initialize layer group visibilities
    metroGroup.visible = activeLayer === 'all' || activeLayer === 'metro';
    busesGroup.visible = activeLayer === 'all' || activeLayer === 'buses';
    interchangesGroup.visible = activeLayer === 'all' || activeLayer === 'interchanges';
    accessibilityGroup.visible = activeLayer === 'accessibility';
    demandGroup.visible = activeLayer === 'demand';
    flowGroup.visible = activeLayer === 'flow';
    utilizationGroup.visible = activeLayer === 'utilization';
    disruptionGroup.visible = activeLayer === 'disruption';
    floodRiskGroup.visible = activeLayer === 'flood_risk';
    demographicsGroup.visible = activeLayer === 'demographics';

    // 7. Architectural Buses (Dual-tone, properly proportioned)
    if (showBuses) {
      const busBodyMatDTC = new THREE.MeshStandardMaterial({
        color: 0xb84c32, // Terracotta DTC bus
        roughness: 0.35,
        metalness: 0.2,
      });
      const busBodyMatEV = new THREE.MeshStandardMaterial({
        color: 0x2a5c8a, // Electric Transit Blue
        roughness: 0.3,
        metalness: 0.3,
      });
      const busWindowMat = new THREE.MeshBasicMaterial({ color: 0x1f2326 });
      const headLampMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });
      const tailLampMat = new THREE.MeshBasicMaterial({ color: 0xe63946 });

      const busCountPerCorridor = isSimulatedVariant ? 6 : 4;
      DELHI_CORRIDORS.forEach((corridor) => {
        const curve = corridorCurvesRef.current.get(corridor.id);
        if (!curve) return;

        for (let b = 0; b < busCountPerCorridor; b++) {
          const busGroup = new THREE.Group();

          const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.75, 0.44, 1.6),
            isSimulatedVariant ? busBodyMatEV : busBodyMatDTC
          );
          body.castShadow = true;
          body.position.y = 0.24;
          busGroup.add(body);

          const windows = new THREE.Mesh(
            new THREE.BoxGeometry(0.78, 0.16, 1.1),
            busWindowMat
          );
          windows.position.y = 0.3;
          busGroup.add(windows);

          const headLamps = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.08, 0.05),
            headLampMat
          );
          headLamps.position.set(0, 0.2, 0.82);
          busGroup.add(headLamps);

          const tailLamps = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.08, 0.05),
            tailLampMat
          );
          tailLamps.position.set(0, 0.2, -0.82);
          busGroup.add(tailLamps);

          // Epistemological Provenance Beacon (Cyan = Observed, Terracotta = Calibrated)
          const isObservedBeacon = b % 2 === 0;
          const beaconMat = new THREE.MeshBasicMaterial({
            color: isObservedBeacon ? 0x00d2ff : 0xb84c32,
          });
          const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), beaconMat);
          beacon.position.set(0, 0.48, 0);
          busGroup.add(beacon);

          scene.add(busGroup);

          busEntitiesRef.current.push({
            group: busGroup,
            corridor,
            progress: b / busCountPerCorridor + Math.random() * 0.1,
            speed:
              0.00045 + (Math.random() * 0.0002) * (isSimulatedVariant ? 1.25 : 1.0),
          });
        }
      });
    }

    // 8. Architectural Lighting Setup
    const sunLight = new THREE.DirectionalLight(0xfff6ee, 1.65);
    sunLight.position.set(45, 60, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -55;
    sunLight.shadow.camera.right = 55;
    sunLight.shadow.camera.top = 55;
    sunLight.shadow.camera.bottom = -55;
    sunLight.shadow.bias = -0.00035;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const ambientLight = new THREE.AmbientLight(0xf2ede4, 0.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight(0xfdfbf6, 0xdfd4c5, 0.55);
    scene.add(hemiLight);

    // 9. Interaction Handlers
    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mousePos.current = { x, y };

      if (isDragging.current && interactive) {
        const dx = e.clientX - previousMouse.current.x;
        const dy = e.clientY - previousMouse.current.y;
        previousMouse.current = { x: e.clientX, y: e.clientY };

        orbitAngle.current.theta -= dx * 0.0055;
        orbitAngle.current.phi = Math.max(
          0.25,
          Math.min(Math.PI / 2 - 0.1, orbitAngle.current.phi - dy * 0.0055)
        );

        const radius = Math.hypot(
          targetCamPos.current.x - targetLookAt.current.x,
          targetCamPos.current.z - targetLookAt.current.z
        );
        targetCamPos.current.x =
          targetLookAt.current.x + Math.sin(orbitAngle.current.theta) * radius;
        targetCamPos.current.z =
          targetLookAt.current.z + Math.cos(orbitAngle.current.theta) * radius;
        targetCamPos.current.y =
          targetLookAt.current.y + Math.sin(orbitAngle.current.phi) * 48;
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!interactive) return;
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.035;
      const dir = targetCamPos.current.clone().sub(targetLookAt.current).normalize();
      const currentDist = targetCamPos.current.distanceTo(targetLookAt.current);
      const newDist = Math.max(12, Math.min(110, currentDist + zoomFactor));
      targetCamPos.current.copy(targetLookAt.current).add(dir.multiplyScalar(newDist));
    };

    const handleClick = (e: MouseEvent) => {
      if (!interactive || !camera || isDragging.current) return;
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const stopTargets: THREE.Object3D[] = [];
      stopMarkersRef.current.forEach((group) => {
        group.children.forEach((c) => {
          if (c.userData.type === 'stop') stopTargets.push(c);
        });
      });

      const intersects = raycaster.intersectObjects(stopTargets);
      if (intersects.length > 0) {
        const stop = intersects[0].object.userData.stop as BusStop;
        if (onSelectStop) onSelectStop(stop);
      }
    };

    window.addEventListener('resize', onResize);
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('click', handleClick);

    // 10. Animation Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Smooth damped camera interpolation
      currentCamPos.current.lerp(targetCamPos.current, 0.045);
      currentLookAt.current.lerp(targetLookAt.current, 0.045);
      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);

      // Animate Buses along corridors
      busEntitiesRef.current.forEach((bus) => {
        const curve = corridorCurvesRef.current.get(bus.corridor.id);
        if (!curve) return;

        bus.progress = (bus.progress + bus.speed) % 1.0;
        const pos = curve.getPointAt(bus.progress);
        const tangent = curve.getTangentAt(bus.progress);

        bus.group.position.set(pos.x, 0.08, pos.z);
        bus.group.lookAt(pos.x + tangent.x, 0.08, pos.z + tangent.z);
      });

      // Animate Pulse Particles
      pulseParticlesRef.current.forEach((pulse) => {
        const curve = corridorCurvesRef.current.get(pulse.corridorId);
        if (!curve) return;

        pulse.progress = (pulse.progress + pulse.speed) % 1.0;
        const pos = curve.getPointAt(pulse.progress);
        pulse.mesh.position.set(pos.x, 0.38, pos.z);
      });

      // Animate Stop Markers
      stopMarkersRef.current.forEach((group, stopId) => {
        const halo = group.children[1];
        if (halo) {
          const isSelected = activeStopId === stopId;
          halo.scale.setScalar(1 + Math.sin(time * 0.003) * (isSelected ? 0.35 : 0.15));
        }
      });

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Synchronous immediate first frame render
    try {
      renderer.render(scene, camera);
    } catch {
      // Continue to animation loop
    }
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('click', handleClick);

      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, [
    preset,
    activeCorridorId,
    activeStopId,
    showBuses,
    splitMode,
    isSimulatedVariant,
    interactive,
    onSelectStop,
  ]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {webglSupported ? (
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        /* WebGL Architectural Blueprint Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center bg-parchment p-4 sm:p-8 text-ink">
          <div className="max-w-md w-full border border-divider p-4 sm:p-6 bg-ivory shadow-sm">
            <span className="font-mono text-[11px] tracking-widest text-terracotta uppercase">
              Cartographic Projection / 2D Vector Fallback
            </span>
            <h3 className="font-serif text-2xl mt-2 mb-3">Delhi Metropolitan Spatial Model</h3>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              Hardware WebGL acceleration unavailable. Rendering vector transit topology for Central, South, and Ring Road corridors.
            </p>
            <div className="aspect-[4/3] bg-parchment/40 relative flex items-center justify-center mt-3">
              <svg className="w-full h-full p-4" viewBox="0 0 400 300">
                <circle cx="200" cy="150" r="110" fill="none" stroke="#A69A89" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="200" cy="150" r="60" fill="none" stroke="#24211D" strokeWidth="2" />
                <line x1="200" y1="20" x2="200" y2="280" stroke="#B84C32" strokeWidth="2.5" />
                <line x1="40" y1="150" x2="360" y2="150" stroke="#C89B53" strokeWidth="2" />
                <circle cx="200" cy="150" r="6" fill="#B84C32" />
                <text x="210" y="154" className="font-mono text-[10px] fill-ink">CP-01</text>
                <circle cx="200" cy="230" r="5" fill="#B84C32" />
                <text x="210" y="234" className="font-mono text-[10px] fill-ink">AIIMS-04</text>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
