import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es'


/**
 * Debug
 */
const gui = new GUI({ width: 300 })
const debugObject = {}
debugObject.createSphere = () => {
    for (let i = 0; i < debugObject.numberOfSpheresToAdd; i++) {
        createSphere(
            Math.random() * 0.5 + 0.1, 
            { 
                x: (Math.random() - 0.5) * 3, 
                y: 3, 
                z: (Math.random() - 0.5) * 3 
            },
            getRandomColor()
        )
    }
}
debugObject.numberOfSpheresToAdd = 1

debugObject.createBox = () => {
    createBox(
        Math.random() + 0.3,
        Math.random() + 0.3,
        Math.random() + 0.3,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
debugObject.reset = () => {
    for (const object of objectsToUpdate) {
        object.body.removeEventListener('collide', playHitSound)
        world.remove(object.body)
        scene.remove(object.mesh)
        object.mesh.geometry.dispose()      // This is important to avoid memory leaks
        object.mesh.material.dispose()         // This is important to avoid memory leaks
    }
    objectsToUpdate.splice(0, objectsToUpdate.length)
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'numberOfSpheresToAdd').min(1).max(10).step(1).name('Number of Spheres to Add')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Audio
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if (impactStrength > 1.5) {
        hitSound.volume = 1
        hitSound.currentTime = 0
        hitSound.play()
    }
}


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
 * Physics World
 */

const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
// world.allowSleep = true
world.gravity.set(0, -9.82, 0)

// Materials
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.6,
        restitution: 0.1,
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial // This is important for performance because it allows the engine to reuse the same contact material


// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    // mass: 0,
    // position: new CANNON.Vec3(0,-0.5,0),
    shape: floorShape,
    material: defaultMaterial
})
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1,0,0), Math.PI * 0.5)
world.addBody(floorBody)


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



/**
 *  Utils
 */
const getRandomColor = () => {
    var color = (Math.random() * 0xFFFFFF << 0).toString(16)
    color = '#' + ('000000' + color).slice(-6)
    return color;
}


const objectsToUpdate = []

//* Create both Three.js and Cannon.js spheres

// declare outside so performance is better as it's not being created every time
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    color: getRandomColor()
})

const createSphere = (radius, position, color) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Sphere(radius)

    const body = new CANNON.Body({
        mass: radius * 3,
        // position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    world.addBody(body)

    // Save in objects to update
    objectsToUpdate.push({ mesh, body })

    console.log(objectsToUpdate)
}

// createSphere(0.5, { x: 0, y: 3, z: 0 }, getRandomColor())


const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    color: '#ff0000',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

const createBox = (width, height, depth, position) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width*0.5, height*0.5, depth*0.5))
    const body = new CANNON.Body({
        mass: 1,
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in objects to update
    objectsToUpdate.push({ mesh, body })
}


window.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        objectsToUpdate[0].body.velocity.z += -1;
        if (objectsToUpdate[0].body.velocity.z < -5) {
            objectsToUpdate[0].body.velocity.z = -5;
            console.log('Max speed reached')
        }
    }
    if (e.key === 's') {
        objectsToUpdate[0].body.velocity.z += 1;
        if (objectsToUpdate[0].body.velocity.z > 5) {
            objectsToUpdate[0].body.velocity.z = 5;
            console.log('Max speed reached')
        }
    }
    if (e.key === 'a') {
        objectsToUpdate[0].body.velocity.x += -1;
        if (objectsToUpdate[0].body.velocity.x < -5) {
            objectsToUpdate[0].body.velocity.x = -5;
            console.log('Max speed reached')
        }
    }
    if (e.key === 'd') {
        objectsToUpdate[0].body.velocity.x += 1;
        if (objectsToUpdate[0].body.velocity.x > 5) {
            objectsToUpdate[0].body.velocity.x = 5;
            console.log('Max speed reached')
        }
    }
})






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
camera.position.set(3, 3, 3)
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

    // Update physics world
    world.step(1 / 60, deltaTime, 3)  // to update the physics world using the time since the last frame

    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)

        if (object.mesh.position.x > 5 || object.mesh.position.x < -5 || object.mesh.position.z > 5 || object.mesh.position.z < -5) {
            object.body.applyForce({ x: -object.body.position.x, y: 10, z: -object.body.position.z }, object.body.position);
        }

        if (object.mesh.position.y > 10) {
          object.body.applyForce({ x: 0, y: -40, z: 0 }, object.body.position);
        }

        if (object.mesh.position.x > 7 || object.mesh.position.x < -7 || object.mesh.position.z > 7 || object.mesh.position.z < -7) {
            objectsToUpdate.splice(objectsToUpdate.indexOf(object), 1) // Remove from array

            object.body.removeEventListener('collide', playHitSound)
            world.remove(object.body)
            scene.remove(object.mesh)
            object.mesh.geometry.dispose()      // This is important to avoid memory leaks
            object.mesh.material.dispose()         // This is important to avoid memory leaks
        }

        if (Math.floor(elapsedTime%15) == 0 && Math.floor(elapsedTime) != 0){
            object.body.applyForce({ x: object.body.velocity.x * 0.5, y: 0, z: object.body.velocity.z * 0.5}, object.body.position)
            console.log('Speed up!')
        }
    }
    
    // if (objectsToUpdate.length > 0) {
    //     objectsToUpdate[0].mesh.material.color.set('#ff0000')
    // }


    // Update spheres
    // sphere.position.copy(sphereBody.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()