'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DELHI_STOPS, DELHI_CORRIDORS, BusStop, TransitCorridor } from '@/data/delhiTransitData';

export type CameraPreset = 'overview' | 'corridor' | 'street' | 'simulation' | 'journey';

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
  splitMode?: boolean; // for simulation
  isSimulatedVariant?: boolean;
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
}: DelhiCityCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Camera targets & smooth damping
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(38, 44, 52));
  const currentCamPos = useRef<THREE.Vector3>(new THREE.Vector3(38, 44, 52));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const previousMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitAngle = useRef<{ theta: number; phi: number }>({ theta: 0.8, phi: 0.68 });

  const [hoveredStop, setHoveredStop] = useState<BusStop | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Dynamic mesh & entity references
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

  // Lighting references for dynamic day/evening cycles
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Update camera presets
  useEffect(() => {
    if (preset === 'overview') {
      targetCamPos.current.set(38, 44, 52);
      targetLookAt.current.set(0, 0, 0);
    } else if (preset === 'corridor') {
      targetCamPos.current.set(16, 22, 28);
      targetLookAt.current.set(6, 0, 14);
    } else if (preset === 'street') {
      targetCamPos.current.set(12, 11, 16);
      targetLookAt.current.set(0, 1.2, 0);
    } else if (preset === 'journey') {
      targetCamPos.current.set(20, 26, 32);
      targetLookAt.current.set(6, 0, 12);
    } else if (preset === 'simulation') {
      targetCamPos.current.set(32, 38, 44);
      targetLookAt.current.set(2, 0, 4);
    }
  }, [preset]);

  // Adjust camera to focus on selected corridor or stop
  useEffect(() => {
    if (activeCorridorId) {
      const corridor = DELHI_CORRIDORS.find((c) => c.id === activeCorridorId);
      if (corridor && corridor.path.length > 0) {
        const midPoint = corridor.path[Math.floor(corridor.path.length / 2)];
        targetLookAt.current.set(midPoint[0], 0, midPoint[2]);
        targetCamPos.current.set(midPoint[0] + 16, 20, midPoint[2] + 22);
      }
    }
  }, [activeCorridorId]);

  useEffect(() => {
    if (activeStopId) {
      const stop = DELHI_STOPS.find((s) => s.id === activeStopId);
      if (stop) {
        targetLookAt.current.set(stop.coordinates[0], 0.5, stop.coordinates[1]);
        targetCamPos.current.set(stop.coordinates[0] + 10, 12, stop.coordinates[1] + 12);
      }
    }
  }, [activeStopId]);

  // Update lighting based on timeHour
  useEffect(() => {
    if (!sunLightRef.current || !ambientLightRef.current || !sceneRef.current) return;
    const isMorningPeak = timeHour >= 8 && timeHour <= 10;
    const isEveningPeak = timeHour >= 17 && timeHour <= 19;
    const isNight = timeHour >= 20 || timeHour <= 6;

    if (isMorningPeak) {
      sunLightRef.current.position.set(45, 50, 40);
      sunLightRef.current.intensity = 1.55;
      sunLightRef.current.color.setHex(0xfff6e8);
      ambientLightRef.current.intensity = 0.75;
    } else if (isEveningPeak) {
      // Golden Hour over Delhi
      sunLightRef.current.position.set(-35, 30, 50);
      sunLightRef.current.intensity = 1.35;
      sunLightRef.current.color.setHex(0xffe1bd);
      ambientLightRef.current.intensity = 0.65;
    } else if (isNight) {
      sunLightRef.current.position.set(20, 40, 20);
      sunLightRef.current.intensity = 0.45;
      sunLightRef.current.color.setHex(0xd0d8e8);
      ambientLightRef.current.intensity = 0.45;
    } else {
      // Midday direct light
      sunLightRef.current.position.set(25, 65, 25);
      sunLightRef.current.intensity = 1.65;
      sunLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 0.8;
    }
  }, [timeHour]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
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
    scene.fog = new THREE.FogExp2(bgFogColor, 0.0085);

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.5, 350);
    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentLookAt.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Refined Architectural Materials
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xede7dc,
      roughness: 0.95,
      metalness: 0.04,
    });

    const tarmacMaterial = new THREE.MeshStandardMaterial({
      color: 0x36322e,
      roughness: 0.9,
      metalness: 0.1,
    });

    const brtLaneMaterial = new THREE.MeshStandardMaterial({
      color: 0xa44530,
      roughness: 0.75,
      metalness: 0.08,
    });

    const buildingMatWhite = new THREE.MeshStandardMaterial({
      color: 0xf4f0e8,
      roughness: 0.78,
      metalness: 0.08,
    });

    const buildingMatStone = new THREE.MeshStandardMaterial({
      color: 0xd6caba,
      roughness: 0.82,
      metalness: 0.12,
    });

    const buildingMatSandstone = new THREE.MeshStandardMaterial({
      color: 0xba6850, // Red Dholpur sandstone (Historic Old Delhi & Central Vista)
      roughness: 0.85,
      metalness: 0.05,
    });

    const parkGreenMaterial = new THREE.MeshStandardMaterial({
      color: 0xc1c9b2,
      roughness: 0.96,
      metalness: 0.0,
    });

    const treeFoliageMaterial = new THREE.MeshStandardMaterial({
      color: 0xa8b698,
      roughness: 0.92,
      metalness: 0.0,
    });

    const treeTrunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x7a6e60,
      roughness: 0.9,
    });

    // 3. Ground Plane & Cartographic Grid
    const groundGeo = new THREE.PlaneGeometry(180, 180, 1, 1);
    const ground = new THREE.Mesh(groundGeo, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(150, 30, 0xdfd7cb, 0xe8e2d8);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 4. Urban Geometry: Connaught Place Radial Architecture
    const parkCenter = new THREE.Mesh(
      new THREE.CylinderGeometry(4.4, 4.4, 0.12, 32),
      parkGreenMaterial
    );
    parkCenter.position.set(0, 0.06, 0);
    parkCenter.receiveShadow = true;
    scene.add(parkCenter);

    // Central Flagpole & Water Pool Monument in Central Park
    const poolMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 0.14, 24),
      new THREE.MeshStandardMaterial({ color: 0x98b2c2, roughness: 0.3 })
    );
    poolMesh.position.set(0, 0.07, 0);
    scene.add(poolMesh);

    const flagPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 4.2, 8),
      new THREE.MeshStandardMaterial({ color: 0xc89b53, metalness: 0.6, roughness: 0.3 })
    );
    flagPole.position.set(0, 2.1, 0);
    scene.add(flagPole);

    // Inner Circle Colonnade Blocks (12 Georgian radial blocks)
    const innerBlocks = 12;
    const innerRadius = 7.6;
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const innerInstanced = new THREE.InstancedMesh(boxGeo, buildingMatWhite, innerBlocks);
    innerInstanced.castShadow = true;
    innerInstanced.receiveShadow = true;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < innerBlocks; i++) {
      const angle = (i / innerBlocks) * Math.PI * 2;
      const x = Math.cos(angle) * innerRadius;
      const z = Math.sin(angle) * innerRadius;
      const height = 2.0 + (i % 2) * 0.4;
      dummy.position.set(x, height / 2, z);
      dummy.rotation.y = -angle + Math.PI / 2;
      dummy.scale.set(2.6, height, 1.8);
      dummy.updateMatrix();
      innerInstanced.setMatrixAt(i, dummy.matrix);
    }
    scene.add(innerInstanced);

    // Middle Circle & Outer Radial Colonnade Blocks
    const outerBlocks = 18;
    const outerRadius = 13.8;
    const outerInstanced = new THREE.InstancedMesh(boxGeo, buildingMatStone, outerBlocks);
    outerInstanced.castShadow = true;
    outerInstanced.receiveShadow = true;

    for (let i = 0; i < outerBlocks; i++) {
      const angle = (i / outerBlocks) * Math.PI * 2;
      const x = Math.cos(angle) * outerRadius;
      const z = Math.sin(angle) * outerRadius;
      const height = 2.8 + (i % 3) * 0.7;
      dummy.position.set(x, height / 2, z);
      dummy.rotation.y = -angle + Math.PI / 2;
      dummy.scale.set(3.4, height, 2.4);
      dummy.updateMatrix();
      outerInstanced.setMatrixAt(i, dummy.matrix);
    }
    scene.add(outerInstanced);

    // Commercial & Institutional Delhi Blocks (Barakhamba high-rises, Nehru Place, AIIMS)
    const cityBlocksCount = 140;
    const cityInstanced = new THREE.InstancedMesh(boxGeo, buildingMatWhite, cityBlocksCount);
    cityInstanced.castShadow = true;
    cityInstanced.receiveShadow = true;

    const stoneInstanced = new THREE.InstancedMesh(boxGeo, buildingMatStone, 70);
    stoneInstanced.castShadow = true;
    stoneInstanced.receiveShadow = true;

    let cIdx = 0;
    let sIdx = 0;

    for (let x = -52; x <= 52; x += 9.6) {
      for (let z = -52; z <= 52; z += 9.6) {
        const distToCenter = Math.hypot(x, z);
        if (distToCenter < 16.5) continue; // preserve Connaught Place core
        if (Math.abs(x) < 3.2 || Math.abs(z) < 3.2) continue; // preserve radial avenues

        const isNehruPlace = x > 14 && z > 20;
        const isBarakhamba = x > 8 && x < 28 && z > -12 && z < 14;
        const isHighDensity = isNehruPlace || isBarakhamba;

        const baseHeight = isHighDensity ? 6.2 : 2.4;
        const height =
          baseHeight +
          ((Math.abs(x * 7 + z * 13) % 10) / 10) * (isHighDensity ? 7.5 : 3.2);

        dummy.position.set(x + Math.sin(z) * 0.7, height / 2, z + Math.cos(x) * 0.7);
        dummy.rotation.y = (x * z) % 0.35;
        dummy.scale.set(5.2 + (x % 2) * 0.4, height, 5.4 + (z % 2) * 0.4);
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

    // India Gate / Central Vista Monument Silhouette (South Axis at [3, 0, 16])
    const indiaGateGroup = new THREE.Group();
    indiaGateGroup.position.set(3, 0, 16);

    const archLeftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 4.2, 1.4), buildingMatSandstone);
    archLeftPillar.position.set(-1.1, 2.1, 0);
    archLeftPillar.castShadow = true;
    indiaGateGroup.add(archLeftPillar);

    const archRightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 4.2, 1.4), buildingMatSandstone);
    archRightPillar.position.set(1.1, 2.1, 0);
    archRightPillar.castShadow = true;
    indiaGateGroup.add(archRightPillar);

    const archLintel = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 1.6), buildingMatSandstone);
    archLintel.position.set(0, 4.4, 0);
    archLintel.castShadow = true;
    indiaGateGroup.add(archLintel);

    scene.add(indiaGateGroup);

    // Architectural Trees along Janpath / Rajpath Axis
    const treeCount = 36;
    const treeInstanced = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.5, 0.7, 1.4, 6),
      treeFoliageMaterial,
      treeCount
    );
    treeInstanced.castShadow = true;

    for (let t = 0; t < treeCount; t++) {
      const tx = (t % 2 === 0 ? -1 : 1) * (2.8 + (t % 4) * 0.4);
      const tz = -18 + t * 1.5;
      dummy.position.set(tx, 0.7, tz);
      dummy.rotation.y = t * 0.5;
      dummy.scale.set(0.9, 1.1, 0.9);
      dummy.updateMatrix();
      treeInstanced.setMatrixAt(t, dummy.matrix);
    }
    scene.add(treeInstanced);

    // 5. Roads, Arterial Corridors & Flow Conduits
    DELHI_CORRIDORS.forEach((corridor) => {
      const points = corridor.path.map((p) => new THREE.Vector3(p[0], 0.08, p[2]));
      const curve = new THREE.CatmullRomCurve3(points, corridor.type === 'ring');
      corridorCurvesRef.current.set(corridor.id, curve);

      // Wide Asphalt Road
      const roadGeo = new THREE.TubeGeometry(curve, 110, 0.85, 4, false);
      const roadMesh = new THREE.Mesh(roadGeo, tarmacMaterial);
      roadMesh.receiveShadow = true;
      scene.add(roadMesh);

      // Dedicated Terracotta BRT Marking Strip
      const brtGeo = new THREE.TubeGeometry(curve, 110, 0.35, 4, false);
      const brtMesh = new THREE.Mesh(brtGeo, brtLaneMaterial);
      brtMesh.position.y = 0.02;
      scene.add(brtMesh);

      // Glowing Active Transit Conduit
      const isSelected = activeCorridorId === corridor.id;
      const transitGeo = new THREE.TubeGeometry(curve, 110, isSelected ? 0.22 : 0.14, 6, false);
      const transitColor = new THREE.Color(corridor.color);
      const transitMat = new THREE.MeshBasicMaterial({
        color: transitColor,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.65,
      });
      const transitMesh = new THREE.Mesh(transitGeo, transitMat);
      scene.add(transitMesh);

      // Flow Pulse Beads
      const pulseGeo = new THREE.SphereGeometry(0.32, 8, 8);
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
          speed: 0.00075 + Math.random() * 0.0003,
        });
      }
    });

    // 6. Interactive Bus Stop Markers with Halos & Pick Targets
    DELHI_STOPS.forEach((stop) => {
      const stopGroup = new THREE.Group();
      stopGroup.position.set(stop.coordinates[0], 0, stop.coordinates[1]);

      // Base marker totem
      const pinColor = stop.crowdingLevel === 'critical' ? 0xb84c32 : 0xc89b53;
      const pinMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.0, 12), pinMat);
      pin.position.y = 1.0;
      stopGroup.add(pin);

      // Animated Floating Halo
      const haloGeo = new THREE.RingGeometry(0.7, 0.95, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = -Math.PI / 2;
      halo.position.y = 2.1;
      stopGroup.add(halo);

      // Invisible pick target for raycasting
      const pickGeo = new THREE.SphereGeometry(2.4, 8, 8);
      const pickMat = new THREE.MeshBasicMaterial({ visible: false });
      const pickMesh = new THREE.Mesh(pickGeo, pickMat);
      pickMesh.position.y = 1.0;
      pickMesh.userData = { type: 'stop', stop };
      stopGroup.add(pickMesh);

      scene.add(stopGroup);
      stopMarkersRef.current.set(stop.id, stopGroup);
    });

    // 7. Composite Architectural Buses
    if (showBuses) {
      const busBodyMatDTC = new THREE.MeshStandardMaterial({
        color: 0xb84c32, // Terracotta DTC bus
        roughness: 0.35,
        metalness: 0.25,
      });
      const busBodyMatEV = new THREE.MeshStandardMaterial({
        color: 0x2a5c8a, // Transit Blue for Electric buses
        roughness: 0.3,
        metalness: 0.35,
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

          // Main bus body
          const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.85, 0.5, 1.8),
            isSimulatedVariant ? busBodyMatEV : busBodyMatDTC
          );
          body.castShadow = true;
          body.position.y = 0.28;
          busGroup.add(body);

          // Dark tinted window strip
          const windows = new THREE.Mesh(
            new THREE.BoxGeometry(0.88, 0.2, 1.3),
            busWindowMat
          );
          windows.position.y = 0.35;
          busGroup.add(windows);

          // Warm headlights
          const headLamps = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.1, 0.05),
            headLampMat
          );
          headLamps.position.set(0, 0.24, 0.92);
          busGroup.add(headLamps);

          // Red taillights
          const tailLamps = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.1, 0.05),
            tailLampMat
          );
          tailLamps.position.set(0, 0.24, -0.92);
          busGroup.add(tailLamps);

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
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 1.6);
    sunLight.position.set(45, 60, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const ambientLight = new THREE.AmbientLight(0xf2ede4, 0.75);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight(0xfcf9f2, 0xdfd4c5, 0.55);
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
          targetLookAt.current.y + Math.sin(orbitAngle.current.phi) * 45;
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
      const newDist = Math.max(10, Math.min(95, currentDist + zoomFactor));
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

        bus.group.position.set(pos.x, 0.12, pos.z);
        bus.group.lookAt(pos.x + tangent.x, 0.12, pos.z + tangent.z);
      });

      // Animate Pulse Particles
      pulseParticlesRef.current.forEach((pulse) => {
        const curve = corridorCurvesRef.current.get(pulse.corridorId);
        if (!curve) return;

        pulse.progress = (pulse.progress + pulse.speed) % 1.0;
        const pos = curve.getPointAt(pulse.progress);
        pulse.mesh.position.set(pos.x, 0.42, pos.z);
      });

      // Animate Stop Markers (halo breathing)
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

    animationFrameId.current = requestAnimationFrame(animate);

    // Cleanup
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
        <div className="w-full h-full flex flex-col items-center justify-center bg-parchment p-8 text-ink">
          <div className="max-w-md border border-stone/40 p-6 bg-ivory shadow-sm">
            <span className="font-mono text-xs tracking-widest text-terracotta uppercase">
              Cartographic Projection / 2D Vector Fallback
            </span>
            <h3 className="font-serif text-2xl mt-2 mb-3">Delhi Metropolitan Spatial Model</h3>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              Hardware WebGL acceleration unavailable. Rendering vector transit topology for Central, South, and Ring Road corridors.
            </p>
            <div className="aspect-[4/3] bg-parchment/60 border border-stone/30 relative flex items-center justify-center">
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
