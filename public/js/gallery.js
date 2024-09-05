import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';


let camera, scene, renderer, controls;
let mainMedia;
let is360ViewerLoaded = false;

let mediaSources = [
  'Image/Bond_ArmChair_45Degree.jpg',
  'Image/240821_JF_hero shot Irvine sofa.jpg',
  'html/360_Viewer.html',
  'Video/Apartment.mp4',
  'Video/TrueImageLabs_VideoShowcase.mp4',
  'Image/Vogar_1_Swirl.png',
  'Image/Bond_ArmChair_Front.jpg',
  'Image/Bond_ArmChair_Side.jpg',
  'Image/Bond_Drawing.png',
  '3D/Bond.glb',
  'Image/Vogar_1_Swirl.jpg',
  'Image/Vogar_1_Swirl.png',
  'Image/Vogar_2_Swirl.jpg',
];

let currentIndex = 0;


document.addEventListener('DOMContentLoaded', function () {
  mainMedia = document.getElementById('mainMedia');
  const thumbnailItems = document.querySelectorAll('.thumbnail-item');
  // const prevButton = document.getElementById('prevButton');
  // const nextButton = document.getElementById('nextButton');


  // Add click event listeners to thumbnails
  thumbnailItems.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      showMedia(index);
    });

  });

  // // Event listeners for previous and next buttons
  // prevButton.addEventListener('click', () => {
  //   currentIndex = (currentIndex - 1 + mediaSources.length) % mediaSources.length;
  //   showMedia(currentIndex);
  // });

  // nextButton.addEventListener('click', () => {
  //   currentIndex = (currentIndex + 1) % mediaSources.length;
  //   showMedia(currentIndex);
  // });

  // Initial display of media
  showMedia(currentIndex);
});


function showMedia(index) {
  const mediaPath = mediaSources[index];
  showLoading();

  // Clear existing media content except color thumbnails
  const mainMediaContent = document.querySelector('#mainMedia > img, #mainMedia > video, #mainMedia > canvas');
  if (mainMediaContent) {
    mainMediaContent.remove();
  }
  if(is360ViewerLoaded){
    mainMedia.innerHTML = '<div class="loading-overlay" id="loadingOverlay"><div class="spinner"></div><p>Loading...</p></div><div id="colorThumbnails"></div>';
    is360ViewerLoaded = false;
  }

  // Media handling logic (image, video, 360 viewer, 3D viewer)
  if (mediaPath.endsWith('.jpg') || mediaPath.endsWith('.png')) {
    const img = document.createElement('img');
    img.src = mediaPath;
    img.alt = 'Image';
    img.style.filter = "blur(10px)";
    mainMedia.appendChild(img);
    img.onload = function () {
      img.style.filter = 'blur(0px)';
      hideLoading();
    };

    if (mediaPath.endsWith('Vogar_1_Swirl.png') || mediaPath.endsWith('Vogar_1_Swirl.jpg') || mediaPath.endsWith('Vogar_2_Swirl.jpg')) {
      appendColorThumbnails();
    } else {
      clearColorThumbnails();
    }
  } else if (mediaPath.endsWith('.mp4')) {
    const video = document.createElement('video');
    video.src = mediaPath;
    video.controls = true;
    mainMedia.appendChild(video);
    video.onloadeddata = function () {
      hideLoading();
    };
    clearColorThumbnails();
  } else if (mediaPath.endsWith('.html')) {
    fetch(mediaPath)
      .then(response => response.text())
      .then(data => {
        preload360Images(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    clearColorThumbnails();
  } else if (mediaPath.endsWith('.glb')) {
    initViewer(mainMedia);
    clearColorThumbnails();
  }

  currentIndex = index;
}

function appendColorThumbnails() {
  const colorThumbnailsDiv = document.getElementById('colorThumbnails');
  colorThumbnailsDiv.innerHTML = ''; // Clear previous thumbnails if any

  const colors = ['Vogar_1_Swirl.jpg', 'Vogar_1_Swirl.png', 'Vogar_2_Swirl.jpg'];
  colors.forEach(color => {
    const thumbnail = document.createElement('img');
    thumbnail.src = `Image/${color}`;
    thumbnail.alt = 'Color Thumbnail';
    thumbnail.classList.add('color-thumbnail');
    thumbnail.addEventListener('click', () => {
      showMedia(mediaSources.length - colors.length + colors.indexOf(color));
    });
    colorThumbnailsDiv.appendChild(thumbnail);
  });
}

function clearColorThumbnails() {
  const colorThumbnailsDiv = document.getElementById('colorThumbnails');
  colorThumbnailsDiv.innerHTML = '';
}



function getFormattedIndex(index) {
  return String(index).padStart(4, '0');
}

function showLoading() {
  const loadingScreen = document.getElementById('loadingOverlay');
  if(!loadingScreen) return;
  loadingScreen.style.display = 'flex';
  loadingScreen.style.zIndex = 10000;
  mainMedia.appendChild(loadingScreen);
}

function hideLoading() {
  const loadingScreen = document.getElementById('loadingOverlay');
  if(!loadingScreen) return;
  loadingScreen.style.display = 'none';
  loadingScreen.style.zIndex = -50;
}


function imageLoaded(img) {
  


  // img.style.filter = 'blur(0px)';
  // hideLoading();

  // For testing
  //setTimeout(function(){
    img.style.filter = 'blur(0px)';
    hideLoading();
  //}, 1000)

}


function preload360Images(data) {

  var totalImages = 35;
  var loadedCount = 0; // Counter to track the number of loaded images

  const placeholderImg = document.createElement('img');
  placeholderImg.src = "Image/360/Bond/Bond_0000.jpg";
  placeholderImg.alt = 'Image';
  placeholderImg.style.filter = "blur(10px)";
  mainMedia.appendChild(placeholderImg);

  function imageLoaded() {
    loadedCount++; // Increment the counter each time an image loads
    if (loadedCount === totalImages) { // Check if all images have loaded
      htmlLoaded(data); // If so, call htmlLoaded(data)
    }
  }

  for (var i = 0; i < totalImages; i++) {
    let formattedIndex = getFormattedIndex(i);
    var img = new Image();
    img.src = `Image/360/Bond/Bond_${formattedIndex}.jpg`;
    img.onload = imageLoaded; // Set imageLoaded as the onload event handler
  }
}


function htmlLoaded(data) {
  console.log("html loaded");
  mainMedia.innerHTML = data;
  hideLoading();
  initialize360Viewer(data);


  // setTimeout(function () {
  //   mainMedia.innerHTML = '';
  //   mainMedia.innerHTML = data;
  //   hideLoading();
  //   initialize360Viewer(data);
  // }, 1000)

}



function initialize360Viewer(data) {


  const img = document.getElementById('rotatingImage');
  const container = document.getElementById('imageContainer');

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


  function updateRotation() {
    while (Math.abs(accumulatedMovement) >= threshold) {
      startIndex -= Math.sign(accumulatedMovement);
      accumulatedMovement -= threshold * Math.sign(accumulatedMovement);

      if (startIndex > 35) startIndex = 0;
      if (startIndex < 0) startIndex = 35;

      let formattedIndex = getFormattedIndex(startIndex);  // Get the formatted index
      img.src = `Image/360/Bond/Bond_${formattedIndex}.jpg`;
    }
  }

  
  img.scale = 1;

  img.addEventListener('dblclick', function () {
    let formattedIndex = getFormattedIndex(startIndex);  
    if (isZoomed) {

      img.src = `Image/360/Bond/Bond_${formattedIndex}.jpg`;
      img.style.transform = 'scale(1)';
      img.scale = 1;
      isZoomed = false;
      img.style.cursor = "Grab";
      img.style.left ='0px';
      img.style.top = '0px';
      
    } else {
      showLoading();

      // setTimeout(function () {


        img.src = `Image/360/Bond/Bond_${formattedIndex}.jpg`;
        img.style.transform = 'scale(5)';
        img.scale = 5;
        isZoomed = true;
        img.style.cursor = "Move";
        
        img.onload = function () {
          hideLoading();
        }
      // }
      //   , 1000)
    }
  });


  let startX, startY, initialLeft, initialTop;

img.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    const style = window.getComputedStyle(img);
    initialLeft = parseInt(style.left, 10);
    initialTop = parseInt(style.top, 10);
    
    document.addEventListener('mousemove', onMouseMove);
});





function onMouseMove(event) {
  if (isDragging && isZoomed) {
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    console.log('Delta:', deltaX, deltaY);

    const maxLeft = container.offsetWidth*2;
    const maxTop = container.offsetHeight*2;

    console.log('Max:', maxLeft, maxTop);

    let newLeft = initialLeft + deltaX;
    let newTop = initialTop + deltaY;
    console.log('New:', newLeft, newTop);
    if(newLeft < -maxLeft) newLeft = -maxLeft;
    else if (newLeft > maxLeft) newLeft = maxLeft;
    if(newTop < -maxTop) newTop = -maxTop;
    else if (newTop > maxTop) newTop = maxTop;

    img.style.left = newLeft + 'px';
    img.style.top = newTop + 'px';
}
  else if(isDragging){
    // If zoomed out, rotate the image as before
    accumulatedMovement += event.movementX;
    velocity = +event.movementX * velocityMagnitude;
    updateRotation();
  }
};

document.addEventListener('mouseup', () => {
  isDragging = false;
  document.removeEventListener('mousemove', onMouseMove);
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
  is360ViewerLoaded = true;

}


function initViewer(container) {

  // Define the path
  const modelPath = '3D/Bond.glb'; // Adjust the path accordingly

  // Create a loader
  const glbLoader = new GLTFLoader();

  // Create a scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 20);
  // camera.position.set(-0.75, 0.7, 1.25);

  // Create a renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMappingExposure = 0;
  container.appendChild(renderer.domElement);


  const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
  keyLight.position.set(-1, 2, 2);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(1, 1, 2);
  scene.add(fillLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
  backLight.position.set(0, 0.5, -1.5);
  scene.add(backLight);

  // Load the GLB model
  glbLoader.load(modelPath, (gltf) => {
    const model = gltf.scene;
    // Traverse through all meshes in the model and apply the material
    model.traverse((node) => {
      if (node.isMesh) {
        // Replace material
        //node.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        node.material.envMapIntensity = 0;
        node.material.toneMapped = false;
      }
    });
    scene.add(model);
    // Adjust camera position and controls
    camera.position.set(0, 1, 2);
    // const environment = new RoomEnvironment(renderer);
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    scene.background = new THREE.Color(0xeeeeee);
    // scene.environment = pmremGenerator.fromScene(environment).texture;
    
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
    hideLoading();

    // Render the scene
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
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

