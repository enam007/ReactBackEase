import { useEffect } from "react";

interface CanvasTextConfig {
  fillStyle?: string;
  font?: string;
  textAlign?: string;
  textBaseline?: string;
  text: string;
}

const useDisplayCanvasText = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  loading: boolean = false,
  textConfig: CanvasTextConfig
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (loading && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = textConfig.fillStyle ?? "white";
      context.font = textConfig.font ?? "30px Arial";
      context.textAlign = (textConfig.textAlign ?? "left") as CanvasTextAlign;
      context.textBaseline = (textConfig.textBaseline ??
        "middle") as CanvasTextBaseline;

      context.fillText(textConfig.text, canvas.width / 2, canvas.height / 2);
    }
  }, [canvasRef, loading]); // Add canvasRef as a dependency
};

export default useDisplayCanvasText;
