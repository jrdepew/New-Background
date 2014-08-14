var D = {

  radius: {},
  angle: {},
  worms: [],

  Random: function(min, max) {
    return Math.random() * (max - min) + min;
  },

  Position: function(center, angle, radius) {
    var x = center.x + Math.cos(angle) * radius;
    var y = center.y + Math.sin(angle) * radius;

    if (x > D.canvas.width) x = x - D.canvas.width;
    if (x < 0) x = D.canvas.width + x;
    if (y > D.canvas.height) y = y - D.canvas.height;
    if (y < 0) y = D.canvas.height + y;

    return {x: x, y: y}
  },

  Change: function(P) {
    var radius = D.Random(D.radius.min, D.radius.max);
    var sign = P.speed < 0 ? 1 : -1;

    P.center = D.Position(P.center, P.angle.a, P.radius + radius);
    P.radius = radius;
    P.speed = 2 * Math.asin(D.speed / P.radius) * sign;
    P.angle.a = P.angle.a + Math.PI;
    P.angle.b = P.angle.a + D.Random(D.angle.min, D.angle.max) * sign;
  },

  Move: function(P) {
    var position = D.Position(P.center, P.angle.a, P.radius);
    P.x = position.x;
    P.y = position.y;
    P.points.push({x: P.x, y: P.y});

    if (P.points.length > D.tail) {
      P.points.shift();
    }

    for (var i = 0; i < P.points.length; i++) {
      var size = i * D.size / P.points.length;
      D.ctx.fillStyle = 'rgba(66,222,123,0.5)';
      D.ctx.fillRect(P.points[i].x, P.points[i].y, size, size);
    }
  },

  Update: function() {
    for (var i = 0; i < D.worms.length; i++) {
      var P = D.worms[i];
      var a = P.angle.a += P.speed;
      var p = P.speed > 0 && P.angle.a > P.angle.b;
      var n = P.speed <= 0 && P.angle.a <= P.angle.b;

      D.Move(P);
      if (p || n) D.Change(P);
    }
  },

  Clear: function() {
    D.ctx.clearRect(0, 0, D.canvas.width, D.canvas.height);
  },

  Draw: function() {
    D.Clear();
    D.Update();
    requestAnimationFrame(D.Draw, D.canvas);
  },

  Point: function() {
    this.points = [];
    this.radius = D.Random(D.radius.min, D.radius.max);
    this.speed = 2 * Math.asin(D.speed / this.radius);
    this.center = {
      x: Math.random() * D.canvas.width,
      y: Math.random() * D.canvas.height
    }
  },

  Angle: function() {
    this.a = Math.random() * Math.PI * 2;
    this.b = this.a + D.Random(D.angle.min, D.angle.max);
  },

  Create: function() {
    for (var i = 0; i < D.worms.length; i++) {
      D.worms[i] = new D.Point();
      D.worms[i].angle = new D.Angle();
    }
  },

  Params: function() {
    var radius = D.Random(10, 100);
    var worms = D.Random(1, 200);
    var angle = D.Random(0.1, 0.9);

    D.worms = new Array(Math.round(worms));
    D.tail = Math.round(5000 / D.worms.length * D.Random(0.1, 1));
    D.radius.min = D.Random(1, radius / 2);
    D.radius.max = D.Random(D.radius.min + 1, radius);
    D.size = D.Random(1, 5);
    D.angle.min = Math.PI * angle;
    D.angle.max = Math.PI * (2 - angle);
    D.speed = D.Random(0.5, 1.5);
  },

  Randomize: function() {
    D.Params();
    D.Create();
  },

  Size: function() {
    D.canvas.width = window.innerWidth;
    D.canvas.height = window.innerHeight;
  },

  Init: function() {
    D.canvas = document.querySelector('canvas');
    D.ctx = D.canvas.getContext('2d');
    D.canvas.addEventListener('click', D.Randomize, false);
    window.addEventListener('resize', D.Size, false);
  },

  Run: function() {
    D.Init();
    D.Size();
    D.Randomize();
    D.Draw();
  }
};

D.Run();