let keys = [];

let _previousKey;
window.addEventListener('keydown', e => {
    if (e.code === _previousKey) return;

    keys.push(e.code);

    _previousKey = e.code;
});

window.addEventListener('keyup', e => {
    keys = keys.filter(x => x !== e.code);

    _previousKey = null;
});