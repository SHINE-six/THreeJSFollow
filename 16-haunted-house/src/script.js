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

// Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Textures
 */
const LoadingManager = new THREE.LoadingManager()
LoadingManager.onStart = () => console.log('onStart')
LoadingManager.onLoad = () => console.log('onLoad')
LoadingManager.onProgress = () => console.log('onProgress')
LoadingManager.onError = () => console.log('onError')
const textureLoader = new THREE.TextureLoader(LoadingManager)
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
    grassColorTexture.colorSpace = THREE.SRGBColorSpace
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')
    grassColorTexture.repeat.set(8, 8)
    grassAmbientOcclusionTexture.repeat.set(8, 8)
    grassNormalTexture.repeat.set(8, 8)
    grassRoughnessTexture.repeat.set(8, 8)
    grassColorTexture.wrapS = THREE.RepeatWrapping
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
    grassNormalTexture.wrapS = THREE.RepeatWrapping
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping
    grassColorTexture.wrapT = THREE.RepeatWrapping
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
    grassNormalTexture.wrapT = THREE.RepeatWrapping
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping
const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
    doorColorTexture.colorSpace = THREE.SRGBColorSpace
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const bricksColorTexture = textureLoader.load('./textures/bricks/color.jpg')
    bricksColorTexture.colorSpace = THREE.SRGBColorSpace
const bricksAmbientOcclusionTexture = textureLoader.load('./textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('./textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('./textures/bricks/roughness.jpg')


/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
    })
)
walls.position.set(0, 2.5 / 2, 0)
walls.castShadow = true
// walls.receiveShadow = true
house.add(walls)



// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.position.set(0, 2.5 + 0.5, 0)
roof.rotation.y = Math.PI * 0.25
// roof.castShadow = true
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 5, 5),
    new THREE.MeshStandardMaterial({ 
        map: doorColorTexture, 
        transparent: true,
        alphaMap: doorAlphaTexture, 
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
     })
)
door.position.set(0, 1, 2 + 0.01)
house.add(door)

// Bushes
const bushGroup = new THREE.Group()
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

for (let i = 0; i < 5; i++) {
    const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial)
    while (true) {
        const bushX = Math.random() * 15 - 7.5
        const bushZ = Math.random() * 15 - 7.5

        if (bushX < 2.5 && bushX > -2.5 && bushZ < 3 && bushZ > -2.5) { continue }
        else { 
            bushMesh.position.set(bushX, 0.2, bushZ)
            break
        }
    }
    const scale = Math.random() * 0.5 + 0.3
    bushMesh.scale.set(scale, scale, scale)
    bushGroup.add(bushMesh)
}
scene.add(bushGroup)

// Graves
const gravesGroup = new THREE.Group()
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for (let i = 0; i < 30; i++) {
    const graveMesh = new THREE.Mesh(graveGeometry, graveMaterial)
    while (true) {
        const graveX = Math.random() * 15 - 7.5
        const graveZ = Math.random() * 15 - 7.5

        if (graveX < 2.5 && graveX > -2.5 && graveZ < 3 && graveZ > -2.5) { continue }
        else { 
            graveMesh.position.set(graveX, 0.3, graveZ)
            break
        }
    }
    graveMesh.rotation.y = Math.random() * Math.PI / 2 - (Math.PI * 0.25)
    graveMesh.rotation.z = Math.random() * Math.PI /8 - (Math.PI * 0.125)
    gravesGroup.add(graveMesh)
}
scene.add(gravesGroup)


// Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
ghost1.position.set(3, 1, 0)
ghost1.castShadow = true
ghost1.shadow.camera.far = 3
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#ff0000', 5, 2)
ghost2.position.set(3, 1, 0)
ghost2.castShadow = true
ghost2.shadow.camera.far = 3
scene.add(ghost2)


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
     })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow = true
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.1)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Point light
const pointLight = new THREE.PointLight('#ff0000', 5, 20, 1)
const pointLight2 = new THREE.PointLight('#afafff', 2, 3, 1)
pointLight.position.set(0, 6, 2)
pointLight2.position.set(0, 2.4, 2.2)
scene.add(pointLight, pointLight2)

const pointLightHelper = new THREE.PointLightHelper(pointLight)
const pointLight2Helper = new THREE.PointLightHelper(pointLight2, 0.1)
scene.add(pointLightHelper, pointLight2Helper)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffff4f', 0.5)
moonLight.position.set(3, 6, - 2)
moonLight.castShadow = true
moonLight.shadow.camera.near = 2
moonLight.shadow.camera.far = 12
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// shadow camera helper
const moonLightShadowCameraHelper = new THREE.CameraHelper(moonLight.shadow.camera)
// const ghost1ShadowCameraHelper = new THREE.CameraHelper(ghost1.shadow.camera)
// const ghost2ShadowCameraHelper = new THREE.CameraHelper(ghost2.shadow.camera)
// scene.add(moonLightShadowCameraHelper, ghost1ShadowCameraHelper, ghost2ShadowCameraHelper)
scene.add(moonLightShadowCameraHelper)

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
camera.position.set(0, 3, 8)
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
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.sin(ghost1Angle) * 3 + 3
    ghost1.position.z = Math.cos(ghost1Angle) * 1
    ghost1.position.y = Math.sin(ghost1Angle * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.sin(ghost2Angle) * 3 - 4
    ghost2.position.z = Math.cos(ghost2Angle) * 1 + 2
    ghost2.position.y = Math.sin(ghost2Angle * 2)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()