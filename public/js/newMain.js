import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';


let camera, scene, renderer, controls;

// // Function to initialize the Three.js viewer
// function initViewer(container, modelPath) {
//   // Create scene, camera and renderer
//   scene = new THREE.Scene();
//   camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 20);
//   renderer = new THREE.WebGLRenderer({ antialias: true });

//   renderer.setSize(container.clientWidth, container.clientHeight);
//   container.appendChild(renderer.domElement);

//   // Create a loader for GLB files
//   const glbLoader = new GLTFLoader();

//   // Load the GLB model
//   glbLoader.load(modelPath, (gltf) => {
//     const model = gltf.scene;
//     scene.add(model);
//     camera.position.set(0, 1, 3);
//     controls = new OrbitControls(camera, renderer.domElement);

//     // Animation Loop
//     function animate() {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     }
//     animate();
//   });
// }

document.addEventListener('DOMContentLoaded', function () {
  const mainMedia = document.getElementById('mainMedia');
  const thumbnailItems = document.querySelectorAll('.thumbnail-item');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  const mediaSources = [
    '../Image/JesterAngleCamera.jpg',
    '../Image/Jester_Setting.jpg',
    '../3D/JesterOptomised.glb'
    // ... (other media paths)
  ];

  let currentIndex = 0;

  function showMedia(index) {
    mainMedia.innerHTML = '';
    const mediaPath = mediaSources[index];

    if (mediaPath.endsWith('.jpg') || mediaPath.endsWith('.png')) {
      const img = document.createElement('img');
      img.src = mediaPath;
      img.alt = 'Image';
      mainMedia.appendChild(img);
    } else if (mediaPath.endsWith('.mp4')) {
      const video = document.createElement('video');
      video.src = mediaPath;
      video.controls = true;
      mainMedia.appendChild(video);
    } else if (mediaPath.endsWith('.glb')) {
      initViewer(mainMedia, mediaPath);
    }
    currentIndex = index;
  }

  // Add click event listeners to thumbnails
  thumbnailItems.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      showMedia(index);
    });
  });

  // Event listeners for previous and next buttons
  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + mediaSources.length) % mediaSources.length;
    showMedia(currentIndex);
  });
  
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % mediaSources.length;
    showMedia(currentIndex);
  });

  // Initial display of media
  showMedia(currentIndex);
});

// Function to initialize the Three.js viewer
function initViewer(container) {

    console.log("This is a line of text.");

  // Define the path to your local GLB model
  const modelPath = '../3D/JesterOptomised.glb'; // Adjust the path accordingly

  // Create a loader for GLB files
  const glbLoader = new GLTFLoader();

  // Create a scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 20);
  camera.position.set(-0.75, 0.7, 1.25);

  // Create a renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Load the GLB model
  glbLoader.load(modelPath, (gltf) => {
    const model = gltf.scene;
    // Traverse through all meshes in the model and apply the material
    model.traverse((node) => {
      if (node.isMesh) {
        // Replace with your desired material
        //node.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
      }
    });
    scene.add(model);
    // Adjust camera position and controls (you may need to customize this)
  camera.position.set(0, 1, 3);
  const environment = new RoomEnvironment(renderer);
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  scene.background = new THREE.Color(0xffffff);
  scene.environment = pmremGenerator.fromScene(environment).texture;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 0.7;
  controls.maxDistance = 10;
  controls.target.set(0, 0.35, 0);
  controls.update();

  // Restrict camera panning
  controls.enablePan = false;
  controls.minPolarAngle = Math.PI / 4;
  controls.maxPolarAngle = Math.PI / 2;

  window.addEventListener('resize', onWindowResize);

  animate();

  // Render the scene
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    console.log("Successfully loaded");

  }
  });

  
}

function onWindowResize() {
    // Get the new width and height of the main media container
    const newW = mainMediaContainer.clientWidth;
    const newH = mainMediaContainer.clientHeight;
  
    // Update the camera's aspect ratio
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
  
    // Update the renderer's size
    renderer.setSize(newW, newH);
  }

