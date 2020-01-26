(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ParticleFlow = factory());
}(this, (function () { 'use strict';

  function ParticleFlow(canvasEl) {
      this.canvas = canvasEl;
      this.ctx = null;
      this.w = null;
      this.h = null;
      this.seeds = [];
      this.numParticles = 0;
      this.speedFactor = 1;
      this.fadeColor = '#fff'; // Color used to erase canvas between frames
      this.fadeFactor = 0.03; // Alpha value of the rectangle used to erase between frames. Low values e.g. 0.03 result in trails. Use 1 for no trails.
      this.particleColor = '#000';
      this.particleSize = 1;
      this.showSeeds = false;

      this.field = null;
      this.particles = [];
      this.prevT = null;
      this.isRunning = true;

      this._init();
  }

  // ------------------------------------
  // Private
  // ------------------------------------
  ParticleFlow.prototype._init = function() {
      this.w = this.canvas.clientWidth;
      this.h = this.canvas.clientHeight;

      this.ctx = this.canvas.getContext('2d');
  };


  // Utility
  ParticleFlow.prototype._distanceBetweenPts = function(x0, y0, x1, y1) {
      var dx = x0 - x1;
      var dy = y0 - y1;
      return Math.sqrt(dx * dx + dy * dy);
  };

  ParticleFlow.prototype._getRandomPoint = function(w, h) {
      return {
          x: Math.floor(Math.random() * w),
          y: Math.floor(Math.random() * h)
      }
  };


  // Field functions
  ParticleFlow.prototype._updateField = function() {
      console.time('updateField');

      this.field = [];
      var numSeeds = this.seeds.length;

      for(var x = 0; x < this.w; x++) {
          this.field.push([]);

          for(var y = 0; y < this.h; y++) {
              this.field[x].push([0, 0]);  // pushed array is [vx, vy]

              // Loop through seeds
              for(var i = 0; i < numSeeds; i++) {
                  var seed = this.seeds[i];

                  // Compute distance from seed to [x,y]
                  var dis = this._distanceBetweenPts(seed.x, seed.y, x, y);

                  // Skip this seed if point is outside seed's radius of influence
                  if(dis > seed.r) {
                      continue;
                  }

                  // seed.vx and seed.vy are pixels per second. Divide by 1000 so that field unit is pixels per millisecond.
                  this.field[x][y][0] += seed.strength(dis) * seed.vx / 1000;
                  this.field[x][y][1] += seed.strength(dis) * seed.vy / 1000;
              }
          }
      }

      console.timeEnd('updateField');
  };


  // Particle functions
  ParticleFlow.prototype._initParticles = function() {
      this.particles = [];

      for(var i = 0; i < this.numParticles; i++) {
          var pt = this._getRandomPoint(this.w, this.h);
          this.particles.push({
              prevX: pt.x,
              prevY: pt.y,
              x: pt.x,
              y: pt.y
          });
      }
  };

  ParticleFlow.prototype._updateParticles = function(dt) {
      // console.time('updateParticles');

      for(var i = 0; i < this.numParticles; i++) {
          var p = this.particles[i];

          p.prevX = p.x;
          p.prevY = p.y;

          var f = this.field[Math.floor(p.x)][Math.floor(p.y)];
          p.x = p.x + dt * f[0];
          p.y = p.y + dt * f[1];

          var isZeroVelocity = f[0] === 0 && f[1] === 0;
          var isOutOfBounds = p.x < 0 || p.x >= this.w || p.y < 0 || p.y >= this.h;
          if(isZeroVelocity || isOutOfBounds) {
              var pt = this._getRandomPoint(this.w, this.h);
              p.x = p.prevX = pt.x;
              p.y = p.prevY = pt.y;
          }
      }

      // console.timeEnd('updateParticles');
  };



  // Rendering and animation
  ParticleFlow.prototype._drawParticles = function() {
      // console.time('drawParticles');
      var ctx = this.ctx;

      ctx.save();
      ctx.globalAlpha = this.fadeFactor;
      ctx.fillStyle = this.fadeColor;
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.restore();

      ctx.strokeStyle = this.particleColor;
      ctx.lineWidth = this.particleSize;

      for(var i = 0; i < this.numParticles; i++) {
          var p = this.particles[i];

          ctx.beginPath();
          ctx.moveTo(p.prevX, p.prevY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
      }
      // console.timeEnd('drawParticles');
  };

  ParticleFlow.prototype._drawSeeds = function() {
      var ctx = this.ctx;

      ctx.save();
      for(var i = 0; i < this.seeds.length; i++) {
          ctx.fillStyle = 'red';
          ctx.strokeStyle = 'red';

          var s = this.seeds[i];
          ctx.fillRect(s.x - 3, s.y - 3, 6, 6);
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + s.vx, s.y + s.vy);
          ctx.stroke();
      }
      ctx.restore();
  };

  ParticleFlow.prototype._doAnimFrame = function(t) {
      if(!this.isRunning) {
          this.prevT = null;
          return;
      }

      if(!this.prevT) {
          this.prevT = t;
      }

      var deltaT = t - this.prevT;
      deltaT *= this.speedFactor;

      if(this.showSeeds) {
          this._drawSeeds();
      }

      this._updateParticles(deltaT);
      this._drawParticles();

      window.requestAnimationFrame(this._doAnimFrame.bind(this));

      this.prevT = t;
  };


  // ------------------------------------
  // Public
  // ------------------------------------
  ParticleFlow.prototype.setSeeds = function(seeds) {
      this.seeds = seeds;
      this._updateField();    
  };

  ParticleFlow.prototype.setNumberOfParticles = function(num) {
      this.numParticles = num;
      this._initParticles();
  };

  ParticleFlow.prototype.setSpeedFactor = function(f) {
      this.speedFactor = f;
  };

  ParticleFlow.prototype.setFadeColor = function(col) {
    this.fadeColor = col;
  };

  ParticleFlow.prototype.setFadeFactor = function(f) {
      this.fadeFactor = f;
  };

  ParticleFlow.prototype.setParticleColor = function(col) {
      this.particleColor = col;
  };

  ParticleFlow.prototype.setParticleSize = function(size) {
      this.particleSize = size;
  };

  ParticleFlow.prototype.setShowSeeds = function(s) {
      this.showSeeds = s;
  };

  // ParticleFlow.prototype.setDimensions = function(w, h) {
  //     this.w = w;
  //     this.h = h;
  //     this._updateField();

  //     // We also need to deal with particles that are now out of bounds...
  // }

  ParticleFlow.prototype.start = function() {
      this.isRunning = true;
      window.requestAnimationFrame(this._doAnimFrame.bind(this));
  };

  ParticleFlow.prototype.stop = function() {
      this.isRunning = false;
  };

  return ParticleFlow;

})));
