import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Geometry
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube1.position.set(0,0,0);

scene.add(cube1);

// Camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0,0,3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

// Animate
const animate = () => {
    renderer.render(scene, camera);

    // Update controls
    controls.update();

    // Call animate again on the next frame
    window.requestAnimationFrame(animate);
};
