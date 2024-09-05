import { useEffect, useState, useRef } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";

interface WebcamRef {
  video: HTMLVideoElement;
}

const usePoseEstimation = (backendReady: boolean) => {
  const webcamRef = useRef<WebcamRef | null>(null);
  const [pose, setPose] = useState<poseDetection.Pose | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log(backendReady);
    if (!backendReady) return;
    const runPosenet = async () => {
      const detectorConfig: poseDetection.MoveNetModelConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
      };
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
      setIsLoading(false);
      const detect = async () => {
        if (
          typeof webcamRef.current !== "undefined" &&
          webcamRef.current !== null &&
          webcamRef.current.video.readyState === 4
        ) {
          console.log("detecting");
          const video = webcamRef.current.video;
          const detectedPoses = await detector.estimatePoses(video);
          if (detectedPoses.length > 0) {
            setPose(detectedPoses[0]);
          }
        }
        requestAnimationFrame(detect);
      };

      //detect();
    };

    //runPosenet();
  }, [backendReady, isLoading]);

  return { webcamRef, pose, isLoading, setIsLoading };
};

export default usePoseEstimation;
