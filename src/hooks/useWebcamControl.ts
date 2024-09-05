import { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";

const useWebcamControl = (isCameraOn: boolean) => {
  const webcamRef = useRef<Webcam>(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);

  useEffect(() => {
    if (isCameraOn && webcamRef.current) {
      // Camera is on and ready to stream
      setIsWebcamReady(true);
    } else {
      // Camera is off, release resources
      const videoElement = webcamRef.current?.video;
      if (videoElement && videoElement.srcObject instanceof MediaStream) {
        // Stop all tracks from the MediaStream
        videoElement.srcObject.getTracks().forEach((track) => track.stop());
      }
      setIsWebcamReady(false);
    }
  }, [isCameraOn]);

  return { webcamRef, isWebcamReady };
};

export default useWebcamControl;
