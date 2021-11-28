
import * as THREE from './build/three.module.js';
import { STLLoader } from './jsm/loaders/STLLoader.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { FBXLoader } from './jsm/loaders/FBXLoader.js';

import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';

//boleanos para el uso del teclado
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

//para mover la camara
let x=100,z=100;

const raycaster = new THREE.Raycaster();
const espacio = new THREE.Vector3();
const scene = new THREE.Scene();
//creamos textura para el fondo
/*
const texture = new THREE.TextureLoader();
texture.load('atardecer.jpg', function (tex) {
    scene.background = tex;
});
*/
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(100, 40, 100);


// AUDIO

//var audioLoader = new THREE.AudioLoader();
//var listener = new THREE.AudioListener();
//var audio = new THREE.Audio(listener);
//audioLoader.load('audio/adventures-nivel.mp3', function(buffer) {
//    audio.setBuffer(buffer);
//    audio.setLoop(true);
//    audio.play();
//});

//agregamos un modelo fbx
const fbx = new FBXLoader();
/*
fbx.load('3dmodels/aloe.fbx', function (obj1) {
    obj1.position.set(0, 0, 0);
    obj1.scale.set(20, 20, 20);
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            var copiaAloe = obj1.clone();
            copiaAloe.position.set(i * 40, 0, j * 40);
            scene.add(copiaAloe);
        }
    }

});*/
/*
fbx.load('3dmodels/rock01.fbx', function (rock1) {
    rock1.scale.set(20, 20, 20);
    rock1.position.set(-50, 0, -10);
    scene.add(rock1);

    var rocknew = rock1.clone();
    rocknew.position.set(-100, 0, 50);
    //perso2=rock1;
    scene.add(rocknew)
});*/
/*
fbx.load('3dmodels/terreno.fbx', function (tierra) {
    tierra.position.set(0, -90, 0)
    scene.add(tierra);
});*/
//var grupoPersonaje=new THREE.Group();
var personew=new THREE.Group();
var perso=new THREE.Object3D();
var personajeCaminando=new THREE.Object3D();
var personajeEstatico=new THREE.Object3D();

fbx.load('3dmodels/chibi.fbx',function(personaje){
    personaje.position.set(-100,0,-100);
    perso=personaje;
    //grupoPersonaje.add(personaje);
    //sessionStorage.setItem('personaje',personaje);
    scene.add(personaje);
});
//grupoPersonaje.add(sessionStorage.getItem('personaje'));
scene.add(perso);
var loadergltf = new GLTFLoader();
loadergltf.load("3dmodels/Escenario3.gltf", function (obj) {
    obj.scene.scale.set(20,20,20);
    scene.add(obj.scene);
});
//agregamos luz
/*
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 200, 100);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 180;
dirLight.shadow.camera.bottom = - 100;
dirLight.shadow.camera.left = - 120;
dirLight.shadow.camera.right = 120;
scene.add(dirLight);*/

const directionalLight = new THREE.DirectionalLight('#ffffff', 4)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(3.5, 2, - 1.25)
scene.add(directionalLight)


renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.CineonToneMapping
renderer.toneMappingExposure = 1.75
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#211d20')

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//añadimos el controlador orbital
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 100, 0);
controls.update();

//añadimos el control del teclado
const onKeyDown = function (event) {
    console.log(event.code);
    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            console.log("adelante");
            //house.position.x += 3;
            //move=isla;
            console.log(perso.position.x);
            perso.position.x += 5;
            x+=5;
            //y+=5;
            //z+=5;
            camera.position.x=x;
            
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            console.log("izquierda");
            //house.position.z -= 3;
            //move=house;
            //move.position.z -= 5;
            perso.position.z -= 5;
            //x-=5;
            z-=5;
            camera.position.z=z;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            console.log("atras");
            //house.position.x -= 3;
            //move=isla;
            //move.position.x-= 5;
            perso.position.x -= 5;
            x-=5;
            camera.position.x=x;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            console.log("derecha");
            //house.position.z += 3;
            //move=house;
            //move.position.z += 5;
            //perso.clear();
            //perso=perso2;
            perso.position.z += 5;
            z+=5;
            camera.position.z=z;
            break;

        case 'Space':
            if (canJump === true) velocity.y += 350;
            canJump = false;
            /*
            for (var i = 0; i < 20; i++) {
                house.position.y = i;
            }
            for (var i = 20; i > 0; i--) {
                house.position.y = i;
            }*/

            break;

    }

};

const onKeyUp = function (event) {

    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }

};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
/*
function colisionBloques(){
	for (var i = 0; i < numeroCosas; i++) {
		if(Math.sqrt(Math.pow((posx - cubos[i].position.x), 2) + Math.pow((posz - cubos[i].position.z), 2)) < 100){
			 cubos[i].material.color.set( 0xff00ff );
		}
	}
}*/

const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();











/*
var audioLoader = new THREE.AudioLoader();
var listener = new THREE.AudioListener();
var audio = new THREE.Audio(listener);
audioLoader.load('audio/adventures-in-adventureland-by-kevin-macleod-from-filmmusic-io.mp3', function (buffer) {
    audio.setBuffer(buffer);
    audio.setLoop(true);
    audio.play();
});*/
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

