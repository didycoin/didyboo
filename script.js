// ----- Scene, Camera, Renderer -----
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // start a bit above ground and back

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("game").appendChild(renderer.domElement);

// ----- Lighting -----
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(50, 100, 50);
scene.add(dirLight);

const ambientLight = new THREE.AmbientLight(0x888888);
scene.add(ambientLight);

// ----- Ground -----
const groundMat = new THREE.MeshPhongMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(500,500), groundMat);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// ----- First-person controls -----
const controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

// ----- Low-poly gun -----
const gun = new THREE.Mesh(
  new THREE.BoxGeometry(0.3,0.2,1),
  new THREE.MeshPhongMaterial({ color: 0x333333 })
);
gun.position.set(0.5, -0.3, -1);
camera.add(gun);
scene.add(camera);

// ----- Player movement -----
const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function movePlayer() {
  const speed = 0.3;
  if (keys['w']) controls.moveForward(speed);
  if (keys['s']) controls.moveForward(-speed);
  if (keys['a']) controls.moveRight(-speed);
  if (keys['d']) controls.moveRight(speed);
}

// ----- Animate -----
function animate() {
  requestAnimationFrame(animate);
  movePlayer();
  renderer.render(scene, camera);
}
animate();

// ----- Handle resize -----
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
