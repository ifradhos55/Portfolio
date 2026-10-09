window.Portfolio = window.Portfolio || {};

window.Portfolio.HandTracker = class extends EventTarget {
    constructor() {
        super();
        this.gesture = new window.Portfolio.HandGesture();
        this.session = 0;
        this.isActive = false;
        this._onVisibility = () => {
            if (document.hidden) {
                this.stop();
                this.dispatchEvent(new Event('tracking-stopped'));
            }
        };
    }

    async start() {
        this.stop();
        const session = this.session;
        this.isActive = true;
        document.addEventListener('visibilitychange', this._onVisibility);
        this.dispatchEvent(new CustomEvent('tracking-status', { detail: { status: 'loading' } }));
        try {
            if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access requires HTTPS or localhost.');
            if (!window.Worker || !window.createImageBitmap) throw new Error('Air-Scroll requires a browser with video worker support.');
            // Load the model while the camera is starting, rather than serializing both waits.
            await Promise.all([this._initWorker(session), this._initCamera(session)]);
            if (!this.isActive || session !== this.session) return;
            this.dispatchEvent(new CustomEvent('tracking-status', { detail: { status: 'ready' } }));
            this._scheduleFrame(session);
        } catch (error) {
            if (session === this.session && this.isActive) this._fail(error);
        }
    }

    _initWorker(session) {
        return new Promise((resolve, reject) => {
            const worker = this.worker = new Worker('js/handTrackingWorker.js');
            const timeout = setTimeout(() => reject(new Error('Hand tracking took too long to load. Check your connection and try again.')), 30000);
            const finish = (error) => {
                clearTimeout(timeout);
                this.cancelInit = null;
                if (error) reject(error); else resolve();
            };
            this.cancelInit = () => finish(new Error('Tracking cancelled.'));
            worker.onerror = () => {
                const error = new Error('Hand tracking could not start. Please try again.');
                finish(error);
                if (session === this.session && this.isActive) this._fail(error);
            };
            worker.onmessage = ({ data }) => {
                if (session !== this.session || !this.isActive) return;
                if (data.type === 'ready') return finish();
                if (data.type === 'error') {
                    const error = new Error('Hand tracking failed. Check your connection and try again.');
                    finish(error);
                    return this._fail(error);
                }
                if (data.type !== 'result') return;
                this.inFlight = false;
                const fresh = performance.now() - data.timestamp <= 180;
                const result = this.gesture.update(
                    fresh ? data.landmarks : null, data.worldLandmarks,
                    this.video.videoWidth / this.video.videoHeight
                );
                this.dispatchEvent(new CustomEvent('tracking-update', { detail: { ...result, capturedAt: data.timestamp } }));
            };
            worker.postMessage({ type: 'init' });
        });
    }

    async _initCamera(session) {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 },
                frameRate: { ideal: 60, max: 60 }
            }
        });
        if (session !== this.session || !this.isActive) {
            stream.getTracks().forEach(track => track.stop());
            return;
        }
        const video = this.video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('aria-hidden', 'true');
        // Keep a rendered video surface for browsers that suspend display:none video.
        video.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;bottom:0;left:0;';
        document.body.appendChild(video);
        video.srcObject = stream;
        stream.getVideoTracks().forEach(track => track.addEventListener('ended', () => {
            if (session === this.session && this.isActive) this._fail(new Error('The camera disconnected. Please reconnect it and try again.'));
        }));
        await video.play();
    }

    _scheduleFrame(session) {
        if (!this.isActive || session !== this.session) return;
        const callback = () => {
            if (!this.isActive || session !== this.session) return;
            this._scheduleFrame(session);
            this._captureFrame(session);
        };
        this.useVideoCallback = typeof this.video.requestVideoFrameCallback === 'function';
        this.frameCallback = this.useVideoCallback
            ? this.video.requestVideoFrameCallback(callback)
            : requestAnimationFrame(callback);
    }

    async _captureFrame(session) {
        const video = this.video;
        if (document.hidden || this.inFlight || video.readyState < 2 || video.currentTime === this.lastVideoTime) return;
        this.lastVideoTime = video.currentTime;
        this.inFlight = true;
        const timestamp = performance.now();
        let frame;
        try {
            frame = await createImageBitmap(video);
            if (session !== this.session || !this.isActive) { frame.close(); return; }
            // Only one frame can be in flight: slow devices skip frames instead of queuing stale input.
            this.worker.postMessage({ type: 'frame', frame, timestamp }, [frame]);
        } catch (error) {
            frame?.close();
            if (session === this.session && this.isActive) this._fail(error);
        }
    }

    _fail(error) {
        let message = error.message || 'Air-Scroll could not start. Please try again.';
        if (error.name === 'NotAllowedError') message = 'Camera access was denied. Allow camera access to use Air-Scroll.';
        if (error.name === 'NotFoundError') message = 'No camera was found. Connect a camera to use Air-Scroll.';
        if (error.name === 'NotReadableError') message = 'The camera is busy. Close other camera apps and try again.';
        this.stop();
        this.dispatchEvent(new CustomEvent('tracking-error', { detail: { message } }));
    }

    stop() {
        this.session++;
        this.isActive = false;
        this.cancelInit?.();
        this.cancelInit = null;
        if (this.frameCallback != null) {
            if (this.useVideoCallback) this.video?.cancelVideoFrameCallback(this.frameCallback);
            else cancelAnimationFrame(this.frameCallback);
        }
        this.frameCallback = null;
        this.worker?.terminate();
        this.worker = null;
        if (this.video) {
            this.video.srcObject?.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
            this.video.remove();
            this.video = null;
        }
        document.removeEventListener('visibilitychange', this._onVisibility);
        this.inFlight = false;
        this.lastVideoTime = -1;
        this.gesture.reset();
        this.dispatchEvent(new CustomEvent('tracking-update', {
            detail: { direction: 0, hasHand: false, capturedAt: performance.now() }
        }));
    }
};
