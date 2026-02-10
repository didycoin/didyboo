// Bigger map
const groundGeometry = new THREE.PlaneGeometry(500, 500); // massive map
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 100, 50);
scene.add(light);

// First-person controls
const controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

// Position camera at player height
camera.position.set(0, 2, 0); // 2 units tall

// Low-poly gun
const gunGeometry = new THREE.BoxGeometry(0.3, 0.2, 1); // simple gun shape
const gunMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
const gun = new THREE.Mesh(gunGeometry, gunMaterial);
gun.position.set(0.5, -0.3, -1); // in front of camera
camera.add(gun);
scene.add(camera); // attach camera to scene

// Player movement
const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function movePlayer() {
  const speed = 0.3;
  if (keys["w"]) controls.moveForward(speed);
  if (keys["s"]) controls.moveForward(-speed);
  if (keys["a"]) controls.moveRight(-speed);
  if (keys["d"]) controls.moveRight(speed);
}

// Shooting
const bullets = [];
document.addEventListener('click', () => {
  const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  bullet.position.copy(camera.position);
  bullet.quaternion.copy(camera.quaternion);
  bullet.velocity = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).multiplyScalar(1);
  bullets.push(bullet);
  scene.add(bullet);
});

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].position.add(bullets[i].velocity);
    if (bullets[i].position.length() > 500) { // remove bullets far away
      scene.remove(bullets[i]);
      bullets.splice(i, 1);
    }
  }
}

// Animate loop
function animate() {
  requestAnimationFrame(animate);
  movePlayer();
  updateBullets();
  renderer.render(scene, camera);
}
animate();

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("game").appendChild(renderer.domElement);

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
