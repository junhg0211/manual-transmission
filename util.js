function lerp(t, a, b) {
    return (b-a) * t + a;
}

function limit(value, min, max) {
    if (value < min) {
        return min;
    }

    if (value > max) {
        return max;
    }

    return value;
}

class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;

        this.dx = 0;
        this.dy = 0;
    }

    setDelta(x, y) {
        this.dx = x;
        this.dy = y;
    }

    getX(x) {
        return (x - this.x) * this.zoom + this.dx;
    }

    getY(y) {
        return (y - this.y) * this.zoom + this.dy;
    }

    getGridX(x) {
        return (x - this.dx) / this.zoom + this.x;
    }

    getGridY(y) {
        return (y - this.dy) / this.zoom + this.y;
    }
}