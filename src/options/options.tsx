import React from "react";
import { createRoot } from "react-dom/client";
import "../style.css";

const App: React.FC<{}> = () => {
  return (
    <div>
      <img src="icon.png" />
    </div>
  );
};

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
const root = createRoot(rootElement);
root.render(<App />);
