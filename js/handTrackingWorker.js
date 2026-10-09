// Classic worker: the MediaPipe WASM loader uses importScripts internally.
let landmarker;
const version = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17';

self.onmessage = async ({ data }) => {
    if (data.type === 'init') {
        try {
            const { HandLandmarker, FilesetResolver } = await import(`${version}/vision_bundle.mjs`);
            const vision = await FilesetResolver.forVisionTasks(`${version}/wasm`);
            const options = {
                baseOptions: {
                    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                    delegate: 'GPU'
                },
                runningMode: 'VIDEO',
                numHands: 1,
                minHandDetectionConfidence: 0.6,
                minHandPresenceConfidence: 0.6,
                minTrackingConfidence: 0.5
            };
            try {
                landmarker = await HandLandmarker.createFromOptions(vision, options);
            } catch {
                options.baseOptions.delegate = 'CPU';
                landmarker = await HandLandmarker.createFromOptions(vision, options);
            }
            // Compile the inference kernels before reporting ready, so the first
            // actual hand frame doesn't pay the one-time warmup cost.
            const warmup = new OffscreenCanvas(640, 480);
            warmup.getContext('2d').fillRect(0, 0, 640, 480);
            landmarker.detectForVideo(warmup, 0);
            self.postMessage({ type: 'ready' });
        } catch (error) {
            self.postMessage({ type: 'error', message: error.message });
        }
        return;
    }
    if (data.type !== 'frame') return;
    try {
        const result = landmarker.detectForVideo(data.frame, data.timestamp);
        self.postMessage({
            type: 'result', timestamp: data.timestamp,
            landmarks: result.landmarks[0], worldLandmarks: result.worldLandmarks[0]
        });
    } catch (error) {
        self.postMessage({ type: 'error', message: error.message });
    } finally {
        data.frame.close();
    }
};
