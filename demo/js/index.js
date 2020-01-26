var w = window.innerWidth, h = window.innerHeight;
var seedRadius = 600;
var strengthFunction = function(dis) {
    var s = 1 - dis / seedRadius;
    return s * s;
}
var showSeeds = true;

var seeds = [
    {
        x: 0.15 * w,
        y: 0.25 * h,
        vx: 70, // velocities in pixels / sec
        vy: -20,
        r: seedRadius,
        strength: strengthFunction
    },
    {
        x: 0.75 * w,
        y: 0.5 * h,
        vx: 50,
        vy: -100,
        r: seedRadius,
        strength: strengthFunction
    },
    {
        x: 0.5 * w,
        y: 0.75 * h,
        vx: -100,
        vy: 50,
        r: seedRadius,
        strength: strengthFunction
    },
    {
        x: 0.25 * w,
        y: 0.5 * h,
        vx: 0,
        vy: -30,
        r: seedRadius,
        strength: strengthFunction
    },
];

var pf;
var canvasEl = document.getElementById('canvas');

var datData = {
    isRunning: true,
    numParticles: 2500,
    particleColor: '#fff',
    particleSize: 1,
    speedFactor: 1,
    fadeFactor: 0.03,
    seedRadius: 600,
    showSeeds: true
}

function setUpDatGui() {
    var gui = new dat.GUI();

    gui.add(datData, 'numParticles', 1, 5000).onChange(function(val) {
        pf.setNumberOfParticles(val);
    });

    gui.addColor(datData, 'particleColor').onChange(function(val) {
        pf.setParticleColor(val);
    });

    gui.add(datData, 'particleSize', 0.5, 20).onChange(function(val) {
        pf.setParticleSize(val);
    });

    gui.add(datData, 'speedFactor', -5, 5).onChange(function(val) {
        pf.setSpeedFactor(val);
    });

    gui.add(datData, 'fadeFactor', 0, 1).onChange(function(val) {
        pf.setFadeFactor(val);
    });

    gui.add(datData, 'seedRadius', 1, 2000).onChange(function(val) {
        seedRadius = val;
        seeds.forEach(function(d) {
            d.r = val;
        });
        pf.setSeeds(seeds);
        updateSeeds();
    });

    gui.add(datData, 'isRunning').onChange(function(val) {
        val ? pf.start() : pf.stop();
    });

    gui.add(datData, 'showSeeds').onChange(function(val) {
        showSeeds = val;
        updateSeeds();
    });
}

function initParticleFlow() {
    pf = new ParticleFlow(canvasEl);

    pf.setSeeds(seeds);
    pf.setNumberOfParticles(datData.numParticles);
    pf.setFadeColor('#000');
    pf.setParticleColor('#fff');
    pf.start();
}

function updateDimensions() {
    w = window.innerWidth;
    h = window.innerHeight;

    canvasEl.setAttribute('width', w);
    canvasEl.setAttribute('height', h);
}

updateDimensions();
initParticleFlow();
setUpDatGui();
updateSeeds();
