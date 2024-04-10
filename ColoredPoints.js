// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

  let gl;
  let canvas;
  let a_Position;
  let u_FragColor;
  
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');  
  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {  
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
}
let color_storage = [1.0, 1.0, 1.0, 1.0]
let size_storage = 50;
function addActionsforHTMLUI() {
  document.getElementById("green").onclick = function() {color_storage = [0.0, 1.0, 0.0, 1.0]}
  document.getElementById("red").addEventListener("mouseup", function() {color_storage[0] = this.value / 100})
  document.getElementById("blue").addEventListener("mouseup", function() {color_storage[1] = this.value / 100})
  document.getElementById("Green").addEventListener("mouseup", function() {color_storage[2] = this.value / 100})
  
  console.log("Colors: ", color_storage)

  document.getElementById("size").addEventListener("mouseup", function() {size_storage = this.size})
}
function main() {

  setupWebGL();
  // Initialize shaders
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;

  addActionsforHTMLUI();
  connectVariablesToGLSL();
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
function click(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  // Store the coordinates to g_points array
  g_points.push([x, y]);
  
  // Store the coordinates to g_points array
  g_colors.push(color_storage);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length;
  for(var i = 0; i < len; i++) {
    var xy = g_points[i];
    var rgba = g_colors[i];

    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}

