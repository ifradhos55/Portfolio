window.Portfolio = window.Portfolio || {};

// World-space joints keep curl detection independent of hand rotation and distance.
window.Portfolio.HandGesture = class {
    constructor() { this.reset(); }

    reset() {
        this.direction = 0;
        this.candidate = 0;
        this.candidateFrames = 0;
    }

    static distance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    static angle(a, b, c) {
        const ab = [a.x - b.x, a.y - b.y, a.z - b.z];
        const cb = [c.x - b.x, c.y - b.y, c.z - b.z];
        const length = Math.hypot(...ab) * Math.hypot(...cb);
        if (length < 1e-8) return 180;
        const cosine = ab.reduce((sum, value, i) => sum + value * cb[i], 0) / length;
        return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
    }

    update(landmarks, worldLandmarks, aspectRatio = 4 / 3) {
        const valid = points => points?.length === 21 && points.every(p =>
            p && [p.x, p.y, p.z].every(Number.isFinite));
        if (!valid(landmarks)) return this.neutral(false);
        const joints = valid(worldLandmarks) ? worldLandmarks : landmarks.map(p => ({
            x: p.x * aspectRatio, y: p.y, z: p.z * aspectRatio
        }));
        const distance = this.constructor.distance;
        const angle = this.constructor.angle;
        const palmWidth = distance(joints[5], joints[17]);
        if (palmWidth < 1e-5) return this.neutral(false);

        // Slightly looser exit thresholds prevent flicker without smoothing away release.
        const holding = this.direction !== 0;
        const curled = [5, 9, 13, 17].every(base => {
            const [mcp, pip, dip, tip] = joints.slice(base, base + 4);
            const length = distance(mcp, pip) + distance(pip, dip) + distance(dip, tip);
            const folded = angle(mcp, pip, dip) < (holding ? 155 : 145) ||
                angle(pip, dip, tip) < (holding ? 150 : 135);
            return length > 1e-5 && folded && distance(mcp, tip) / length < (holding ? 0.88 : 0.80);
        });
        const thumbExtended = angle(joints[2], joints[3], joints[4]) > (holding ? 140 : 150) &&
            distance(joints[4], joints[5]) / palmWidth > (holding ? 0.45 : 0.55);
        const dx = (landmarks[4].x - landmarks[2].x) * aspectRatio;
        const dy = landmarks[4].y - landmarks[2].y;
        const length = Math.hypot(dx, dy);
        const imagePalmWidth = Math.hypot(
            (landmarks[5].x - landmarks[17].x) * aspectRatio,
            landmarks[5].y - landmarks[17].y
        );
        const vertical = length > 0 && Math.abs(dy) / length > (holding ? 0.55 : 0.70);
        const visibleThumb = Math.abs(dy) > imagePalmWidth * (holding ? 0.22 : 0.30);
        const next = curled && thumbExtended && vertical && visibleThumb ? Math.sign(dy) : 0;
        if (!next) return this.neutral(true);
        if (next === this.direction) return { direction: next, hasHand: true };

        // Require two fresh frames to engage/reverse; neutral always stops immediately.
        this.direction = 0;
        this.candidateFrames = next === this.candidate ? this.candidateFrames + 1 : 1;
        this.candidate = next;
        if (this.candidateFrames >= 2) this.direction = next;
        return { direction: this.direction, hasHand: true };
    }

    neutral(hasHand) {
        this.reset();
        return { direction: 0, hasHand };
    }
};

window.Portfolio.AirScrollMotion = class {
    constructor() { this.reset(); }
    reset() {
        this.direction = 0;
        this.updatedAt = -Infinity;
        this.lastTick = null;
    }
    update(direction, capturedAt) {
        this.direction = direction;
        this.updatedAt = capturedAt;
    }
    step(now) {
        const elapsed = this.lastTick === null ? 0 : Math.min(32, Math.max(0, now - this.lastTick));
        this.lastTick = now;
        // A stalled camera or inference must never leave the page scrolling indefinitely.
        if (now - this.updatedAt > 180) return 0;
        return this.direction * 650 * elapsed / 1000;
    }
};
