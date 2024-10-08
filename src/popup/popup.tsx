import React from "react";
import { createRoot } from "react-dom/client";
import "../style.css";
import Canvas from "../components/Canvas";

const App: React.FC<{}> = () => {
  return (
    <div className="w-96 h-96">
      <Canvas />
    </div>
  );
};

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
const root = createRoot(rootElement);
root.render(<App />);
