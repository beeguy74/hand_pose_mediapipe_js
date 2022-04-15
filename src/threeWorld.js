import {
    BoxBufferGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    VideoTexture,
    AmbientLight,
    DirectionalLight
  } from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class threeWorld{
  constructor(){
    // create a Scene
    this.scene = new Scene();

    // create some lights
    const ambientLight = new AmbientLight('white', 3);
    const mainLight = new DirectionalLight('white', 5);
    mainLight.position.set(10, 10, 10);
    this.scene.add(ambientLight, mainLight);
    
    
    // Create a camera
    const fov = 45; // AKA Field of View
    const aspect = 640 / 480;
    const near = 0.1; // the near clipping plane
    const far = 100; // the far clipping plane
    this.camera = new PerspectiveCamera(fov, aspect, near, far);
    
    // every object is initially created at ( 0, 0, 0 )
    // move the this.camera back so we can view the this.scene
    this.camera.position.set(0, 0, 1);
  }

  setupModel(data) {
    const model = data.scene.children[0];
    return model;
  }


  async init(canvasElement, video){
    const texture = new VideoTexture(video);
    texture.needsUpdate = true;
    this.scene.background = texture;

    const loader = new GLTFLoader();
    const loadedData = await loader.loadAsync('http://localhost:3000/obj/DigitalWristwatch.gltf');
    console.log(loadedData);

    this.modelWatch = this.setupModel(loadedData);
    // add the model to the this.scene. setTimeout for load textures properly
    setTimeout(() => { this.scene.add(this.modelWatch);}, 4000);

    // create the renderer
    // next, set the this.renderer to the same size as our container element
    this.renderer = new WebGLRenderer({ canvas: canvasElement});
    this.renderer.setSize(canvasElement.width, canvasElement.height);

    // render, or 'create a still image', of the this.scene
    this.renderer.render(this.scene, this.camera);
    // finally, set the pixel ratio so that our this.scene will look good on HiDPI displays
    // this.renderer.setPixelRatio(window.devicePixelRatio);
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
      this.modelWatch.position.x = (wrist.x - 0.5);
      this.modelWatch.position.y = (wrist.y - 0.5) * -1;
      this.modelWatch.position.z = wrist.z;
    }
    this.renderer.setSize(canvasElement.width, canvasElement.height);
    this.renderer.render(this.scene, this.camera);
  }
}

export default threeWorld;