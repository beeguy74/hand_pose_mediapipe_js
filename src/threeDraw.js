import {
  BooleanKeyframeTrack,
    BoxBufferGeometry,
    Color,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    VideoTexture
  } from 'three';
  
function threeDraw(results, canvasElement, video){
  // Get a reference tov the container element that will hold our scene
  // const container = document.querySelector('#scene-container');
  
  // create a Scene

  const scene = new Scene();
  
  // Set the background color
  // scene.background = new Color('skyblue');
  const texture = new VideoTexture(video);
  texture.needsUpdate = true;
  scene.background = texture;
  
  // Create a camera
  const fov = 45; // AKA Field of View
  // const aspect = container.clientWidth / container.clientHeight;
  const aspect = canvasElement.width / canvasElement.height;
  const near = 0.1; // the near clipping plane
  const far = 100; // the far clipping plane
  
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  
  // every object is initially created at ( 0, 0, 0 )
  // move the camera back so we can view the scene
  camera.position.set(0, 0, 100);
  
  // create a geometry
  const geometry = new BoxBufferGeometry(1, 1, 1);
  
  // create a default (white) Basic material
  const material = new MeshBasicMaterial({color: 'black'});
  
  // create a Mesh containing the geometry and material
  const cube = new Mesh(geometry, material);
  
  // add the mesh to the scene
  scene.add(cube);
  // if (results.multiHandLandmarks.length > 0) {
  if (results.multiHandLandmarks.length > 0) {
    const hand = results.multiHandLandmarks[0];

    // for (const landmarks of results.multiHandLandmarks) {
    //   console.log("new x point of wrist!!!");
    //   console.log(landmarks[0].x);
    // }
    const wrist = hand[0];
    console.log("MEDIAPIPE X", wrist.x);
    cube.position.x = (wrist.x - 0.5) * 100;
    cube.position.y = (wrist.y - 0.5) * -100;
    cube.position.z = wrist.z;
  }
  
  // create the renderer
  // const renderer = new WebGLRenderer();
  // make a transparent background
  // var renderer = new WebGLRenderer({ canvas: canvasElement, alpha: true });
  // renderer.setClearAlpha(0.0);
  const renderer = new WebGLRenderer({ canvas: canvasElement});
  
  // next, set the renderer to the same size as our container element
  renderer.setSize(canvasElement.width, canvasElement.height);
  
  // finally, set the pixel ratio so that our scene will look good on HiDPI displays
  // renderer.setPixelRatio(window.devicePixelRatio);
  
  // add the automatically created <canvas> element to the page
  // container.append(renderer.domElement);
  
  // render, or 'create a still image', of the scene
  renderer.render(scene, camera);
}

export default threeDraw;