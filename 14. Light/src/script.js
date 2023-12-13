import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

//* Texture
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {console.log('onStart')}
loadingManager.onLoad = () => {console.log('onLoad')}
loadingManager.onProgress = () => {console.log('onProgress')}
loadingManager.onError = () => {console.log('onError')}
const textureloader = new THREE.TextureLoader(loadingManager)
const bakedShadow = textureloader.load('/textures/bakedShadow.jpg')
    bakedShadow.colorSpace = THREE.SRGBColorSpace
const simpleShadow = textureloader.load('/textures/simpleShadow.jpg')

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
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 5,10,2)
pointLight.position.set(0, 2, 1)
pointLight.castShadow = true
scene.add(pointLight)
pointLight.shadow.camera.far = 3

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 2, 2)
directionalLight.castShadow = true
// scene.add(directionalLight)

directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

directionalLight.shadow.camera.near = 2
directionalLight.shadow.camera.far = 5
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2
// directionalLight.shadow.radius = 10

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1)
// scene.add(hemisphereLight)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 5, 1, 1)
// rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
// scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0x78fff0, 5, 10, Math.PI/2 * 0.7, 0.6, 1)
spotLight.position.set(0, 1.5, 2)
// scene.add(spotLight)
spotLight.castShadow = true  
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 1.1

spotLight.target.position.set(- 0.75,0,0)
// scene.add(spotLight.target)

//* Ligth helper
const pointLightHelper = new THREE.PointLightHelper(pointLight,0.1)
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
// scene.add(pointLightHelper)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
// scene.add(pointLightCameraHelper)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)
cube.castShadow = true

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.castShadow = true
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    material
)
plane.receiveShadow = true
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow.rotation.set(- Math.PI * 0.5, 0, 0)
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphere, cube, torus, plane, sphereShadow)

//! Grid helper
const gridHelper = new THREE.GridHelper(5, 20)
scene.add(gridHelper)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap
console.log()
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    sphere.position.z = Math.sin(elapsedTime * 1.5)
    sphere.position.x = Math.cos(elapsedTime * 1.5)
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1-sphere.position.y) * 0.5
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()