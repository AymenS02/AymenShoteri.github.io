//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'porsche';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
    'src/assets/porsche/scene.gltf',
    function (gltf) {
        console.log('Model loaded:', gltf);
        object = gltf.scene;
        scene.add(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('Error loading the model:', error);
    }
);


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender == "porsche" ? 8 : 500;
camera.position.y = objToRender == "porsche" ? 2 : 0;

//Add lights to the scene, so we can actually see the 3D model
// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // White directional light
directionalLight.position.set(1, 1, 1).normalize(); // Set the light direction
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.5); // Soft white light
scene.add(hemisphereLight);



// Add controls for rotation only
if (objToRender === "porsche") {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false; // Disable zooming
    controls.enablePan = false; // Disable panning
}

var mouse, raycaster;

mouse = new THREE.Vector2();
raycaster = new THREE.Raycaster();

// Center point
const center = new THREE.Vector2(0.027027027027026973, -0.1298190401258852);
const radius = 0.10; // Radius for interaction

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onClick() {
    // Calculate the distance between the mouse and the center
    const distance = mouse.distanceTo(center);

    // Check if the click is within the specified radius
    if (distance <= radius) {
        // Perform actions when clicked within the radius
        // For example, enable controls, etc.
        if (objToRender === "porsche") {
            controls.enabled = true; // Enable controls when clicked within the radius
        }
    }
}

//Render the scene
function animate() {
    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);

    // Rotate the 'porsche' model along the XY axis
    if (objToRender === 'porsche' && object) {
        // Increment rotation values for smooth rotation
        object.rotation.y += 0.007; // Adjust the speed of rotation as needed
    }

    // Update controls
    if (controls) {
        controls.update();
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
  
window.addEventListener('resize', onWindowResize);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick);

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//Start the 3D rendering
animate();