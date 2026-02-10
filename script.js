// ----- Scene, Camera, Renderer -----
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky blue

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 0); // eye height

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("game").appendChild(renderer.domElement);

// ----- Controls -----
const controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

// ----- Ground (massive map) -----
const groundGeometry = new THREE.PlaneGeometry(500, 500);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ----- Lighting -----
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 100, 50);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

// ----- Low-poly gun -----
const gunGeometry = new THREE.BoxGeometry(0.3, 0.2, 1);
const gunMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
const gun = new THREE.Mesh(gunGeometry, gunMaterial);
gun.position.set(0.5, -0.3, -1);
camera.add(gun);
scene.add(camera);

// ----- Trees / Obstacles -----
const treeGeometry = new THREE.ConeGeometry(1, 3, 6);
const treeMaterial = new THREE.MeshPhongMaterial({ color: 0x006400 });
for (let i = 0; i < 50; i++) {
  const tree = new THREE.Mesh(treeGeometry, treeMaterial);
  tree.position.set(
    Math.random() * 400 - 200,
    1.5,
    Math.random() * 400 - 200
  );
  scene.add(tree);
}

// ----- Player movement -----
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

// ----- Shooting -----
const bullets = [];
document.addEventListener('click', () => {
  const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  bullet.position.copy(camera.position);
  bullet.quaternion.copy(camera.quaternion);
  bullet.velocity = new THREE.Vector3(0, 0, -1)
    .applyQuaternion(camera.quaternion)
    .multiplyScalar(1.5);
  bullets.push(bullet);
  scene.add(bullet);
});

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].position.add(bullets[i].velocity);
    if (bullets[i].position.length() > 500) {
      scene.remove(bullets[i]);
      bullets.splice(i, 1);
    }
  }
}

// ----- Zombies -----
const zombies = [];
const zombieGeometry = new THREE.BoxGeometry(1, 2, 1);
const zombieMaterial = new THREE.MeshPhongMaterial({ color: 0x800000 });
for (let i = 0; i < 10; i++) {
  const zombie = new THREE.Mesh(zombieGeometry, zombieMaterial);
  zombie.position.set(
    Math.random() * 400 - 200,
    1,
    Math.random() * 400 - 200
  );
  zombies.push(zombie);
  scene.add(zombie);
}

let playerHealth = 100;

// ----- Zombie AI -----
function updateZombies() {
  const speed = 0.02;
  zombies.forEach(zombie => {
    const dir = new THREE.Vector3().subVectors(camera.position, zombie.position);
    dir.y = 0;
    dir.normalize();
    zombie.position.add(dir.multiplyScalar(speed));

    // Damage if close
    if (zombie.position.distanceTo(camera.position) < 1.5) {
      playerHealth -= 0.1;
    }

    // Check bullets
    bullets.forEach((bullet, i) => {
      if (bullet.position.distanceTo(zombie.position) < 1) {
        scene.remove(zombie);
        zombies.splice(zombies.indexOf(zombie), 1);
        scene.remove(bullet);
        bullets.splice(i, 1);
      }
    });
  });
}

// ----- HUD -----
const healthDiv = document.createElement("div");
healthDiv.style.position = "absolute";
healthDiv.style.top = "10px";
healthDiv.style.left = "10px";
healthDiv.style.color = "red";
healthDiv.style.fontSize = "20px";
healthDiv.innerText = `Health: ${playerHealth}`;
document.body.appendChild(healthDiv);

// ----- Animate loop -----
function animate() {
  requestAnimationFrame(animate);
  movePlayer();
  updateBullets();
  updateZombies();
  healthDiv.innerText = `Health: ${Math.max(0, Math.floor(playerHealth))}`;
  renderer.render(scene, camera);
}
animate();

// ----- Handle window resize -----
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
