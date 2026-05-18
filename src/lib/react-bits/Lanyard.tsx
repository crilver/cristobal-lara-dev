/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

// Public-path constants — assets live in /public/assets/ and are served at /assets/.
const cardGLB = '/assets/card.glb';
const ropeFallback = '/assets/lanyard.png';

extend({ MeshLineGeometry, MeshLineMaterial });

// 1×1 dark-pixel texture (#0c0c0e) used as the card's fallback before the
// canvas texture is ready. Keeping a *texture* in `map` (never null) means
// the MeshPhysicalMaterial shader variant (USE_MAP) never changes, so
// swapping in the real card texture doesn't need a manual recompile —
// and the GLB's embedded React Bits placeholder is never shown.
const CARD_FALLBACK_TEX = (() => {
  const tex = new THREE.DataTexture(
    new Uint8Array([12, 12, 14, 255]),
    1,
    1,
    THREE.RGBAFormat
  );
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
})();

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  /** Override texture URL applied to the card's front-face material. */
  cardImage?: string;
  /** Override texture URL applied to the lanyard rope material. */
  ropeImage?: string;
  /** World-space Y of the fixed anchor; raise to make the cord descend from
   *  higher on screen. Default 4 (vanilla React Bits). */
  anchorY?: number;
  /** Scale of the card group (front face mesh). Default 2.25 (vanilla). */
  cardScale?: number;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  cardImage,
  ropeImage,
  anchorY = 5.5,
  cardScale = 5
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative z-0 w-full h-full flex justify-center items-start">
      <Canvas
        // Interactive: the card is draggable. This no longer eats the hero
        // CTA clicks because the whole lanyard layer sits BELOW the hero
        // text/CTA layer in z-order (LanyardOverlay z-10 vs the text column
        // z-20, which is pointer-events:none except its own content). Only
        // the empty right-side region over the card reaches this canvas.
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            cardImage={cardImage}
            ropeImage={ropeImage}
            anchorY={anchorY}
            cardScale={cardScale}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  cardImage?: string;
  ropeImage?: string;
  anchorY?: number;
  cardScale?: number;
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  cardImage,
  ropeImage,
  anchorY = 5.5,
  cardScale = 5
}: BandProps) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: any = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  // Always load the fallback rope texture so the hook order is stable.
  const fallbackRope = useTexture(ropeFallback);

  // ---- Texture override: card front face ----
  const [cardMap, setCardMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!cardImage) {
      setCardMap(null);
      return;
    }
    const loader = new THREE.TextureLoader();
    loader.load(
      cardImage,
      (tex) => {
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 16;
        setCardMap(tex);
      },
      undefined,
      // eslint-disable-next-line no-console
      (err) => console.warn('[Lanyard] card texture failed', err)
    );
  }, [cardImage]);

  // ---- Texture override: rope ----
  const [ropeMap, setRopeMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!ropeImage) {
      setRopeMap(null);
      return;
    }
    const loader = new THREE.TextureLoader();
    loader.load(
      ropeImage,
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 16;
        setRopeMap(tex);
      },
      undefined,
      // eslint-disable-next-line no-console
      (err) => console.warn('[Lanyard] rope texture failed', err)
    );
  }, [ropeImage]);

  const activeRopeTexture = ropeMap ?? fallbackRope;
  // Ensure wrap settings even on the fallback path.
  activeRopeTexture.wrapS = activeRopeTexture.wrapT = THREE.RepeatWrapping;

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      ])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  // Slightly longer rope segments so the bigger card has more room to swing.
  // Rope segment length — shorter so the card sits closer to the anchor.
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.9]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.9]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.9]);
  // Anchor scales with cardScale so the rope clips to the top of the
  // visible card mesh rather than landing inside it.
  // Derived from the original (cardScale=2.25, anchor=1.45) → 1.1783·s − 1.2
  // keeps the same "anchor just above visible card top" relationship.
  const cardAnchorY = 1.1783 * cardScale - 1.2;
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, cardAnchorY, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      {/* groupX shifts the anchor (and the card hanging below it) to the
          right of viewport. 5 lands the card around viewport 75-80% on
          typical desktop aspect ratios. Iterate this single value to taste. */}
      <group position={[5, anchorY, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={cardScale}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              {/* Fallback is a dark 1×1 texture (not the GLB placeholder,
                  not null) so the shader variant stays constant and the
                  real texture swaps in without a recompile. */}
              <meshPhysicalMaterial
                map={cardMap ?? CARD_FALLBACK_TEX}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.85}
                metalness={0.4}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={activeRopeTexture}
          repeat={[-1, 1]}
          lineWidth={1.4}
        />
      </mesh>
    </>
  );
}
