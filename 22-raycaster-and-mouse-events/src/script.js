import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.set(2, 0, 0)

scene.add(object1, object2, object3)


/**
 * Load GLTF Model
 */
let duckModel = null

const gltfLoader = new GLTFLoader()
gltfLoader.load(
    '/models/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
        console.log('success')
        console.log(gltf)

        gltf.scene.scale.set(1,1,1)
        duckModel = gltf.scene
        scene.add(gltf.scene)
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()
// raycaster.set(rayOrigin, rayDirection)

// // Update objects' matrices
// object1.updateMatrixWorld()
// object2.updateMatrixWorld()
// object3.updateMatrixWorld()

// const intersect = raycaster.intersectObject(object3)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)



/**
 * Helpers
 */
// GridsHelper, AxesHelper
const gridHelper = new THREE.GridHelper(30, 30)
const axesHelper = new THREE.AxesHelper(5)
scene.add(gridHelper, axesHelper)

// Raycaster helper
// const raycasterHelperOrigin = new THREE.Mesh(
//     new THREE.SphereGeometry(0.1, 16, 16),
//     new THREE.MeshBasicMaterial({ color: '#0000ff' })
// )
// raycasterHelperOrigin.position.copy(rayOrigin)
// scene.add(raycasterHelperOrigin)

// const raycasterHelperDirection = new THREE.ArrowHelper(
//     rayDirection,
//     rayOrigin,
//     2,
//     '#0000ff',
//     0.9,
//     0.2
// )
// scene.add(raycasterHelperDirection)



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
 * Cursor
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1   // (0 to 1) to (-1 to 1)
    mouse.y = - (event.clientY / sizes.height) * 2 + 1  // (0 to -1) to (1 to -1)
})

window.addEventListener('click', () => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log('click on object 1')
                break
            case object2:
                console.log('click on object 2')
                break
            case object3:
                console.log('click on object 3')
                break
        }
    }
    else if (!currentIntersect) {
        console.log('click on nothing')
    }
})

/** 
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 3, 5)
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

let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.7) * 1.5
    object2.position.y = -Math.sin(elapsedTime * 0.3) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // Update raycaster
    raycaster.setFromCamera(mouse, camera)
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // rayDirection.normalize()
    // raycaster.set(rayOrigin, rayDirection)

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    
    for (const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }

    if (intersects.length) {
        if (!currentIntersect) {
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
        currentIntersect.object.material.color.set('#0000ff')
    } else {
        if (currentIntersect) {
            console.log('mouse leave')
        }
        currentIntersect = null
    }

    if (duckModel) {
        duckModel.rotation.y = elapsedTime
        const modelIntersects = raycaster.intersectObject(duckModel)
        if (modelIntersects.length) {
            duckModel.scale.set(1.1, 1.1, 1.1)
        }
        else {
            duckModel.scale.set(1, 1, 1)
        }
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()