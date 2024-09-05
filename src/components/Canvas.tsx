import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import usePoseEstimation from "../hooks/usePoseEstimation";
import usePoseDraw from "../hooks/usePoseDraw";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core"; // Make sure this is imported
import "@tensorflow/tfjs-backend-webgl";
import useDisplayCanvasText from "../hooks/useDisplayCanvasText";
import useSetBackend from "../hooks/useSetBackend";
import Loader from "./Loader";

// Assuming these types are exported from your custom hooks
//import { WebcamRef } from "../hooks/usePoseEstimation";

const Canvas: React.FC = () => {
  const [currentColor, setCurrentColor] = useState<"red" | "green">("red");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { backendReady } = useSetBackend();

  const { webcamRef, pose, isLoading, setIsLoading } =
    usePoseEstimation(backendReady);

  //   const textConfig = {
  //     text: "Loading...",
  //   };

  //   useDisplayCanvasText(canvasRef, isLoading, textConfig);
  const handleCanvasClick = () => {
    setCurrentColor((prevColor) => (prevColor === "red" ? "green" : "red"));
  };

  const calculateColors = (pose: poseDetection.Pose | null): string => {
    return currentColor;
  };

  const [start, setStart] = useState<boolean>(true);

  const handleStart = () => {
    setStart((previous) => !previous);
    setIsLoading((prevoius) => !prevoius);
  };

  usePoseDraw({
    pose,
    videoRef: webcamRef,
    canvasRef,
    calculateColors,
  });

  return (
    <div
      className="rounded-md w-4/5 h-4/5 p-4 fixed top-10 left-28 bg-customGray bg-opacity-80 z-[1000] flex items-center justify-center"
      onClick={handleCanvasClick}
    >
      {backendReady ? (
        <>
          <button
            onClick={handleStart}
            className="absolute bottom-5 left-5 z-10"
          >
            {start ? "Stop" : "Start"}
          </button>
          {start && (
            <>
              {isLoading && <Loader />}
              <Webcam
                ref={webcamRef as React.Ref<Webcam>}
                mirrored={true}
                className="absolute top-0 left-0 w-full h-full"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
            </>
          )}
        </>
      ) : (
        <p>Setting up TensorFlow backend...</p>
      )}
    </div>
  );
};

export default Canvas;
