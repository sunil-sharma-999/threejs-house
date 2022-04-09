import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
gui.hide();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// fog
const fog = new THREE.Fog('#262837', 1, 10);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// walls texture
const wallTexture = textureLoader.load('./static/textures/bricks/color.jpg');
const wallAmbientOcclusion = textureLoader.load(
  './static/textures/bricks/ambientOcclusion.jpg',
);

const wallNormalTexture = textureLoader.load(
  './static/textures/bricks/normal.jpg',
);
const wallRoughness = textureLoader.load(
  './static/textures/bricks/roughness.jpg',
);

// grass texture
const grassTexture = textureLoader.load('./static/textures/grass/color.jpg');
const grassAmbientOcclusion = textureLoader.load(
  './static/textures/grass/ambientOcclusion.jpg',
);

const grassNormalTexture = textureLoader.load(
  './static/textures/grass/normal.jpg',
);
const grassRoughness = textureLoader.load(
  './static/textures/grass/roughness.jpg',
);
grassTexture.repeat.set(8, 8);
grassAmbientOcclusion.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughness.repeat.set(8, 8);

grassTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusion.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughness.wrapS = THREE.RepeatWrapping;

grassTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusion.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughness.wrapT = THREE.RepeatWrapping;

// door textures
const doorTexture = textureLoader.load('./static/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('./static/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
  './static/textures/door/ambientOcclusion.jpg',
);
const doorDisplacementTexture = textureLoader.load(
  './static/textures/door/height.jpg',
);
const doorMetalness = textureLoader.load(
  './static/textures/door/metalness.jpg',
);
const doorNormalTexture = textureLoader.load(
  './static/textures/door/normal.jpg',
);
const doorRoughness = textureLoader.load(
  './static/textures/door/roughness.jpg',
);

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallTexture,
    aoMap: wallAmbientOcclusion,
    normalMap: wallNormalTexture,
    roughnessMap: wallRoughness,
  }),
);
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2),
);
walls.position.y = 1.24;
house.add(walls);

// roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' }),
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 0.5;
house.add(roof);

// door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorDisplacementTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalness,
    roughnessMap: doorRoughness,
  }),
);
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2),
);
door.position.y = 1;
door.position.z = 2.001;
house.add(door);

// bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  map: grassTexture,
  normalMap: grassNormalTexture,
  roughnessMap: grassRoughness,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-1, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// grave group
const graveYard = new THREE.Group();
scene.add(graveYard);

// graves
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: 'gray' });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3.1 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.castShadow = true;
  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.3;
  grave.rotation.z = (Math.random() - 0.5) * 0.3;

  graveYard.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: grassTexture,
    aoMap: grassAmbientOcclusion,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughness,
  }),
);

floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2),
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.3);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.3);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

// door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 7;
scene.add(camera);
gui.add(camera.position, 'x').min(-15).max(15).step(0.01);
gui.add(camera.position, 'y').min(-15).max(15).step(0.01);
gui.add(camera.position, 'z').min(-15).max(15).step(0.01);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(fog.color);

// shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

moonLight.castShadow = true;
doorLight.castShadow = true;

moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 7;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.castShadow = true;
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.castShadow = true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.castShadow = true;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

walls.castShadow = true;
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

floor.receiveShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //update ghosts
  const ghostAngle1 = elapsedTime * 0.5;
  ghost1.position.x = Math.sin(ghostAngle1) * 4;
  ghost1.position.z = Math.cos(ghostAngle1) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghostAngle2 = -elapsedTime * 0.32;
  ghost2.position.x = Math.sin(ghostAngle2) * 5;
  ghost2.position.z = Math.cos(ghostAngle2) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghostAngle3 = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.sin(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.32));

  ghost3.position.z = Math.cos(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 5) * Math.sin(elapsedTime * 2);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
