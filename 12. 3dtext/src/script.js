import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug

const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const LoadingManager = new THREE.LoadingManager()
LoadingManager.onStart = () => {console.log('onStart')}
LoadingManager.onLoad = () => {console.log('onLoad')}
LoadingManager.onProgress = () => {console.log('onProgress')}
LoadingManager.onError = () => {console.log('onError')}

const textureLoader = new THREE.TextureLoader(LoadingManager)
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Fonts 
 */
const fontLoader = new FontLoader(LoadingManager)

debugObject.text = 'Desmond'
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            debugObject.text, 
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            })
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture})
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
    }
)

console.time('donuts')
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donutMaterial = new THREE.MeshNormalMaterial()

for (let i = 0; i < 300; i++) {
    const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial)

    donutMesh.position.x = (Math.random() - 0.5) * 10
    donutMesh.position.y = (Math.random() - 0.5) * 10
    donutMesh.position.z = (Math.random() - 0.5) * 10

    donutMesh.rotation.x = Math.random() * Math.PI
    donutMesh.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donutMesh.scale.set(scale, scale, scale)   
    
    scene.add(donutMesh)
}
console.timeEnd('donuts')

//* Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 2, 0.1)
scene.add(directionalLight)


//* Helper
const gridHelper = new THREE.GridHelper()
// scene.add(gridHelper)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
// scene.add(directionalLightHelper)

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
camera.position.set(0, 0.25, 0.8)
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()