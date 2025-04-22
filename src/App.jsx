import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import "./styles/App.css";
import StoreHUD from "./components/StoreHUD";
import UserHUD from "./components/UserHUD";

const App = () => {
  return (
    <>
      <UserHUD />
      <StoreHUD />
      <div className="canvas-container">
        <Canvas camera={{ fov: 70, position: [5, 5, 5] }}>
          <Scene />
        </Canvas>
      </div>
    </>
  );
};

export default App;
