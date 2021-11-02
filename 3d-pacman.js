/**
 * 3D Pacman
 * 2021-2 Computer Graphics Term Project
 * Dept. of Software, Gachon Univ.
 */

import * as THREE from 'https://unpkg.com/three@0.108.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.108.0/examples/jsm/controls/OrbitControls.js';
import * as Utils from './js/utils.js';
import * as Maps from './js/maps.js';


/* 필수 Variable */
var world, canvas, camera, scene, renderer;

/**
 * Window OnLoad Event
 */
window.onload = function() {
	initThreeJS();
	initCannon();
	initObject();
	animate();
}

/**
 * Initilaizing Three.js
 */
function initThreeJS() {
	canvas = document.getElementById("gl-canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	window.addEventListener( 'resize', onWindowResize, false );

	renderer = new THREE.WebGLRenderer({ canvas });
	renderer.setSize(canvas.width, canvas.height);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 1, 5000 );
	camera.position.y = 30;
	camera.position.z = 300;
	scene.add( camera );

	const controls = new OrbitControls(camera, renderer.domElement);
	
	const hlight = new THREE.AmbientLight(0x404040, 30);
	scene.add(hlight);
}

/**
 * Initializing CANNON.js
 */
function initCannon() {
	world = new CANNON.World();
	world.gravity.set(0, -9.8, 0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;
}

/**
 * Initializing Object
 */
function initObject() {
	// 맵 생성
	Maps.initGachonMap(scene, world);
}

/**
 * Window Resize CallBack Function
 */
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

/**
 * Animate
 */
function animate() {
	requestAnimationFrame(animate);
	Utils.updatePhysics(world);
	renderer.render(scene, camera);
}