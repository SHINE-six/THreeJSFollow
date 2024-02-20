import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()




/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Mesh World - Objects
 */

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)


// Machinery 1 - big
const machinery1_group = new THREE.Group()

const machinery1_material = new THREE.MeshStandardMaterial({ color: '#bbbbbb', metalness: 0.3, roughness: 0.4, envMap: environmentMapTexture, envMapIntensity: 0.5 })
const machinery1_part1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 2, 0.4),
    machinery1_material
)
machinery1_part1.position.set(0,0,0)
machinery1_group.add(machinery1_part1)

const machinery1_part2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 1, 0.4),
    machinery1_material
)
machinery1_part2.position.set(0.5,0,0)
machinery1_group.add(machinery1_part2)

machinery1_group.position.set(-2, 0, 0)
scene.add(machinery1_group)

// Machinery 2 - medium
const machinery2_group = new THREE.Group()

const machinery2_material = new THREE.MeshStandardMaterial({ color: '#bbbbbb', metalness: 0.3, roughness: 0.4, envMap: environmentMapTexture, envMapIntensity: 0.5 })

const machinery2_part1 = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.5, 0.8),
    machinery2_material
)
machinery2_part1.position.set(0,0,0)
machinery2_group.add(machinery2_part1)

const machinery2_part2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.3, 0.6),
    machinery2_material
)
machinery2_part2.position.set(0,0.3,0)
machinery2_group.add(machinery2_part2)

const machinery2_part3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 20, 20),
    machinery2_material
)
machinery2_part3.position.set(0,0.6,0)
machinery2_group.add(machinery2_part3)

const machinery2_part4 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.6, 20),
    machinery2_material
)
machinery2_part4.position.set(0,0.9,0.2)
machinery2_part4.rotation.x = (Math.PI / 2) * 0.4
machinery2_group.add(machinery2_part4)

const machinery2_part5 = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 20, 20),
    machinery2_material
)
machinery2_part5.position.set(0,1.2,0.4)
machinery2_group.add(machinery2_part5)

const machinery2_part6 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.4, 20),
    machinery2_material
)
machinery2_part6.position.set(0,1,0.57)
machinery2_part6.rotation.x = (Math.PI / 2) * -0.4
machinery2_group.add(machinery2_part6)

machinery2_group.position.set(2, 0, 0)
scene.add(machinery2_group)

// Machinery 3 - small
const machinery3_group = new THREE.Group()

const machinery3_material = new THREE.MeshStandardMaterial({ color: '#bbbbbb', metalness: 0.3, roughness: 0.4, envMap: environmentMapTexture, envMapIntensity: 0.5 })

const machinery3_part1 = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.6, 1),
    machinery3_material
)
machinery3_part1.position.set(0,0,0)
machinery3_group.add(machinery3_part1)

const machinery3_part2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.5, 0.1),
    machinery3_material
)
machinery3_part2.position.set(0.6,0.5,0.5)
machinery3_group.add(machinery3_part2)

const machinery3_part3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.5, 0.1),
    machinery3_material
)
machinery3_part3.position.set(0.6,0.5,-0.5)
machinery3_group.add(machinery3_part3)

const machinery3_part4 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.5, 0.1),
    machinery3_material
)
machinery3_part4.position.set(-0.6,0.5,0.5)
machinery3_group.add(machinery3_part4)

const machinery3_part5 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.5, 0.1),
    machinery3_material
)
machinery3_part5.position.set(-0.6,0.5,-0.5)
machinery3_group.add(machinery3_part5)

scene.add(machinery3_group)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// Grid, Axes helper
const gridHelper = new THREE.GridHelper(10, 100)
const axesHelper = new THREE.AxesHelper(2)
scene.add(gridHelper, axesHelper)


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
camera.position.set(0, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()