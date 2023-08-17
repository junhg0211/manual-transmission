class Car {
    static idlePower = 1;  // rpf when idle
    static power = 5;  // maximum rpf
    static friction = 0.001;  // rate of friction per frame

    constructor() {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.handle = 0;

        this.rpf = Car.idlePower;
        this.ratio = 0;

        this.velocity = 0;

        this.clutchAmount = 0;
        this.breakAmount = 0;
        this.acceleratorAmount = 0;
    }

    getConnection() {
        if (this.ratio === 0) {
            return 0;
        }

        return 1 - this.clutchAmount;
    }

    tick() {
        /// calculate pedal amounts
        // clutch
        if (keys.indexOf('KeyQ') !== -1) {
            this.clutchAmount = lerp(0.2, this.clutchAmount, 1);
        } else {
            this.clutchAmount = lerp(0.2, this.clutchAmount, 0);
        }
        // accelerator
        if (keys.indexOf('Space') !== -1) {
            this.acceleratorAmount = lerp(0.2, this.acceleratorAmount, 1);
        } else {
            this.acceleratorAmount = lerp(0.2, this.acceleratorAmount, 0);
        }
        // break
        if (keys.indexOf('ShiftLeft') !== -1) {
            this.breakAmount = lerp(0.2, this.breakAmount, 1);
        } else {
            this.breakAmount = lerp(0.2, this.breakAmount, 0);
        }

        /// change transmission
        let clutch = this.clutchAmount;

        if (clutch > 0.9) {
            if (keys.indexOf('KeyK') !== -1) {
                this.ratio = 0;
            } else if (keys.indexOf('KeyU') !== -1) {
                this.ratio = 1;
            } else if (keys.indexOf('KeyM') !== -1) {
                this.ratio = 3;
            } else if (keys.indexOf('KeyI') !== -1) {
                this.ratio = 9;
            } else if (keys.indexOf('Comma') !== -1) {
                this.ratio = 27;
            } else if (keys.indexOf('KeyO') !== -1) {
                this.ratio = 81;
            } else if (keys.indexOf('Period') !== -1) {
                this.ratio = -1;
            }
        }

        let connection = this.getConnection();

        /// acceleration
        let targetRpf = lerp(this.acceleratorAmount, Car.idlePower, Car.power);
        let correctRpf = this.ratio === 0 ? targetRpf : this.velocity / this.ratio;
        this.rpf = lerp(
            0.8,
            this.rpf,
            lerp(
                0.1,
                lerp(connection, targetRpf, correctRpf),
                targetRpf));

        /// calculating
        // velocity by engine connection
        let targetVelocity = lerp(connection, this.velocity, this.rpf * this.ratio);
        this.velocity = lerp(0.05, this.velocity, lerp(connection, this.velocity, targetVelocity));
        this.velocity *= 1 - Car.friction;

        // break
        this.rpf = lerp(0.1, this.rpf, lerp(this.breakAmount, this.rpf, lerp(connection, this.rpf, 0)));
        this.velocity = lerp(0.05, this.velocity,
            lerp(this.breakAmount, this.velocity, Math.max(Math.min(this.velocity * 0.8, this.velocity - 3), 0)))

        /// steering
        if (keys.indexOf('KeyA') !== -1) {
            this.handle -= 0.001;
        } else if (keys.indexOf('KeyD') !== -1) {
            this.handle += 0.001;
        }
        this.handle = limit(this.handle, -Math.PI * 0.01, Math.PI * 0.01);
        this.rotation += this.handle * this.velocity;

        /// process moving
        let dx = Math.cos(this.rotation) * this.velocity;
        let dy = Math.sin(this.rotation) * this.velocity;

        this.x += dx;
        this.y += dy;
    }

    render(context, camera) {
        let x = camera.getX(this.x);
        let y = camera.getY(this.y);

        context.fillStyle = "#ff0000";
        context.fillRect(x, y, 10 * camera.zoom, 10 * camera.zoom);

        // hud
        context.fillStyle = "#f7f7f9";
        context.font = "24px Pretendard";
        context.fillText(`${this.rpf.toFixed(2)} RPF`, 100, 100);
        context.fillText(`${this.velocity.toFixed(2)} px/f`, 100, 100 + 24);
        context.fillText(`Gear: ${this.ratio}`, 100, 100 + 24*2);
        context.fillText(`A: ${this.acceleratorAmount.toFixed(2)}`, 100, 100 + 24*3);
        context.fillText(`B: ${this.breakAmount.toFixed(2)}`, 100, 100 + 24*4);
        context.fillText(`C: ${this.clutchAmount.toFixed(2)}`, 100, 100 + 24*5);
        context.fillText(`Conn: ${this.getConnection().toFixed(2)}`, 100, 100 + 24*6);
        context.fillText(`Steer: ${this.handle.toFixed(4)}`, 100, 100 + 24*7);
    }
}