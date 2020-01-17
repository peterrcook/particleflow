var w = 800, h = 600;
var seedRadius = 500;
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

var pf = new ParticleFlow({
    canvasEl: document.getElementById('canvas')
});

pf.setSeeds(seeds);
pf.setNumberOfParticles(100);
pf.start();
