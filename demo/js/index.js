var w = 800, h = 600;
var seedRadius = 1000;
var strengthFunction = function(dis) {
    var s = 1 - dis / seedRadius;
    return s * s;
}

var seeds = [
    {
        x: 0.15 * w,
        y: 0.25 * h,
        vx: 70, // velocities in pixels / sec
        vy: 20,
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
    numParticles: 2000,
    particleColor: '#000',
    speedFactor: 1,
    fadeFactor: 0.03,
    seedRadius: 1000,
    showSeeds: false
}

function setUpDatGui() {
    var gui = new dat.GUI();

    gui.add(datData, 'numParticles', 1, 5000).onChange(function(val) {
        pf.setNumberOfParticles(val);
    });

    gui.addColor(datData, 'particleColor').onChange(function(val) {
        pf.setParticleColor(val);
    });

    gui.add(datData, 'speedFactor', 1, 10).onChange(function(val) {
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
    });

    gui.add(datData, 'isRunning').onChange(function(val) {
        val ? pf.start() : pf.stop();
    });

    gui.add(datData, 'showSeeds').onChange(function(val) {
        pf.setShowSeeds(val);
    });
}

function initParticleFlow() {
    pf = new ParticleFlow(document.getElementById('canvas'));

    pf.setSeeds(seeds);
    pf.setNumberOfParticles(datData.numParticles);
    pf.setFadeColor('#fff');
    pf.start();
}

initParticleFlow();
setUpDatGui();
updateSeeds();

