import {
  BooleanKeyframeTrack,
    BoxBufferGeometry,
    Color,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    VideoTexture,
  } from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class threeWorld{
  constructor(){
    // Get a reference tov the container element that will hold our this.scene
    // const container = document.querySelector('#this.scene-container');
    
    // create a Scene

    this.scene = new Scene();
    
    // Set the background color
    // this.scene.background = new Color('skyblue');
    
    // Create a this.camera
    const fov = 45; // AKA Field of View
    // const aspect = container.clientWidth / container.clientHeight;
    // const aspect = canvasElement.width / canvasElement.height;
    const aspect = 640 / 480;
    const near = 0.1; // the near clipping plane
    const far = 100; // the far clipping plane
    
    this.camera = new PerspectiveCamera(fov, aspect, near, far);
    
    // every object is initially created at ( 0, 0, 0 )
    // move the this.camera back so we can view the this.scene
    this.camera.position.set(0, 0, 1);
    
    // create a geometry
    const geometry = new BoxBufferGeometry(0.01, 0.01, 0.01);
    
    // create a default (white) Basic material
    const material = new MeshBasicMaterial({color: 'black'});
    
    // create a Mesh containing the geometry and material
    this.cube = new Mesh(geometry, material);
    
    // add the mesh to the this.scene
    this.scene.add(this.cube);
    // if (results.multiHandLandmarks.length > 0) {
    
    
    // create the this.renderer
    // const this.renderer = new WebGLRenderer();
    // make a transparent background
    // var this.renderer = new WebGLRenderer({ canvas: canvasElement, alpha: true });
    // this.renderer.setClearAlpha(0.0);
    
    // next, set the this.renderer to the same size as our container element
    
    // finally, set the pixel ratio so that our this.scene will look good on HiDPI displays
    // this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // add the automatically created <canvas> element to the page
    // container.append(this.renderer.domElement);
    
    // render, or 'create a still image', of the this.scene
  }

  setupModel(data) {
    const model = data;
    return model;
  }

  async init(canvasElement, video){
    const texture = new VideoTexture(video);
    texture.needsUpdate = true;
    this.scene.background = texture;

    const loader = new GLTFLoader();
    const loadedData = await loader.loadAsync('../obj/DigitalWristwatch.gltf');
    const { watchMesh } = this.setupModel(loadedData);
    this.cube = watchMesh;
    this.scene.add(this.cube);
    

    this.renderer = new WebGLRenderer({ canvas: canvasElement});
    this.renderer.setSize(canvasElement.width, canvasElement.height);
    this.renderer.render(this.scene, this.camera);
  }

  update(results, canvasElement) {
    if (results.multiHandLandmarks.length > 0) {
      const wrist = results.multiHandLandmarks[0][0];

      // for (const landmarks of results.multiHandLandmarks) {
      //   console.log("new x point of wrist!!!");
      //   console.log(landmarks[0].x);
      // }
      // const wrist = hand[0];
      // console.log("MEDIAPIPE X", wrist.x);
      this.cube.position.x = (wrist.x - 0.5);
      this.cube.position.y = (wrist.y - 0.5) * -1;
      this.cube.position.z = wrist.z;
    }
    this.renderer.setSize(canvasElement.width, canvasElement.height);
    this.renderer.render(this.scene, this.camera);
  }
}

export default threeWorld;