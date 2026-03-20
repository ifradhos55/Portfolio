/**
 * 1 Euro Filter for smoothing jittery signals (for future-proofing)
 */
class LowPassFilter {
    constructor(alpha) {
        this.y = null;
        this.alpha = alpha;
    }
    filter(value, alpha) {
        if (alpha !== undefined) this.alpha = alpha;
        if (this.y === null) this.y = value;
        else this.y = this.alpha * value + (1.0 - this.alpha) * this.y;
        return this.y;
    }
}

class OneEuroFilter {
    constructor(freq, mincutoff = 1.0, beta = 0.0, dcutoff = 1.0) {
        this.freq = freq;
        this.mincutoff = mincutoff;
        this.beta = beta;
        this.dcutoff = dcutoff;
        this.x = new LowPassFilter(this.alpha(mincutoff));
        this.dx = new LowPassFilter(this.alpha(dcutoff));
        this.lastTime = null;
    }
    alpha(cutoff) {
        const te = 1.0 / this.freq;
        const tau = 1.0 / (2 * Math.PI * cutoff);
        return 1.0 / (1.0 + tau / te);
    }
    filter(value, timestamp) {
        if (this.lastTime !== null && timestamp !== undefined) {
            this.freq = 1.0 / (timestamp - this.lastTime);
        }
        this.lastTime = timestamp;
        const dvalue = this.x.y === null ? 0 : (value - this.x.y) * this.freq;
        const edvalue = this.dx.filter(dvalue, this.alpha(this.dcutoff));
        const cutoff = this.mincutoff + this.beta * Math.abs(edvalue);
        return this.x.filter(value, this.alpha(cutoff));
    }
}

const MathUtils = {
    clamp: (val, min, max) => Math.max(min, Math.min(max, val)),
    distance3D: (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z),
    lerp: (a, b, t) => a + (b - a) * t
};

window.Portfolio = window.Portfolio || {};

/**
 * HandTracker: Simplified for Air-Scroll logic.
 */
window.Portfolio.HandTracker = class extends EventTarget {
    constructor() {
        super();
        this.handLandmarker = null;
        this.video = null;
        this.isActive = false;
        this._loop = this._loop.bind(this);
        this.lastFrameTime = -1;
    }

    async init() {
        try {
            const { HandLandmarker, FilesetResolver } = window.MediaPipe;
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm");
            this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: { 
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task", 
                    delegate: "GPU" 
                },
                runningMode: "VIDEO",
                numHands: 1
            });
        } catch (err) {
            console.error("HandTracker Init Error:", err);
            throw err;
        }
    }

    async start() {
        if (!this.handLandmarker) await this.init();
        try {
            this.video = document.createElement('video');
            this.video.style.display = 'none';
            document.body.appendChild(this.video);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, frameRate: 30 }
            });
            this.video.srcObject = stream;
            await this.video.play();
            this.isActive = true;
            requestAnimationFrame(this._loop);
        } catch (err) {
            console.error("Camera Access Error:", err);
            this.isActive = false;
        }
    }

    stop() {
        this.isActive = false;
        if (this.video?.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video.remove();
            this.video = null;
        }
    }

    _loop() {
        if (!this.isActive) return;
        if (this.video.currentTime !== this.lastFrameTime) {
            this.lastFrameTime = this.video.currentTime;
            const results = this.handLandmarker.detectForVideo(this.video, performance.now());
            this._processResults(results);
        }
        requestAnimationFrame(this._loop);
    }

    _processResults(results) {
        if (!results.landmarks?.length) {
            this.dispatchEvent(new CustomEvent('tracking-update', {
                detail: { isScrollingUp: false, isScrollingDown: false }
            }));
            return;
        }
        const landmarks = results.landmarks[0];

        // 1. High-Sensitivity Air-Scroll (Reliable)
        // - Effortless Triggers: Thumbs up and down will now trigger easily even with a relaxed hand position.
        // - Classic 3-Finger Fist: Scrolling uses the standard Index, Middle, and Ring finger curl, which is the most natural for most users.
        // - Detection Summary:
        //     - Thumb Up (Tip above joints) = Scroll Up.
        //     - Thumb Down (Tip below joints) = Scroll Down.
        //     - Any Finger Extended = Stop Scrolling instantly.

        // Check if Index, Middle, and Ring fingers are curled (fist gesture)
        // TIP.y > PIP.y means finger is curled downwards towards palm
        const isIndexCurled = landmarks[8].y > landmarks[6].y;
        const isMiddleCurled = landmarks[12].y > landmarks[10].y;
        const isRingCurled = landmarks[16].y > landmarks[14].y;
        
        const fingersCurled = isIndexCurled && isMiddleCurled && isRingCurled;

        // High-Sensitivity Thumb Up/Down
        // Scroll Up: Thumb Tip (4) is above Thumb MCP (2)
        // Scroll Down: Thumb Tip (4) is below Thumb MCP (2)
        const thumbTip = landmarks[4];
        const thumbMcp = landmarks[2];
        
        const isScrollingUp = fingersCurled && (thumbTip.y < thumbMcp.y - 0.02);
        const isScrollingDown = fingersCurled && (thumbTip.y > thumbMcp.y + 0.02);

        this.dispatchEvent(new CustomEvent('tracking-update', {
            detail: { isScrollingUp, isScrollingDown }
        }));
    }
}