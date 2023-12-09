import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'

//* Debug UI setup
const gui = new GUI({ width: 300, title: 'Debug UI', closeFolders: true})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures Loader
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {console.log('onStart')}
loadingManager.onLoad = () => {console.log('onLoad')}
loadingManager.onProgress = () => {console.log('onProgress')}
loadingManager.onError = () => {console.log('onError')}

const textureLoader = new THREE.TextureLoader(loadingManager)
const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
    doorColorTexture.colorSpace = THREE.SRGBColorSpace
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('./textures/matcaps/8.png')
    matcapTexture.colorSpace = THREE.SRGBColorSpace
const gradientTexture = textureLoader.load('./textures/gradients/3.jpg')

// Environment Map
const rgbeLoader = new RGBELoader(loadingManager)
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping  // To make the environment map work

    scene.background = environmentMap
    scene.environment = environmentMap
})

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 20),
    // new THREE.MeshBasicMaterial({ 
    //     map: doorColorTexture, 
    //     transparent: true,
    //     alphaMap: doorAlphaTexture, 
    // })
    // new THREE.MeshNormalMaterial({ flatShading: true })
    // new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    new THREE.MeshStandardMaterial({roughness: 0.2, metalness: 0.7 })
)
sphere.position.set(-1.5, 0, 0)
scene.add(sphere)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 2, 2),
    // new THREE.MeshBasicMaterial({ 
    //     map: doorColorTexture, 
    //     side: THREE.DoubleSide,
    //     transparent: true,
    //     alphaMap: doorAlphaTexture,
    // })
    new THREE.MeshPhysicalMaterial({
        roughness: 1,
        metalness: 1, 
        side: THREE.DoubleSide, 
        map: doorColorTexture,
        metalnessMap: doorMetalnessTexture, 
        roughnessMap: doorRoughnessTexture, 
        aoMap: doorAmbientOcclusionTexture, 
        displacementMap: doorHeightTexture, 
        displacementScale: 0.1, 
        normalMap: doorNormalTexture, 
        alphaMap: doorAlphaTexture,
        transparent: true,
        normalScale: new THREE.Vector2(0.5, 0.5),
        // clearcoat: 1,
        // clearcoatRoughness: 0.1,
        transmission: 0.9,
        ior: 1.1,
        thickness: 5,
    })
)
plane.position.set(1, 0, 0)
scene.add(plane)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.2, 10, 30),
    new THREE.MeshStandardMaterial({roughness: 0.2, metalness: 0.7})
)
torus.position.x = 3
scene.add(torus)

gui.add(plane.material, 'roughness').min(0).max(1).step(0.01)
gui.add(plane.material, 'transmission').min(0).max(1).step(0.01)
gui.add(plane.material, 'ior').min(0.5).max(3).step(0.01)
gui.add(plane.material, 'thickness').min(0).max(1).step(0.01)


// Lights
const directionalLight = new THREE.DirectionalLight(0x8f8fff, 1)
    directionalLight.position.set(-1, 1, 1)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
const pointLight = new THREE.PointLight(0x70afff, 3, 10, 0.1)
    pointLight.position.set(-0.8, 1, 1.5)
const redPointLight = new THREE.PointLight(0xff0000, 5, 10, 0.5)
redPointLight.position.set(-0.5, 0, -2)
// scene.add( ambientLight, pointLight, redPointLight)

// Grid Helper
const gridHelper = new THREE.GridHelper(10, 10);
const axisHelper = new THREE.AxesHelper(5);
scene.add(gridHelper, axisHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
const redPointLightHelper = new THREE.PointLightHelper(redPointLight, 0.2)
scene.add(directionalLightHelper, pointLightHelper, redPointLightHelper)



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
camera.position.x = 0
camera.position.y = 1
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.y = 0.05 * elapsedTime
    plane.rotation.y = 0.05 * elapsedTime
    torus.rotation.y = 0.05 * elapsedTime

    sphere.rotation.x = -0.035 * elapsedTime
    plane.rotation.x = -0.035 * elapsedTime
    torus.rotation.x = -0.015 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()