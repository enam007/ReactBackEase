import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-webgpu"; // Import WebGPU backend

const useSetBackend = () => {
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const setBackend = async () => {
      try {
        // Check if WebGPU is supported
        //if (tf.engine().findBackend("webgpu")) {
        await tf.setBackend("webgl"); // Try WebGPU
        //}
        //console.log("Using WebGPU backend");
        // } else {
        //   //throw new Error("WebGPU not available, switching to WebGL.");
        // }
      } catch (error) {
        //console.warn(error.message);
        // Fall back to WebGL if WebGPU is not available
        await tf.setBackend("webgl");

        //console.log("Using WebGL backend");
      }

      await tf.ready(); // Wait for the backend to be ready
      setBackendReady(true); // Mark backend as ready
    };

    setBackend();
  }, []);

  return { backendReady };
};

export default useSetBackend;
