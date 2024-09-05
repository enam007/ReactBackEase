import * as poseDetection from "@tensorflow-models/pose-detection";

export const SCORE_THRESHOLD = 0.5;

interface Keypoint {
  x: number;
  y: number;
  score: number | null;
  name?: string;
}

function drawKeypoint(keypoint: Keypoint, ctx: CanvasRenderingContext2D): void {
  const score = keypoint.score != null ? keypoint.score : 1;
  const scoreThreshold = SCORE_THRESHOLD;

  if (score >= scoreThreshold) {
    const circle = new Path2D();
    circle.arc(keypoint.x, keypoint.y, 2, 0, 2 * Math.PI);
    ctx.fill(circle);
    ctx.stroke(circle);
  }
}

export function drawKeypoints(
  keypoints: Keypoint[],
  ctx: CanvasRenderingContext2D,
  color: string
): void {
  const keypointInd = poseDetection.util.getKeypointIndexBySide(
    poseDetection.SupportedModels.MoveNet
  );
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  for (const i of keypointInd.middle) {
    drawKeypoint(keypoints[i], ctx);
  }

  ctx.fillStyle = "Green";
  for (const i of keypointInd.left) {
    drawKeypoint(keypoints[i], ctx);
  }

  ctx.fillStyle = "Orange";
  for (const i of keypointInd.right) {
    drawKeypoint(keypoints[i], ctx);
  }
}

export function drawSkeleton(
  keypoints: Keypoint[],
  ctx: CanvasRenderingContext2D,
  color: string
): void {
  ctx.lineWidth = 5;
  const pointsR = getPoints(
    keypoints,
    "right_shoulder",
    "right_elbow",
    "right_wrist"
  );
  const pointsL = getPoints(
    keypoints,
    "left_shoulder",
    "left_elbow",
    "left_wrist"
  );
  const angleR = calculateAngle(
    pointsR,
    "right_shoulder",
    "right_elbow",
    "right_wrist"
  );
  const angleL = calculateAngle(
    pointsL,
    "left_shoulder",
    "left_elbow",
    "left_wrist"
  );
  const colors = calculateColors(angleR);
  ctx.fillStyle = colors;
  ctx.strokeStyle = colors;

  poseDetection.util
    .getAdjacentPairs(poseDetection.SupportedModels.MoveNet)
    .forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      const score1 = kp1.score != null ? kp1.score : 1;
      const score2 = kp2.score != null ? kp2.score : 1;
      const scoreThreshold = SCORE_THRESHOLD;

      if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
        if (kp1.name === "right_elbow" && !isNaN(angleR)) {
          writeTextOnCanvas(kp1.x, kp1.y, angleR, ctx, "yellow");
        }
        if (kp1.name === "left_elbow" && !isNaN(angleL)) {
          writeTextOnCanvas(kp1.x, kp1.y, angleL, ctx, "red");
        }

        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.stroke();
      }
    });
}

interface PoseDetectionProps {
  pose: poseDetection.Pose;
  videoRef: React.RefObject<{ video: HTMLVideoElement }>;
  color: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const drawPose = ({
  pose,
  videoRef,
  color,
  canvasRef,
}: PoseDetectionProps): void => {
  const canvas = canvasRef.current;
  const video = videoRef.current?.video;

  if (!canvas || !pose || !pose.keypoints || !video) {
    return;
  }

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const keypoints = pose.keypoints;
  const isMirrored = true;

  const mirroredKeypoints = keypoints.map((keypoint) => ({
    x: isMirrored ? videoWidth - keypoint.x : keypoint.x,
    y: keypoint.y,
    score: keypoint.score,
    name: keypoint.name,
  }));

  drawKeypoints(mirroredKeypoints, ctx, "yellow");
  drawSkeleton(mirroredKeypoints, ctx, color);
};

interface PointsResult {
  [key: string]: Keypoint;
}

export const getPoints = (
  keypoints: Keypoint[],
  jointA: string,
  jointB: string,
  jointC: string
): PointsResult => {
  const result: PointsResult = {};
  keypoints.forEach((keypoint) => {
    const { name, score } = keypoint;
    if (score !== null && score >= SCORE_THRESHOLD) {
      if (name === jointA || name === jointB || name === jointC) {
        result[name] = keypoint;
      }
    }
  });

  return result;
};

function calculateAngle(
  points: PointsResult,
  pointA: string,
  pointB: string,
  pointC: string
): number {
  if (!points || !points[pointA] || !points[pointB] || !points[pointC]) {
    //console.error("Invalid points or point names");
    return NaN;
  }
  const { x: ax, y: ay } = points[pointA];
  const { x: bx, y: by } = points[pointB];
  const { x: cx, y: cy } = points[pointC];

  const AB = { x: bx - ax, y: by - ay };
  const BC = { x: cx - bx, y: cy - by };

  const dotProduct = AB.x * BC.x + AB.y * BC.y;
  const magnitudeAB = Math.sqrt(AB.x * AB.x + AB.y * AB.y);
  const magnitudeBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);
  const cosAngle = dotProduct / (magnitudeAB * magnitudeBC);
  const angleRad = Math.acos(cosAngle);
  const angleDeg = Math.round(angleRad * (180 / Math.PI));

  return angleDeg;
}

function writeTextOnCanvas(
  x: number,
  y: number,
  text: number,
  ctx: CanvasRenderingContext2D,
  color: string
): void {
  ctx.font = "130px Arial";
  ctx.fillStyle = color;
  ctx.fillText(text.toString(), x, y);
}

function calculateColors(angle: number): string {
  if (angle >= 90 && angle <= 100) {
    return "green";
  } else {
    return "red";
  }
}
