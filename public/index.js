import * as THREE from './threejs/three.module.js';
import { STLLoader } from './threejs/STLLoader2.js';
import { OrbitControls } from './threejs/OrbitControls.js';


let scene, camera, renderer, object;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a003b);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene.add(object);

    let control = new OrbitControls(camera, renderer.domElement);

    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 10);
    scene.add(light);

    let light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(0, 0, -10);
    scene.add(light2);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

/*
let loader = new STLLoader();
loader.load('/3dmodels/mono.stl', (model)=>{
    object = new THREE.Mesh(
        model,
        new THREE.MeshLambertMaterial({color: 0x00ff00})
    );
    object.scale.set(0.1, 0.1, 0.1);
    object.position.set(0,-5,0);
    object.rotation.x = -Math.PI/2;
    init();
});

import {GLTFLoader} from './threejs/GLTFLoader.js';
const loader2 = new GLTFLoader();

loader2.load( './3dmodels/girl.glb', function ( gltf ) {

    scene.add( gltf.scene );

}, undefined, function ( error ) {

    console.error( error );

} );

let loader3 = new GLTFLoader();

loader3.load( './3dmodels/girl2.glb', function ( g ) {

    scene.add( g.scene );

}, undefined, function ( error ) {

    console.error( error );

} );
*/
//var loader = new THREE.FBXLoader();
/*
loader.load('.FBX', function (object) {


    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = false;
            child.flatshading = true;
        }
    });

    scene.add(object);
});
*/
//cargando escenario
//const material = new THREE.MeshNormalMaterial()
/*
import {FBXLoader} from './threejs/FBXLoader.js';
const fbxLoader = new FBXLoader()
fbxLoader.load('./3dmodels/update/FBX/aloe.FBX',
    function(object){
        // object.traverse(function (child) {
        //     if ((child as THREE.Mesh).isMesh) {
        //         // (child as THREE.Mesh).material = material
        //         if ((child as THREE.Mesh).material) {
        //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
        //         }
        //     }
        // })
        // object.scale.set(.01, .01, .01)
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)*/

// model
let mixer;
import {FBXLoader} from './threejs/FBXLoader.js';
const loader = new FBXLoader();
loader.load( './3dmodels/update/FBX/aloe.FBX', function ( object ) {

    mixer = new THREE.AnimationMixer( object );

    const action = mixer.clipAction( object.animations[ 0 ] );
    action.play();

    object.traverse( function ( child ) {

        if ( child.isMesh ) {

            child.castShadow = true;
            child.receiveShadow = true;

        }

    } );

    scene.add( object );

} );