var w = 800, h = 600;
var field = [];
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var isRunning = true;
var seedRadius = 500;
var strengthFunction = function(dis) {
    var s = 1 - dis / seedRadius;
    return s * s;
}
var prevT;
var speedFactor = 1;

var particles = [], numParticles = 2500;

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


function distanceBetweenPts(x0, y0, x1, y1) {
    var dx = x0 - x1;
    var dy = y0 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function updateField() {
    console.time('updateField');

    field = [];
    var numSeeds = seeds.length;

    for(var x = 0; x < w; x++) {
        field.push([]);

        for(var y = 0; y < h; y++) {
            field[x].push([0, 0]);  // pushed array is [vx, vy]

            // Loop through seeds
            for(var i = 0; i < numSeeds; i++) {
                var seed = seeds[i];

                // Compute distance from seed to [x,y]
                var dis = distanceBetweenPts(seed.x, seed.y, x, y);

                // Skip this seed if point is outside seed's radius of influence
                if(dis > seed.r) {
                    continue;
                }

                // seed.vx and seed.vy are pixels per second. Divide by 1000 so that field unit is pixels per millisecond.
                field[x][y][0] += seed.strength(dis) * seed.vx / 1000;
                field[x][y][1] += seed.strength(dis) * seed.vy / 1000;
            }
        }
    }

    console.timeEnd('updateField');
}

function drawSeeds() {
    for(var i=0; i<seeds.length; i++) {
        ctx.fillStyle = "red";
        var s = seeds[i];
        ctx.fillRect(s.x - 3, s.y - 3, 6, 6);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.vx, s.y + s.vy);
        ctx.stroke();
    }
}

// function drawVelocityField() {
//     ctx.lineStyle = '#aaa';

//     for(var x=0; x<w; x+=20) {
//         for(var y=0; y<h; y+=20) {
//             var vx = field[x][y][0] / 5;
//             var vy = field[x][y][1] / 5;

//             ctx.beginPath();
//             ctx.moveTo(x, y);            
//             ctx.lineTo(x + vx, y + vy);
//             ctx.stroke();

//             ctx.fillRect(x - 2, y - 2, 4, 4);
//         }
//     }
// }

function drawParticles() {
    // console.time('drawParticles');
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    ctx.fillStyle = '#57e';
    for(var i=0; i<numParticles; i++) {
        var p = particles[i];

        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }
    // console.timeEnd('drawParticles');
}

function getRandomPoint(w, h) {
    return {
        x: Math.floor(Math.random() * w),
        y: Math.floor(Math.random() * h)
    }
}

function initParticles() {
    for(var i=0; i<numParticles; i++) {
        var pt = getRandomPoint(w, h);
        particles.push({
            prevX: pt.x,
            prevY: pt.y,
            x: pt.x,
            y: pt.y
        });  
    }
}

function updateParticles(dt) {
    // console.time('updateParticles');

    for(var i=0; i<numParticles; i++) {
        var p = particles[i];

        p.prevX = p.x;
        p.prevY = p.y;

        var f = field[Math.floor(p.x)][Math.floor(p.y)];
        p.x = p.x + dt * f[0];
        p.y = p.y + dt * f[1];

        var isZeroVelocity = f[0] === 0 && f[1] === 0;
        var isOutOfBounds = p.x < 0 || p.x >= w || p.y < 0 || p.y >= h;
        if(isZeroVelocity || isOutOfBounds) {
            var pt = getRandomPoint(w, h);
            p.x = p.prevX = pt.x;
            p.y = p.prevY = pt.y;
        }
    }
    // console.timeEnd('updateParticles');
}

function doAnimFrame(t) {
    if(!prevT) {
        prevT = t;
    }

    var deltaT = t - prevT;
    deltaT *= speedFactor;

    drawSeeds();
    updateParticles(deltaT);
    drawParticles();

    if(isRunning) {
        window.requestAnimationFrame(doAnimFrame);
    }

    prevT = t;
}

function stop() {
    isRunning = false;
}

drawSeeds();
updateField();
// drawVelocityField();

initParticles();

window.requestAnimationFrame(doAnimFrame);
