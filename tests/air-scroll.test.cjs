const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('js/handGestures.js', 'utf8'), sandbox);
const { HandGesture, AirScrollMotion } = sandbox.window.Portfolio;

function hand() {
    const points = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.6, z: 0 }));
    points[1] = { x: 0.42, y: 0.55, z: 0 };
    points[2] = { x: 0.38, y: 0.48, z: 0 };
    points[3] = { x: 0.38, y: 0.38, z: 0 };
    points[4] = { x: 0.38, y: 0.28, z: 0 };
    [5, 9, 13, 17].forEach((base, finger) => {
        const x = 0.46 + finger * 0.055;
        [0.5, 0.43, 0.49, 0.54].forEach((y, i) => { points[base + i] = { x, y, z: i === 2 ? -0.02 : 0 }; });
    });
    return points;
}
const transform = (points, angle, scale = 1, mirror = 1) => points.map(p => ({
    x: 0.5 + scale * ((p.x - 0.5) * Math.cos(angle) - (p.y - 0.5) * Math.sin(angle)) * mirror,
    y: 0.5 + scale * ((p.x - 0.5) * Math.sin(angle) + (p.y - 0.5) * Math.cos(angle)),
    z: p.z * scale
}));
function engage(gesture, points, world = points) {
    assert.equal(gesture.update(points, world).direction, 0);
    return gesture.update(points, world).direction;
}

test('recognizes thumbs up/down at different scales, handedness and moderate rotation', () => {
    for (const scale of [0.4, 1, 1.4]) for (const mirror of [-1, 1]) for (const rotation of [-0.3, 0, 0.3]) {
        assert.equal(engage(new HandGesture(), transform(hand(), rotation, scale, mirror)), -1);
        assert.equal(engage(new HandGesture(), transform(hand(), Math.PI + rotation, scale, mirror)), 1);
    }
});

test('checks all four fingers and stops on the first open-hand frame', () => {
    for (const base of [5, 9, 13, 17]) {
        const gesture = new HandGesture();
        const points = hand();
        assert.equal(engage(gesture, points), -1);
        [0.5, 0.43, 0.36, 0.29].forEach((y, i) => { points[base + i].y = y; points[base + i].z = 0; });
        assert.equal(gesture.update(points, points).direction, 0);
    }
});

test('rejects sideways thumbs, folded thumbs, malformed hands and missing hands', () => {
    const sideways = transform(hand(), Math.PI / 2);
    assert.equal(engage(new HandGesture(), sideways), 0);
    const folded = hand(); folded[4] = { x: 0.46, y: 0.5, z: 0 };
    assert.equal(engage(new HandGesture(), folded), 0);
    const gesture = new HandGesture();
    engage(gesture, hand());
    assert.equal(gesture.update(null).direction, 0);
    assert.equal(gesture.update([{ x: NaN, y: 0, z: 0 }]).hasHand, false);
});

test('one noisy frame cannot start or reverse scrolling; loss resets confirmation', () => {
    const gesture = new HandGesture();
    const up = hand(); const down = transform(up, Math.PI);
    assert.equal(gesture.update(up, up).direction, 0);
    gesture.update(null);
    assert.equal(engage(gesture, up), -1);
    assert.equal(gesture.update(down, down).direction, 0);
    assert.equal(gesture.update(down, down).direction, 1);
});

test('aspect-corrected image coordinates work when world landmarks are absent', () => {
    assert.equal(engage(new HandGesture(), hand(), undefined), -1);
    const gesture = new HandGesture();
    gesture.update(hand(), null, 16 / 9);
    assert.equal(gesture.update(hand(), null, 16 / 9).direction, -1);
});

test('scroll speed is equal at 60/120Hz, independent of 30/60fps inference', () => {
    for (const hz of [60, 120]) for (const fps of [30, 60]) {
        const motion = new AirScrollMotion(); let total = 0; let frame = -1;
        for (let i = 0; i <= hz; i++) {
            const now = i * 1000 / hz;
            if (Math.floor(now * fps / 1000) !== frame) {
                frame = Math.floor(now * fps / 1000); motion.update(1, now);
            }
            total += motion.step(now);
        }
        assert.ok(Math.abs(total - 650) < 0.001);
    }
});

test('stale inference stops scrolling and long animation gaps cannot cause large jumps', () => {
    const motion = new AirScrollMotion();
    motion.update(-1, 0); motion.step(0);
    assert.ok(motion.step(16) < 0);
    assert.equal(motion.step(181), 0);
    motion.update(1, 1000);
    assert.ok(motion.step(1000) <= 650 * .032);
    motion.update(0, 1001); assert.equal(motion.step(1016), 0);
});

function trackerContext() {
    const videos = [], workers = [], listeners = new Map();
    let resolveCamera;
    const stream = { stopped: false, getTracks() { return [{ stop: () => { this.stopped = true; } }]; }, getVideoTracks() { return [{ addEventListener() {} }]; } };
    class FakeWorker {
        constructor() { workers.push(this); }
        postMessage(message) { this.sent = message; }
        terminate() { this.terminated = true; }
        ready() { this.onmessage({ data: { type: 'ready' } }); }
    }
    const context = {
        window: { Portfolio: { HandGesture }, Worker: FakeWorker, createImageBitmap: () => {} },
        Worker: FakeWorker, EventTarget, Event, CustomEvent, performance, setTimeout, clearTimeout,
        requestAnimationFrame: () => 1, cancelAnimationFrame: () => {},
        document: {
            hidden: false, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name),
            body: { appendChild() {} },
            createElement: () => {
                const video = { style: {}, setAttribute() {}, play: async () => {}, remove() { this.removed = true; }, requestVideoFrameCallback: () => 1, cancelVideoFrameCallback() {} };
                videos.push(video); return video;
            }
        },
        navigator: { mediaDevices: { getUserMedia: () => new Promise(resolve => { resolveCamera = resolve; }) } }
    };
    vm.runInNewContext(fs.readFileSync('js/handTracker.js', 'utf8'), context);
    return { context, workers, videos, stream, listeners, camera: () => resolveCamera(stream), tracker: new context.window.Portfolio.HandTracker() };
}

test('stop during camera permission releases a stream that arrives later', async () => {
    const c = trackerContext(); const pending = c.tracker.start();
    c.tracker.stop(); c.camera(); await pending;
    assert.equal(c.stream.stopped, true);
    assert.equal(c.videos.length, 0);
    assert.equal(c.workers[0].terminated, true);
});

test('stop releases active video, worker and visibility listener', async () => {
    const c = trackerContext(); const pending = c.tracker.start();
    c.workers[0].ready(); c.camera(); await pending;
    assert.equal(c.tracker.isActive, true);
    c.tracker.stop();
    assert.equal(c.stream.stopped, true);
    assert.equal(c.videos[0].removed, true);
    assert.equal(c.workers[0].terminated, true);
    assert.equal(c.listeners.size, 0);
});

test('worker load failure emits an error and cancels camera startup', async () => {
    const c = trackerContext(); let error;
    c.tracker.addEventListener('tracking-error', e => { error = e.detail.message; });
    const pending = c.tracker.start(); c.workers[0].onerror(); c.camera(); await pending;
    assert.ok(error); assert.equal(c.tracker.isActive, false); assert.equal(c.stream.stopped, true);
});

test('capture permits only one in-flight frame and closes a bitmap captured after stop', async () => {
    const c = trackerContext(); const starting = c.tracker.start();
    c.camera(); c.workers[0].ready(); await starting;
    Object.assign(c.videos[0], { readyState: 2, currentTime: 1, videoWidth: 640, videoHeight: 480 });
    let captures = 0, resolveBitmap;
    c.context.createImageBitmap = () => { captures++; return new Promise(resolve => { resolveBitmap = resolve; }); };
    const pending = c.tracker._captureFrame(c.tracker.session);
    await c.tracker._captureFrame(c.tracker.session);
    assert.equal(captures, 1);
    c.tracker.stop();
    let closed = false;
    resolveBitmap({ close: () => { closed = true; } });
    await pending;
    assert.equal(closed, true);
    assert.equal(c.workers[0].sent.type, 'init');
});

test('results from an old session cannot revive scrolling after a restart', async () => {
    const c = trackerContext(); let moving = false;
    c.tracker.addEventListener('tracking-update', e => { moving ||= e.detail.direction !== 0; });
    const oldStart = c.tracker.start(); const oldWorker = c.workers[0];
    c.camera(); oldWorker.ready(); await oldStart;
    c.tracker.stop();
    const newStart = c.tracker.start(); c.camera(); c.workers[1].ready(); await newStart;
    for (let i = 0; i < 3; i++) oldWorker.onmessage({ data: { type: 'result', timestamp: performance.now(), landmarks: hand(), worldLandmarks: hand() } });
    assert.equal(moving, false);
    c.tracker.stop();
});

test('camera denial becomes a visible error and releases the model worker', async () => {
    const c = trackerContext(); let message;
    c.context.navigator.mediaDevices.getUserMedia = async () => { const error = new Error('denied'); error.name = 'NotAllowedError'; throw error; };
    c.tracker.addEventListener('tracking-error', e => { message = e.detail.message; });
    await c.tracker.start();
    assert.match(message, /Camera access was denied/);
    assert.equal(c.workers[0].terminated, true);
});

test('hiding the tab stops the camera and reports that tracking stopped', async () => {
    const c = trackerContext(); let stopped = false;
    c.tracker.addEventListener('tracking-stopped', () => { stopped = true; });
    const pending = c.tracker.start(); c.camera(); c.workers[0].ready(); await pending;
    c.context.document.hidden = true;
    c.listeners.get('visibilitychange')();
    assert.equal(stopped, true); assert.equal(c.stream.stopped, true);
});
