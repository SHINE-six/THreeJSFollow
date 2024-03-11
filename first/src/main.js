import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import GUI from 'lil-gui';

//* Debug UI setup
const gui = new GUI({ width: 300, title: 'Debug UI', closeFolders: true});
// gui.close();
gui.hide();
const debugObject = {};

debugObject.color = '#c0aaf0';
debugObject.spin = () => {gsap.to(BeeGroup.rotation, { duration: 1, delay: 0, y: BeeGroup.rotation.y + Math.PI * 2 });}
debugObject.subdivision = 2;

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();


//* Geometry
const BeeGroup = new THREE.Group();
BeeGroup.position.set(0,0,0);
// scene.add(BeeGroup);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide })
);

// Modify the position of one of the vertices
const vertices = plane.geometry.attributes.position.array;
vertices[2] = -1; // Increase the y-coordinate of the first vertex

plane.rotation.x = - Math.PI * 1.5;
// scene.add(plane);

const building1 = new THREE.Mesh(
    new THREE.BoxGeometry(7, 20, 10),
    new THREE.MeshBasicMaterial({ color: 0x60bf80 })
);
building1.position.set(-10,10,0);
// scene.add(building1);

// const cube1 = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1,2,2,2),
//     new THREE.MeshBasicMaterial({ color: debugObject.color })
// );
// cube1.position.set(0,0,0);
// cube1.name = 'cube1';
// BeeGroup.add(cube1);


// const cube2 = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ color: 0x60bf80 })
// );
// cube2.position.set(-1.5,0,0);
// cube2.name = 'cube2';
// BeeGroup.add(cube2);

// const cube3 = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ color: 0x70e0e0 })
// );
// cube3.position.set(1.5,0,0);
// cube3.name = 'cube3';
// BeeGroup.add(cube3);

// mesh.position.normalize(); // normalize() to get the direction of the mesh AKA unit vector
// console.log(mesh.position.length()); // length() to get the distance from the origin to the mesh

//* Debug UI
window.addEventListener('keydown', (e) => {
    if (e.key === 'd') {
        gui.show(gui._hidden);
    }
});

const BeeGroupFolder = gui.addFolder('BeeGroup');
const BeeGroupPositionFolder = BeeGroupFolder.addFolder('position');
BeeGroupPositionFolder.add(BeeGroup.position, 'x').min(-2).max(2).step(0.01).name('x position');
BeeGroupPositionFolder.add(BeeGroup.position, 'y').min(-2).max(2).step(0.01).name('y position');
BeeGroupPositionFolder.add(BeeGroup.position, 'z').min(-2).max(2).step(0.01).name('z position');
const BeeGroupRotationFolder = BeeGroupFolder.addFolder('rotation');
BeeGroupRotationFolder.add(BeeGroup.rotation, 'x').min(-2).max(2).step(0.01).name('x rotation');
BeeGroupRotationFolder.add(BeeGroup.rotation, 'y').min(-2).max(2).step(0.01).name('y rotation');
BeeGroupRotationFolder.add(BeeGroup.rotation, 'z').min(-2).max(2).step(0.01).name('z rotation');

// gui.add(BeeGroup, 'visible');
// gui.add(cube1.material,'wireframe');
// gui.addColor(debugObject,'color')
//     .onChange(() => {
//         cube1.material.color.set(debugObject.color);
//     })
// gui.add(debugObject,'spin');
// gui.add(debugObject,'subdivision')
//     .min(1)
//     .max(5)
//     .step(1)
//     .onChange(() => {
//         cube1.geometry = new THREE.BoxGeometry(1, 1, 1,debugObject.subdivision,debugObject.subdivision,debugObject.subdivision);
//     })

// console.log(cube1.geometry)

//* Axes helper
const axesHelper = new THREE.AxesHelper();
const gridHelper = new THREE.GridHelper(100, 100);
// scene.add(axesHelper, gridHelper);

// Camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Resize the canvas when the window is resized
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height; // aspect ratio
    camera.updateProjectionMatrix(); // update the camera
    renderer.setSize(sizes.width, sizes.height); // update the renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
})

// Fullscreen when double click
window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    }
    else {
        document.exitFullscreen();
    }
});


const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height, 0.1, 1000);
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 1000);
camera.position.set(0,0,3);
scene.add(camera);

// camera.lookAt(mesh.position); // lookAt() to make the camera look at the mesh

// console.log(mesh.position.distanceTo(camera.position)); // distanceTo() to get the distance between two objects

//* Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

// * GSAP Animations
// gsap.to(BeeGroup.position, { duration: 1, delay: 1, x: 2 });
// gsap.to(BeeGroup.position, { duration: 1, delay: 3, x: 0 });

//* Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const clock = new THREE.Clock();
// Animation
const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // BeeGroup.rotation.z = Math.sin(elapsedTime) * Math.PI;
    // camera.position.y = Math.cos(elapsedTime);
    // camera.position.x = Math.sin(elapsedTime);
    // camera.lookAt(BeeGroup.position);

    //* Update controls
    controls.update();
    
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();
