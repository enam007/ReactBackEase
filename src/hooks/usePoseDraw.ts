import { useEffect } from "react";
import { drawPose } from "../utils/draw";
import * as poseDetection from "@tensorflow-models/pose-detection";

interface UsePoseDrawProps {
  pose: poseDetection.Pose | null;
  videoRef: React.RefObject<{ video: HTMLVideoElement }>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  calculateColors: (pose: poseDetection.Pose) => string;
}

const usePoseDraw = ({
  pose,
  videoRef,
  canvasRef,
  calculateColors,
}: UsePoseDrawProps): void => {
  useEffect(() => {
    if (pose && videoRef.current && canvasRef.current) {
      drawPose({
        pose,
        videoRef,
        color: calculateColors(pose),
        canvasRef,
      });
    }
  }, [pose, videoRef, canvasRef, calculateColors]);
};

export default usePoseDraw;
