import logo from './logo.svg';
import './App.css';
import {FaceMesh} from '@mediapipe/face_mesh'
import * as Facemesh from '@mediapipe/face_mesh'
import * as Cam from '@mediapipe/camera_utils'
import Webcam from 'react-webcam'
import {useRef, useEffect } from 'react'

function App() {
  return (
    <div className="App">
      Hello hands pose detection!
      <Webcam style={{
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
      <canvas style={{
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
