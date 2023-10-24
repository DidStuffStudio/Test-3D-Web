import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';


let camera, scene, renderer, controls;


document.addEventListener('DOMContentLoaded', function () {
  const mainMedia = document.getElementById('mainMedia');
  const thumbnailItems = document.querySelectorAll('.thumbnail-item');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  const mediaSources = [
    '../Image/JesterAngleCamera.jpg',
    '../Image/Jester_Setting.jpg',
    '../html/360_Viewer.html',
    '../Video/Apartment.mp4',
    '../Video/DumboVideo.mp4',
    '../Image/Vogar_1_Swirl.png',
    '../Image/JesterFrontCamera.jpg',
    '../Image/JesterSideCamera.jpg',
    '../Image/JesterBackCamera.jpg',
    '../Image/SF215166_GND.png',
    '../Image/SF215172_GND.png',
    '../3D/JesterWood.glb'

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
    }
    else if (mediaPath.endsWith('.html')){
      fetch(mediaPath)
        .then(response => response.text())
        .then(data => {
          mainMedia.innerHTML = data;
          initialize360Viewer();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
     else if (mediaPath.endsWith('.glb')) {
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



function initialize360Viewer(){
  const img = document.getElementById('rotatingImage');
let isDragging = false;
let isZoomed = false;
let startIndex = 0;
let threshold = 30;
let accumulatedMovement = 0;
let velocity = 0;
let velocityMagnitude = 1;
let friction = 0.9;
let offsetX = 0; 
let offsetY = 0;



img.addEventListener('mousedown', function () {
    isDragging = true;
    accumulatedMovement = 0;
});

document.addEventListener('mouseup', function () {
    isDragging = false;
});

img.addEventListener('mousemove', function (event) {
    if (isDragging) {
        if (isZoomed) {
            // If zoomed in, adjust the image's position in both x and y directions
            const containerRect = img.parentElement.getBoundingClientRect();
            const imgRect = img.getBoundingClientRect();

            offsetX = Math.min(Math.max(offsetX + event.movementX, containerRect.width - imgRect.width), 0);
            offsetY = Math.min(Math.max(offsetY + event.movementY, containerRect.height - imgRect.height), 0);

            img.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        } else {
            // If zoomed out, rotate the image as before
            accumulatedMovement += event.movementX;
            velocity = +event.movementX * velocityMagnitude;
            updateRotation();
        }
    }
});

function getFormattedIndex(index) {
    return String(index).padStart(4, '0');
}

function updateRotation() {
    while (Math.abs(accumulatedMovement) >= threshold) {
        startIndex += Math.sign(accumulatedMovement);
        accumulatedMovement -= threshold * Math.sign(accumulatedMovement);

        if (startIndex > 35) startIndex = 0;
        if (startIndex < 0) startIndex = 35;

        let formattedIndex = getFormattedIndex(startIndex);  // Get the formatted index
        img.src = `../Image/360/2k/Jester.Main Camera.${formattedIndex}.png`;
    }
}

img.addEventListener('dblclick', function () {
    let formattedIndex = getFormattedIndex(startIndex);  // Get the formatted index
    if (isZoomed) {
        // If currently zoomed in, zoom out and reset transformations
        img.style.transform = '';
        img.style.objectFit = '';
        img.style.width = ''; // Reset to original width
        img.style.height = ''; // Reset to original height
        isZoomed = false;
        offsetX = 0;
        offsetY = 0;

        // Switch back to the appropriate low-resolution image
        img.src = `../Image/360/2k/Jester.Main Camera.${formattedIndex}.png`;
    } else {
        // If currently zoomed out, zoom in
        img.style.objectFit = 'none';
        img.style.width = '200%'; // Set to desired zoom level
        img.style.height = '200%'; // Set to desired zoom level
        isZoomed = true;

        // Switch to the high-resolution image
        img.src = `../Image/360/4k/Jester.Main Camera.${formattedIndex}.png`;
    }
});


function updateImage() {
    if (!isZoomed && Math.abs(velocity) > 0.15) {
        velocity *= Math.pow(friction, velocityMagnitude);
        accumulatedMovement += velocity;
        updateRotation();
    }
}


function animate() {
    if (!isDragging) {
        updateImage();
    }
    requestAnimationFrame(animate);
}

animate();

}

// Function to initialize the Three.js viewer
function initViewer(container) {

    console.log("This is a line of text.");

  // Define the path to your local GLB model
  const modelPath = '../3D/JesterWood.glb'; // Adjust the path accordingly

  // Create a loader for GLB files
  const glbLoader = new GLTFLoader();

  // Create a scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 20);
  // camera.position.set(-0.75, 0.7, 1.25);

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
  camera.position.set(0, 1, 5);
  const environment = new RoomEnvironment(renderer);
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  scene.background = new THREE.Color(0xffffff);
  scene.environment = pmremGenerator.fromScene(environment).texture;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 0.7;
  controls.maxDistance = 10;
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

