import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/PointerLockControls.js";

// ----- Scene -----
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// ----- Camera -----
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

// ----- Renderer -----
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("game").appendChild(renderer.domElement);

// ----- Lights -----
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// ----- Ground -----
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshPhongMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ----- Controls -----
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener("click", () => controls.lock());
scene.add(controls.getObject());

// ----- Gun -----
const gun = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 0.2, 1),
  new THREE.MeshPhongMaterial({ color: 0x333333 })
);
gun.position.set(0.5, -0.3, -1);
camera.add(gun);

// ----- Movement -----
const keys = {};
addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

function move() {
  if (keys.w) controls.moveForward(0.2);
  if (keys.s) controls.moveForward(-0.2);
  if (keys.a) controls.moveRight(-0.2);
  if (keys.d) controls.moveRight(0.2);
}

// ----- Animate -----
function animate() {
  requestAnimationFrame(animate);
  move();
  renderer.render(scene, camera);
}
animate();

// ----- Resize -----
addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
