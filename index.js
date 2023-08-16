let canvas;
let context;
let camera;
let car;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.querySelector('#main-canvas');
    context = canvas.getContext('2d');

    camera = new Camera();
    car = new Car();

    resize();
});

/**
 * resize event handler
 */
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    camera.setDelta(canvas.width / 2, canvas.height / 2);
}
window.addEventListener('resize', resize);

/**
 * system tick
 */
function tick() {
    car.tick();

    camera.x = lerp(0.1, camera.x, car.x);
    camera.y = lerp(0.1, camera.y, car.y);

    camera.zoom = 2 / (Math.pow(Math.abs(car.velocity), 0.2) + 0.2);

    console.log(camera.zoom);
}

/**
 * system render
 */
function render() {
    context.fillStyle = "#2c2c2c";
    context.fillRect(0, 0, canvas.width, canvas.height);

    car.render(context, camera);

    // grid
    context.strokeStyle = "#fff1";
    for (let x = Math.ceil(camera.getGridX(0)); camera.getX(x) < canvas.width; x += 1) {
        if (x % 50 !== 0) {
            continue;
        }

        context.beginPath();
        context.moveTo(camera.getX(x), 0);
        context.lineTo(camera.getX(x), canvas.height);
        context.stroke();
    }

    for (let y = Math.ceil(camera.getGridY(0)); camera.getY(y) < canvas.height; y += 1) {
        if (y % 50 !== 0) {
            continue;
        }

        context.beginPath();
        context.moveTo(0, camera.getY(y));
        context.lineTo(canvas.width, camera.getY(y));
        context.stroke();
    }
}

const fps = 60;
setInterval(() => {
    tick();
    render();
}, 1000 / fps);