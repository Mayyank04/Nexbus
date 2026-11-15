'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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

  // Interaction & camera targets
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(42, 48, 56));
  const currentCamPos = useRef<THREE.Vector3>(new THREE.Vector3(42, 48, 56));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const previousMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitAngle = useRef<{ theta: number; phi: number }>({ theta: 0.8, phi: 0.7 });

  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Dynamic mesh references for updates
  const busMeshesRef = useRef<{ mesh: THREE.Mesh; corridor: TransitCorridor; progress: number; speed: number }[]>([]);
  const corridorCurvesRef = useRef<Map<string, THREE.CatmullRomCurve3>>(new Map());
  const stopMarkersRef = useRef<Map<string, THREE.Group>>(new Map());
  const pulseLinesRef = useRef<{ line: THREE.Line; corridorId: string; offset: number }[]>([]);

  // Update camera presets
  useEffect(() => {
    if (preset === 'overview') {
      targetCamPos.current.set(38, 44, 52);
      targetLookAt.current.set(0, 0, 0);
    } else if (preset === 'corridor') {
      targetCamPos.current.set(16, 22, 28);
      targetLookAt.current.set(6, 0, 14);
    } else if (preset === 'street') {
      targetCamPos.current.set(10, 10, 14);
      targetLookAt.current.set(0, 1, 0);
    } else if (preset === 'journey') {
      targetCamPos.current.set(18, 26, 32);
      targetLookAt.current.set(8, 0, 8);
    } else if (preset === 'simulation') {
      targetCamPos.current.set(30, 36, 42);
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
        targetCamPos.current.set(midPoint[0] + 18, 22, midPoint[2] + 24);
      }
    }
  }, [activeCorridorId]);

  useEffect(() => {
    if (activeStopId) {
      const stop = DELHI_STOPS.find((s) => s.id === activeStopId);
      if (stop) {
        targetLookAt.current.set(stop.coordinates[0], 0.5, stop.coordinates[1]);
        targetCamPos.current.set(stop.coordinates[0] + 12, 14, stop.coordinates[1] + 14);
      }
    }
  }, [activeStopId]);

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

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const bgFogColor = splitMode ? (isSimulatedVariant ? 0xf0ece2 : 0xede6da) : 0xf5f0e6;
    scene.background = new THREE.Color(bgFogColor);
    scene.fog = new THREE.FogExp2(bgFogColor, 0.009);

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.5, 300);
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

    // 2. Architectural Materials
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xede7dc,
      roughness: 0.95,
      metalness: 0.05,
    });

    const tarmacMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3632,
      roughness: 0.9,
      metalness: 0.1,
    });

    const buildingMatWhite = new THREE.MeshStandardMaterial({
      color: 0xf3efe8,
      roughness: 0.75,
      metalness: 0.08,
    });

    const buildingMatStone = new THREE.MeshStandardMaterial({
      color: 0xd9cebe,
      roughness: 0.8,
      metalness: 0.12,
    });

    const buildingMatTerracotta = new THREE.MeshStandardMaterial({
      color: 0xb84c32,
      roughness: 0.65,
      metalness: 0.15,
    });

    const parkGreenMaterial = new THREE.MeshStandardMaterial({
      color: 0xc4cbb5,
      roughness: 0.95,
      metalness: 0.0,
    });

    // 3. Ground & Topography
    const groundGeo = new THREE.PlaneGeometry(160, 160, 1, 1);
    const ground = new THREE.Mesh(groundGeo, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // Subtle Grid/Cartography lines
    const gridHelper = new THREE.GridHelper(140, 35, 0xdfd7cb, 0xe8e2d8);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 4. Procedural Delhi Architecture Model (Connaught Place + Arterials)
    const buildingMeshes: THREE.InstancedMesh[] = [];

    // Connaught Place Inner & Outer Circles
    const cpCenter = new THREE.Vector3(0, 0, 0);
    const parkCenter = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.1, 32), parkGreenMaterial);
    parkCenter.position.set(0, 0.05, 0);
    scene.add(parkCenter);

    // Inner Circle Colonnade Blocks
    const innerBlocks = 12;
    const innerRadius = 7.5;
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const innerInstanced = new THREE.InstancedMesh(boxGeo, buildingMatWhite, innerBlocks);
    innerInstanced.castShadow = true;
    innerInstanced.receiveShadow = true;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < innerBlocks; i++) {
      const angle = (i / innerBlocks) * Math.PI * 2;
      const x = Math.cos(angle) * innerRadius;
      const z = Math.sin(angle) * innerRadius;
      const height = 1.8 + (i % 3) * 0.4;
      dummy.position.set(x, height / 2, z);
      dummy.rotation.y = -angle + Math.PI / 2;
      dummy.scale.set(2.4, height, 1.6);
      dummy.updateMatrix();
      innerInstanced.setMatrixAt(i, dummy.matrix);
    }
    scene.add(innerInstanced);

    // Middle Circle Road & Outer Blocks
    const outerBlocks = 18;
    const outerRadius = 13.5;
    const outerInstanced = new THREE.InstancedMesh(boxGeo, buildingMatStone, outerBlocks);
    outerInstanced.castShadow = true;
    outerInstanced.receiveShadow = true;

    for (let i = 0; i < outerBlocks; i++) {
      const angle = (i / outerBlocks) * Math.PI * 2;
      const x = Math.cos(angle) * outerRadius;
      const z = Math.sin(angle) * outerRadius;
      const height = 2.4 + (i % 4) * 0.8;
      dummy.position.set(x, height / 2, z);
      dummy.rotation.y = -angle + Math.PI / 2;
      dummy.scale.set(3.2, height, 2.2);
      dummy.updateMatrix();
      outerInstanced.setMatrixAt(i, dummy.matrix);
    }
    scene.add(outerInstanced);

    // Urban Grid Blocks (Commercial & Institutional Delhi: Barakhamba, ITO, AIIMS, Nehru Place)
    const cityBlocksCount = 120;
    const cityInstanced = new THREE.InstancedMesh(boxGeo, buildingMatWhite, cityBlocksCount);
    cityInstanced.castShadow = true;
    cityInstanced.receiveShadow = true;

    const stoneInstanced = new THREE.InstancedMesh(boxGeo, buildingMatStone, 60);
    stoneInstanced.castShadow = true;
    stoneInstanced.receiveShadow = true;

    let cIdx = 0;
    let sIdx = 0;

    for (let x = -48; x <= 48; x += 9.5) {
      for (let z = -48; z <= 48; z += 9.5) {
        // Skip Connaught Place center
        const distToCenter = Math.hypot(x, z);
        if (distToCenter < 16) continue;

        // Skip major arterial corridors
        if (Math.abs(x) < 3.2 || Math.abs(z) < 3.2) continue;

        const isTallDistrict = (x > 8 && z > 18) || (x < -14 && z < -14); // Nehru Place & North Delhi
        const baseHeight = isTallDistrict ? 5.5 : 2.2;
        const height = baseHeight + ((Math.abs(x * 7 + z * 13) % 10) / 10) * (isTallDistrict ? 6.5 : 2.8);

        dummy.position.set(x + (Math.sin(z) * 0.8), height / 2, z + (Math.cos(x) * 0.8));
        dummy.rotation.y = (x * z) % 0.4;
        dummy.scale.set(4.8 + (x % 2), height, 5.2 + (z % 2));
        dummy.updateMatrix();

        if (cIdx < cityBlocksCount && (x + z) % 3 !== 0) {
          cityInstanced.setMatrixAt(cIdx++, dummy.matrix);
        } else if (sIdx < 60) {
          stoneInstanced.setMatrixAt(sIdx++, dummy.matrix);
        }
      }
    }
    scene.add(cityInstanced);
    scene.add(stoneInstanced);

    // 5. Roads & Arterial Corridors
    // Main Ring Road and Radial Avenues
    const roadWidth = 2.2;
    DELHI_CORRIDORS.forEach((corridor) => {
      const points = corridor.path.map((p) => new THREE.Vector3(p[0], 0.08, p[2]));
      const curve = new THREE.CatmullRomCurve3(points, corridor.type === 'ring');
      corridorCurvesRef.current.set(corridor.id, curve);

      // Road ribbon
      const roadGeo = new THREE.TubeGeometry(curve, 96, 0.7, 4, false);
      const roadMat = new THREE.MeshStandardMaterial({
        color: 0x3a3632,
        roughness: 0.85,
      });
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      scene.add(roadMesh);

      // Glowing Transit Conduit
      const transitGeo = new THREE.TubeGeometry(curve, 96, 0.16, 6, false);
      const transitColor = new THREE.Color(corridor.color);
      const transitMat = new THREE.MeshBasicMaterial({
        color: transitColor,
        transparent: true,
        opacity: activeCorridorId === corridor.id ? 0.95 : 0.65,
      });
      const transitMesh = new THREE.Mesh(transitGeo, transitMat);
      scene.add(transitMesh);
    });

    // 6. Interactive Bus Stop Markers
    DELHI_STOPS.forEach((stop) => {
      const stopGroup = new THREE.Group();
      stopGroup.position.set(stop.coordinates[0], 0, stop.coordinates[1]);

      // Base marker cylinder
      const pinMat = new THREE.MeshBasicMaterial({
        color: stop.crowdingLevel === 'critical' ? 0xb84c32 : 0xc89b53,
      });
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.8, 12), pinMat);
      pin.position.y = 0.9;
      stopGroup.add(pin);

      // Floating halo
      const haloGeo = new THREE.RingGeometry(0.65, 0.9, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: stop.crowdingLevel === 'critical' ? 0xb84c32 : 0xc89b53,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = -Math.PI / 2;
      halo.position.y = 1.9;
      stopGroup.add(halo);

      // Invisible pick target for smooth clicking
      const pickGeo = new THREE.SphereGeometry(2.2, 8, 8);
      const pickMat = new THREE.MeshBasicMaterial({ visible: false });
      const pickMesh = new THREE.Mesh(pickGeo, pickMat);
      pickMesh.position.y = 1.0;
      pickMesh.userData = { type: 'stop', stop };
      stopGroup.add(pickMesh);

      scene.add(stopGroup);
      stopMarkersRef.current.set(stop.id, stopGroup);
    });

    // 7. Dynamic Buses on Corridors
    if (showBuses) {
      const busGeo = new THREE.BoxGeometry(0.9, 0.45, 1.8);
      const busMat = new THREE.MeshStandardMaterial({
        color: 0xb84c32, // Terracotta DTC bus
        roughness: 0.4,
        metalness: 0.3,
      });
      const busMatSimulated = new THREE.MeshStandardMaterial({
        color: 0x2a5c8a, // Electric Transit Blue for proposed fleet
        roughness: 0.35,
        metalness: 0.4,
      });

      const busCountPerCorridor = isSimulatedVariant ? 6 : 4;
      DELHI_CORRIDORS.forEach((corridor) => {
        const curve = corridorCurvesRef.current.get(corridor.id);
        if (!curve) return;

        for (let b = 0; b < busCountPerCorridor; b++) {
          const mesh = new THREE.Mesh(busGeo, isSimulatedVariant ? busMatSimulated : busMat);
          mesh.castShadow = true;
          scene.add(mesh);

          busMeshesRef.current.push({
            mesh,
            corridor,
            progress: (b / busCountPerCorridor) + Math.random() * 0.1,
            speed: 0.00045 + (Math.random() * 0.0002) * (isSimulatedVariant ? 1.25 : 1.0),
          });
        }
      });
    }

    // 8. Architectural Lighting Setup
    // Sun / Key light
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
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Sky Ambient Light
    const ambientLight = new THREE.AmbientLight(0xf2ede4, 0.75);
    scene.add(ambientLight);

    // Soft Hemisphere Light (Sky Warmth vs Ground Ochre)
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

        orbitAngle.current.theta -= dx * 0.006;
        orbitAngle.current.phi = Math.max(0.25, Math.min(Math.PI / 2 - 0.1, orbitAngle.current.phi - dy * 0.006));

        const radius = Math.hypot(targetCamPos.current.x - targetLookAt.current.x, targetCamPos.current.z - targetLookAt.current.z);
        targetCamPos.current.x = targetLookAt.current.x + Math.sin(orbitAngle.current.theta) * radius;
        targetCamPos.current.z = targetLookAt.current.z + Math.cos(orbitAngle.current.theta) * radius;
        targetCamPos.current.y = targetLookAt.current.y + Math.sin(orbitAngle.current.phi) * 45;
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!interactive) return;
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.04;
      const dir = targetCamPos.current.clone().sub(targetLookAt.current).normalize();
      const currentDist = targetCamPos.current.distanceTo(targetLookAt.current);
      const newDist = Math.max(12, Math.min(95, currentDist + zoomFactor));
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

      // Check for stop intersections
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

      // Smooth camera interpolation
      currentCamPos.current.lerp(targetCamPos.current, 0.045);
      currentLookAt.current.lerp(targetLookAt.current, 0.045);
      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookAt.current);

      // Animate Buses along corridors
      busMeshesRef.current.forEach((bus) => {
        const curve = corridorCurvesRef.current.get(bus.corridor.id);
        if (!curve) return;

        bus.progress = (bus.progress + bus.speed) % 1.0;
        const pos = curve.getPointAt(bus.progress);
        const tangent = curve.getTangentAt(bus.progress);

        bus.mesh.position.set(pos.x, 0.32, pos.z);
        bus.mesh.lookAt(pos.x + tangent.x, 0.32, pos.z + tangent.z);
      });

      // Animate Stop Markers (gentle floating & pulse)
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
  }, [preset, activeCorridorId, activeStopId, showBuses, splitMode, isSimulatedVariant, interactive, onSelectStop]);

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
