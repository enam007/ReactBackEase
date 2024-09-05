import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Canvas from "../components/Canvas";
import "../style.css";

const App: React.FC<{}> = () => {
  return (
    <div className="p-4 m-4">
      <Canvas />
    </div>
  );
};

const rootElement = document.createElement("div");
rootElement.style.width = "100vw";
rootElement.style.height = "100vh";
rootElement.style.position = "fixed";
rootElement.style.top = "0";
rootElement.style.left = "0";
rootElement.style.zIndex = "1000";
document.body.appendChild(rootElement);
const root = createRoot(rootElement);
root.render(<App />);
