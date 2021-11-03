/**
 * 3D Pacman - Utils
 * 2021-2 Computer Graphics Term Project
 * Dept. of Software, Gachon Univ.
 */

import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.134.0-dfARp6tVCbGvQehLfkdx/mode=imports,min/optimized/three.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/pin/three@v0.134.0-dfARp6tVCbGvQehLfkdx/mode=imports,min/unoptimized/examples/jsm/loaders/GLTFLoader.js';

/* Setting */
const timeStep = 1/30;
export var userSpeed = 500;
export const loader = new GLTFLoader();

/* Object Dictonary */
export const object = {};

/**
 * Mesh Object Class
 */
export class worldObj {
	constructor(objName, mesh, body) {
		this.objName = objName;
		this.body = body;
		this.mesh = mesh;

		this.mesh.position.copy(body.position);
		this.mesh.quaternion.copy(body.quaternion);

		this.add = function(scene, world) {
			scene.add(this.mesh);
			world.add(this.body);
		}

		this.position = function(x, y, z) {
			this.mesh.position.set(x, y, z);
			this.body.position.set(x, y, z);
		}

		this.rotateX = function(angle) {
			var axis = new CANNON.Vec3(1, 0, 0);
			this.mesh.rotateX(angle * Math.PI / 180);
			this.body.quaternion.setFromAxisAngle(axis, angle * Math.PI / 180);
		}

		this.rotateY = function(angle) {
			var axis = new CANNON.Vec3(0, 1, 0);
			this.mesh.rotateY(angle * Math.PI / 180);
			this.body.quaternion.setFromAxisAngle(axis, angle * Math.PI / 180);
		}

		this.rotateZ = function(angle) {
			var axis = new CANNON.Vec3(0, 0, 1);
			this.mesh.rotateZ(angle * Math.PI / 180);
			this.body.quaternion.setFromAxisAngle(axis, angle * Math.PI / 180);
		}
		
		this.update = function() {
			this.mesh.position.copy(body.position);
			this.mesh.quaternion.copy(body.quaternion);
		}
	}
}

/**
 * 신규 Object 추가
 * @param {String} objName 
 * @param {THREE.Mesh} geometry 
 * @param {CANNON.Body} body 
 */
export function createNewObject(scene, world, objName, mesh, body) {
    var newObj = new worldObj(objName, mesh, body);
    newObj.add(scene, world);
	object[objName] = newObj; 
}

/**
 * 팩맨 캐릭터 생성
 * @param {THREE.Scene} scene 
 * @param {CANNON.World} world 
 * @param {X} posx 
 * @param {Y} posy 
 * @param {Z} posz 
 */
export function createPacman(scene, world, posx, posy, posz) {
	var pacmanMesh = new THREE.Mesh(new THREE.SphereGeometry(180, 32, 16), new THREE.MeshBasicMaterial({ color: 0xffd400 }))
	var pacmanBody = new CANNON.Body({ 
		shape: new CANNON.Sphere(180),
		collisionFilterGroup: 1,
		angularDamping: 1,
		collisionFilterMask: 2 | 4 | 8, // 2번 바닥 4번 벽 8번 고스트 시작 벽
		mass: 3
	});
	
	createNewObject(scene, world, 'pacman', pacmanMesh, pacmanBody);
	object['pacman'].position(posx, posy, posz);
}

/**
 * 벽 생성
 * @param {THREE.Scene} scene 
 * @param {CANNON.World} world 
 * @param {String} wallname 
 * @param {String (Color Hex Code, 0xFFFFFF)} wallcolor 
 * @param {X} x 
 * @param {Y} y 
 * @param {Z} z 
 */
export function createWallObject(scene, world, wallname, wallcolor, x, y, z) {
	var wallBody = new CANNON.Body({
		shape: new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, z / 2)),
		collisionFilterGroup: 4,
		type: 1000,
		mass: 0
	});
	createNewObject(scene, world, wallname, new THREE.Mesh(new THREE.BoxGeometry(x, y, z), new THREE.MeshBasicMaterial({ color: wallcolor})), wallBody);
}

/**
 * 고스트 시작 위치 벽 생성
 * @param {THREE.Scene} scene 
 * @param {CANNON.World} world 
 * @param {String} wallname 
 * @param {X} x 
 * @param {Y} y 
 * @param {Z} z 
 */
 export function createStartWallObject(scene, world, wallname, x, y, z) {
	var wallBody = new CANNON.Body({
		shape: new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, z / 2)),
		collisionFilterGroup: 8,
		mass: 0
	});
	createNewObject(scene, world, wallname, new THREE.Mesh(new THREE.BoxGeometry(x, y, z), new THREE.MeshBasicMaterial({ color: 0xffd400})), wallBody);
}

/**
 * User Event Listener 등록
 * @param {worldObj} userObject 
 */
export function setUserEvent(userObject) {
	// Key를 올렸을 때
	document.addEventListener("keydown", function(event) {
		switch(event.key) {
			case "W":
			case "w":
				userObject.body.angularDamping = 0;
				userObject.body.velocity.set(0, 0, -userSpeed);
				console.log(userObject.body);
				break;
			case "S":
			case "s":
				userObject.body.angularDamping = 0;
				userObject.body.velocity.set(0, 0, userSpeed);
				break;
			case "A":
			case "a":
				userObject.body.angularDamping = 0;
				userObject.body.velocity.set(-userSpeed, 0, 0);
				break;
			case "D":
			case "d":
				userObject.body.angularDamping = 0;
				userObject.body.velocity.set(userSpeed, 0, 0);
				break;
		}
	});

	// Key를 뗐을 때 
	document.addEventListener("keyup", function(event) {
		switch(event.key) {
			case "W":
			case "w":
			case "S":
			case "s":
			case "A":
			case "a":
			case "D":
			case "d":
				userObject.body.velocity.set(0, 0, 0);
				userObject.body.angularDamping = 1;
				break;
			default:
				break;
		}
	});

	// Collide Event
	userObject.body.addEventListener("collide", function(e) {
		// 부딪힌 Object Type 확인
		if(e.body.type == 1000) {
			console.log("Collide with Walls!");
		}
	});
}

/**
 * Global Event Listener 삭제
 */
export function removeGlobalEventListener() {
	document.onkeydown = null;
	document.onkeyup = null;
}

/**
 * Scene 초기화
 * @param {THREE.Scene} scene 
 */
export function resetScene(scene, objList) {
	scene.remove.apply(scene, scene.children);
	removeGlobalEventListener();
	for (var item in objList) delete objList[item];
}

/**
 * 상자 만들기
 * @param {THREE.Scene} scene 
 * @param {CANNON.World} world 
 * @param {Object Name} name 
 * @param {X} x 
 * @param {Y} y 
 * @param {G} z 
 * @param {Color} sur_color 
 * @param {collisionFilterGroup} collisionFilterGroup_val 
 * @param {mass} mass_val 
 */
export function makeBox(scene, world, name, x, y, z, sur_color, collisionFilterGroup_val, mass_val) {
	var boxShape = new CANNON.Box(new CANNON.Vec3(x/2, y/2, z/2));
	var boxBody = new CANNON.Body({
	   shape: boxShape,
	   collisionFilterGroup: collisionFilterGroup_val,
	   mass: mass_val
	});
	addNewObject(scene, world, name, new THREE.Mesh(new THREE.BoxGeometry(x, y, z), new THREE.MeshBasicMaterial({ color:  sur_color})), boxBody);
 }

/**
 * Update Physical Engine 
 */
export function updatePhysics(world) {
	// Step the physics world
	world.step(timeStep);

	Object.keys(object).forEach(function(key) {
		object[key].update();
	});
}
