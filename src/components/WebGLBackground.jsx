import { useEffect } from 'react';

export default function WebGLBackground({ sectionRef, enabled = false }) {
  useEffect(() => {
    if (!enabled) return;
    if (!sectionRef.current) return;
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (shouldReduceMotion) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 -z-20 pointer-events-none';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    sectionRef.current.appendChild(canvas);
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;
    // Shader sources
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    const fragmentShaderSource = `
      precision mediump float;
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 mouse;
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 center = vec2(0.5, 0.5);
        vec2 mousePos = mouse.xy / resolution;
        float dist = length(uv - center);
        float mouseDist = length(uv - mousePos) * 2.0;
        float ripple = sin(dist * 20.0 - time * 0.5) * 0.1;
        float mouseRipple = sin(mouseDist * 8.0 - time * 2.0) * 0.1;
        float r = 0.05 + 0.05 * sin(time * 0.3 + uv.x * 5.0 + ripple + mouseRipple);
        float g = 0.05 + 0.05 * cos(time * 0.4 + uv.y * 6.0 + ripple + mouseRipple);
        float b = 0.05 + 0.03 * sin(time * 0.5 + dist * 10.0 + ripple + mouseRipple);
        gl_FragColor = vec4(r, g, b, 0.3);
      }
    `;
    // Compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    // Set up geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
      ]),
      gl.STATIC_DRAW
    );
    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    // Uniforms
    const timeLoc = gl.getUniformLocation(program, 'time');
    const resLoc = gl.getUniformLocation(program, 'resolution');
    const mouseLoc = gl.getUniformLocation(program, 'mouse');
    // Animation loop
    let start = null;
    let animationFrameId;
    let mouse = [window.innerWidth/2, window.innerHeight/2];
    function render(now) {
      if (!start) start = now;
      const time = (now - start) * 0.001;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLoc, time);
      gl.uniform2f(resLoc, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(mouseLoc, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }
    animationFrameId = requestAnimationFrame(render);
    // Mouse move
    function handleMouseMove(e) {
      mouse = [e.clientX, e.clientY];
    }
    window.addEventListener('mousemove', handleMouseMove);
    // Resize
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [sectionRef, enabled]);
  return null;
}
