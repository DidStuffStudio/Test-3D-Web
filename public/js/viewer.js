import * as THREE from 'three';


import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';


let camera, scene, renderer, controls;

let modelName;


function loadLocalModel() {
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onStart = function (url, item, total) {
        // Show loading progress or loading overlay if needed
    }

    loadingManager.onLoad = function () {
        // Hide loading progress or loading overlay if needed
    }

    // Define the path to your local GLB model
    const modelPath = '../3D/JesterOptomised.glb';

    // Create a loader for GLB files
    const glbLoader = new GLTFLoader(loadingManager);

    // Load the GLB model
    glbLoader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        // Traverse through all meshes in the model and apply the material
        model.traverse((node) => {
            if (node.isMesh) {
                node.material = material;
            }
        });
        scene.add(model);
    });

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
    }
}

// Call the function to load the local model
loadLocalModel();







function onWindowResize() {

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);

}






