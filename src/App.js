import logo from './logo.svg';
import './App.css';
import {Hands} from '@mediapipe/hands'
import * as Handsmesh from '@mediapipe/hands'
import * as Cam from '@mediapipe/camera_utils'
import Webcam from 'react-webcam'
import {useRef, useEffect } from 'react'

function handDraw(results, canvasCtx, drawConnectors, drawLandmarks) {
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, Handsmesh.HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }

  // if (results.multiFaceLandmarks) {
  //   for (const landmarks of results.multiFaceLandmarks) {
  //     drawConnectors(canvasCtx, landmarks, Handsmesh.FACEMESH_TESSELATION,
  //                     {color: '#C0C0C070', lineWidth: 1});
  //     drawConnectors(canvasCtx, landmarks, Handsmesh.FACEMESH_RIGHT_EYE, {color: '#FF3030'});
  //     drawConnectors(canvasCtx, landmarks, Handsmesh.FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
  //     drawConnectors(canvasCtx, landmarks, Handsmesh.FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
  //     drawConnectors(canvasCtx, landmarks, Handsmesh.FACEMESH_LEFT_EYE, {color: '#30FF30'});
  //     drawConnectors(canvasCtx, landmarks, Handsmesh.FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
  //     drawConnectors(canvasCtx, landmarks, Handsmesh.FACEMESH_LEFT_IRIS, {color: '#30FF30'});
  //     drawConnectors(canvasCtx, landmarks, Handsmesh.FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
  //     drawConnectors(canvasCtx, landmarks, Handsmesh.FACEMESH_LIPS, {color: '#E0E0E0'});
  //   }
  // }
}

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var camera = null;
  const drawConnectors = window.drawConnectors;
  const drawLandmarks = window.drawLandmarks;

  function onResults(results){
    //not working properly without setting W, H of canvas
    canvasRef.current.width = webcamRef.current.video.videoWidth;
    canvasRef.current.height= webcamRef.current.video.videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    handDraw(results, canvasCtx, drawConnectors, drawLandmarks);


    canvasCtx.restore();
  }

  useEffect(() => {
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
        height:480
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
        height:480
      }}/>
    </div>
  );
}

export default App;
