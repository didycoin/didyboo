import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/PointerLockControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.getElementById("game").appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshPhongMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener("click", () => controls.lock());
scene.add(controls.getObject());

const gun = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 0.2, 1),
  new THREE.MeshPhongMaterial({ color: 0x333333 })
);
gun.position.set(0.5, -0.3, -1);
camera.add(gun);

const keys = {};
addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

function move() {
  if (keys.w) controls.moveForward(0.2);
  if (keys.s) controls.moveForward(-0.2);
  if (keys.a) controls.moveRight(-0.2);
  if (keys.d) controls.moveRight(0.2);
}

function animate() {
  requestAnimationFrame(animate);
  move();
  renderer.render(scene, camera);
}
animate();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
