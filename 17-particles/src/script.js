import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const starTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */
const snowGeometry = new THREE.BufferGeometry();
const count = 3000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 4
    colors[i] = Math.random()
}
snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
snowGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particleMaterial = new THREE.PointsMaterial({ color: '#ffffff', size: 0.1, sizeAttenuation: true, map: starTexture, transparent: true, alphaMap: starTexture, 
    // alphaTest: 0.1 ,
    // depthTest: false,
    depthWrite: false,
    // blending: THREE.AdditiveBlending,
    vertexColors: true
})

const snow = new THREE.Points(snowGeometry, particleMaterial);
scene.add(snow);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2,2,2),
    new THREE.MeshBasicMaterial()
)
// scene.add(cube)

// const snoww = new THREE.Points(
//     new THREE.BufferGeometry(),
//     new THREE.PointsMaterial({ color: '#ff6f6f', size: 0.03, sizeAttenuation: true })
// )
// scene.add(snoww)


//* Grid Helper
const gridHelper = new THREE.GridHelper(10, 100);
const axesHelper = new THREE.AxesHelper(5);
// scene.add(gridHelper, axesHelper);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

console.log(snowGeometry.attributes.position.array)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // snow.rotation.y = elapsedTime * 0.1

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        const x = snowGeometry.attributes.position.array[i3];
        snowGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x) * 0.3;
        
    }
    snowGeometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()  