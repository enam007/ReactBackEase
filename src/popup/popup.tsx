import React from "react";
import { createRoot } from "react-dom/client";
import "../style.css";

const App: React.FC<{}> = () => {
  return (
    <div>
      <h1 className="text-4xl text-blue-700">My Webpack + Tailwind App</h1>
      <img src="icon.png" />
    </div>
  );
};

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
const root = createRoot(rootElement);
root.render(<App />);
