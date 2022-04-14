// import logo from './logo.svg';
import './App.css';
import {Hands} from '@mediapipe/hands'
import * as Handsmesh from '@mediapipe/hands'
import * as Cam from '@mediapipe/camera_utils'
import Webcam from 'react-webcam'
import {useRef, useEffect } from 'react'
// import * as THREE from 'three'
// import threeDraw from './threeWorld';
import threeWorld from './threeWorld';

// function handDraw(results, canvasCtx, drawConnectors, drawLandmarks) {
//   if (results.multiHandLandmarks) {
//     for (const landmarks of results.multiHandLandmarks) {
//       drawConnectors(canvasCtx, landmarks, Handsmesh.HAND_CONNECTIONS,
//                      {color: '#00FF00', lineWidth: 5});
//       drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
//     }
//   }
// }


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const worldRef = useRef(new threeWorld())
  var camera = null;
  // const drawConnectors = window.drawConnectors;
  // const drawLandmarks = window.drawLandmarks;

  function onResults(results){
    //not working properly without setting W, H of canvas
    canvasRef.current.width = webcamRef.current.video.videoWidth;
    canvasRef.current.height= webcamRef.current.video.videoHeight;

    // const canvasElement = canvasRef.current;
    // const canvasCtx = canvasElement.getContext('2d');
    // canvasCtx.save();
    // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.drawImage(
        // results.image, 0, 0, canvasElement.width, canvasElement.height);
    // handDraw(results, canvasCtx, drawConnectors, drawLandmarks);
    // canvasCtx.restore();
    // threeDraw(results, canvasElement, webcamRef.current.video);
    worldRef.current.update(results, canvasRef.current);
  }

  useEffect(async () => {
    const handsMesh = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    })
    handsMesh.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })
    await worldRef.current.init(canvasRef.current, webcamRef.current.video);
    
    handsMesh.onResults(onResults);

    if (typeof webcamRef.current != "undefined" && webcamRef.current != null){
      camera = new Cam.Camera(webcamRef.current.video, {
        onFrame: async() => {
          await handsMesh.send({image:webcamRef.current.video })
        },
        width: 640,
        height: 480
      });
      camera.start();
    }
  })
  return (
    <div className="App">
      Hello hands pose detection!
      <Webcam
      ref={webcamRef}
      // videoConstraints={{facingMode: "user"}} //we can choose camera direction
      style={{
        position: 'absolute',
        marginRight:'auto',
        marginLeft: '5%',
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 9,
        width:640,
        height:480,
        visibility: 'hidden'
      }}/>
      <canvas 
      ref={canvasRef}
      style={{
        position: 'absolute',
        marginRight:'auto',
        marginLeft: '5%',
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 9,
        width:640,
        height:480,
      }}/>
    </div>
  );
}

export default App;
