import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded',
}

gui
    .addColor(parameters, 'materialColor').onChange(() => { 
        material.color.set(parameters.materialColor)
        particleMaterial.color.set(parameters.materialColor)
     })
    

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures Loader
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/5.jpg')
gradientTexture.magFilter = THREE.NearestFilter

/**
 * Objects
 */
    // material
const objectDistance = 4

const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.3, 16, 100),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 1, 16),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.2, 100, 16),
    material
)

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

mesh1.position.y = - objectDistance * 0
mesh2.position.y = - objectDistance * 1
mesh3.position.y = - objectDistance * 2
scene.add(mesh1, mesh2, mesh3)

const meshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
const particlesCount = 250
const position = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount * 3; i++) {
    position[i * 3 + 0] = (Math.random() - 0.5) * 10
    position[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * 3
    position[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    color: '#ff88cc'
})

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)



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
 * Scroll
 */
let scrollY = window.scrollY
let scrollYPercent = 0
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    scrollYPercent = scrollY / (document.body.scrollHeight - sizes.height)
    const newSection = Math.floor(scrollYPercent * 3)

    if(newSection !== currentSection) {
        currentSection = newSection

        gsap.to(
            meshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inout',
                x: '+=6',
                y: '+=3',
                z: '+=2'
            }
        )
        console.log(meshes[currentSection])
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})


/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // transparent background
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate objects
    for(const mesh of meshes) {
        mesh.rotation.y += 0.2 * deltaTime
        mesh.rotation.x += 0.17 * deltaTime
    }

    // Update camera
    camera.position.y = - scrollYPercent * objectDistance * 2

    const parallaxX = cursor.x * 2
    const parallaxY = - cursor.y 
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 3 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 3 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()