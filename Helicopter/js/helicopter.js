import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Renderer setup
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;  // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Optional: Soft shadows
document.body.appendChild(renderer.domElement);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 5, 15);
scene.add(camera);

// Create an audio listener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// Create a global audio source
const helicopterSound = new THREE.Audio(listener);

// Load the sound file
const audioLoader = new THREE.AudioLoader();
audioLoader.load('sounds/helicopter-sound.mp3', (buffer) => {
    helicopterSound.setBuffer(buffer);
    helicopterSound.setLoop(true);  // Loop the helicopter sound
    //helicopterSound.setVolume(3); // Adjust the volume
    helicopterSound.play();  // Play the sound
});

// Load textures
const bodyTexture = new THREE.TextureLoader().load('textures/body.jpg');
const rotorTexture = new THREE.TextureLoader().load('textures/rotor-texture.jpg');
const groundTexture = new THREE.TextureLoader().load('textures/ground.jpg');
const skyTexture = new THREE.TextureLoader().load('textures/sky.jpg');

// Create the helicopter body (fuselage)
const fuselageGeometry = new THREE.CylinderGeometry(1, 1, 6, 32);
const fuselageMaterial = new THREE.MeshBasicMaterial({ map: bodyTexture });
const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
fuselage.rotation.z = Math.PI / 2; // Rotate the body to lay it horizontally
fuselage.castShadow = true;  // Enable shadow casting

// Create the cockpit
const cockpitGeometry = new THREE.SphereGeometry(1, 32, 32);
const cockpitMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
cockpit.position.set(2.5, 0, 0);
cockpit.castShadow = true;  // Enable shadow casting

// Create the main rotor
const rotorGeometry = new THREE.BoxGeometry(10, 0.1, 0.5);
const rotorMaterial = new THREE.MeshBasicMaterial({ map: rotorTexture });
const mainRotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
mainRotor.position.y = 1.2; // Position the rotor on top of the body
mainRotor.castShadow = true;  // Enable shadow casting

// Create the tail boom
const tailBoomGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 32);
const tailBoomMaterial = new THREE.MeshBasicMaterial({ map: bodyTexture });
const tailBoom = new THREE.Mesh(tailBoomGeometry, tailBoomMaterial);
tailBoom.position.set(-5, 0, 0); // Position the tail at the back of the body
tailBoom.rotation.z = Math.PI / 2; // Rotate the tail to align it correctly
tailBoom.castShadow = true;  // Enable shadow casting

// Create the tail rotor
const tailRotorGeometry = new THREE.BoxGeometry(2, 0.1, 0.3);
const tailRotorMaterial = new THREE.MeshBasicMaterial({ map: rotorTexture });
const tailRotor = new THREE.Mesh(tailRotorGeometry, tailRotorMaterial);
tailRotor.position.set(-9, 0, 0); // Position the tail rotor at the end of the tail
tailRotor.castShadow = true;  // Enable shadow casting

// Create the landing skids
const skidGeometry = new THREE.BoxGeometry(0.1, 0.1, 4);
const skidMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const skid1 = new THREE.Mesh(skidGeometry, skidMaterial);
skid1.position.set(0, -1.1, 1.5);
skid1.castShadow = true;  // Enable shadow casting

const skid2 = new THREE.Mesh(skidGeometry, skidMaterial);
skid2.position.set(0, -1.1, -1.5);
skid2.castShadow = true;  // Enable shadow casting

const skidConnectorGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
const skidConnector1 = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
skidConnector1.position.set(0, -0.6, 1.5);
skidConnector1.castShadow = true;  // Enable shadow casting

const skidConnector2 = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
skidConnector2.position.set(0, -0.6, -1.5);
skidConnector2.castShadow = true;  // Enable shadow casting

const skidConnector3 = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
skidConnector3.position.set(2, -0.6, 1.5);
skidConnector3.castShadow = true;  // Enable shadow casting

const skidConnector4 = new THREE.Mesh(skidConnectorGeometry, skidMaterial);
skidConnector4.position.set(2, -0.6, -1.5);
skidConnector4.castShadow = true;  // Enable shadow casting

// Create a group for the helicopter
const helicopter = new THREE.Group();
helicopter.add(fuselage, cockpit, mainRotor, tailBoom, tailRotor, skid1, skid2, skidConnector1, skidConnector2, skidConnector3, skidConnector4);
helicopter.position.set(0, 2, 0);  // Set initial position
scene.add(helicopter);

// Ground setup with texture
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2;
ground.receiveShadow = true;  // Enable shadow receiving
scene.add(ground);

// Skybox setup using a large sphere geometry
const skyGeometry = new THREE.SphereGeometry(500, 60, 40);
const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });  // Sky texture on the inside
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;  // Enable shadows for the light
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Shadows
renderer.shadowMap.enabled = true;
helicopter.castShadow = true;
ground.receiveShadow = true;

// Animation variables
const mainRotorSpeed = 0.2;
const tailRotorSpeed = 0.5;
const helicopterSpeed = 0.02;

// Mouse interaction variables
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Mouse event listeners for rotating the light
document.addEventListener('mousedown', () => { isDragging = true; });
document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaMove = {
            x: event.offsetX - previousMousePosition.x,
            y: event.offsetY - previousMousePosition.y
        };
        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));
        directionalLight.position.applyQuaternion(deltaRotationQuaternion);
        previousMousePosition = { x: event.offsetX, y: event.offsetY };
    }
});
document.addEventListener('mouseup', () => { isDragging = false; });
document.addEventListener('mouseleave', () => { isDragging = false; });

// Keyboard interaction for camera movement
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp': camera.position.y += 1; break;
        case 'ArrowDown': camera.position.y -= 1; break;
        case 'ArrowLeft': camera.position.x -= 1; break;
        case 'ArrowRight': camera.position.x += 1; break;
        case 'w': camera.position.z -= 1; break;
        case 's': camera.position.z += 1; break;
    }
});

// Utility function to convert degrees to radians
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the rotors
    mainRotor.rotation.y += mainRotorSpeed;
    tailRotor.rotation.z += tailRotorSpeed;

    // Move the helicopter forward
    helicopter.position.x += helicopterSpeed;

    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});