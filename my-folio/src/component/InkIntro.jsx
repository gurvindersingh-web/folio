import { useEffect, useRef, useState, memo } from 'react';
import './InkIntro.css';

const VIDEO_MP4 = '/imgs/intro/ink_1080p.mp4';
const VIDEO_WEBM = '/imgs/intro/ink_1080p.webm';

const START_DELAY_MS = 2000;
const PLAY_DURATION_MS = 5300;
const FADE_MS = 500;
const UNMOUNT_MS = FADE_MS + 50;
const REDUCED_MOTION_PLAY_MS = 300;
const REDUCED_MOTION_FADE_MS = 1;

const vsSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fsSource = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_video;
  uniform vec2 u_resolution;
  uniform vec2 u_videoSize;

  void main() {
    float screenAspect = u_resolution.x / u_resolution.y;
    float videoAspect = u_videoSize.x / u_videoSize.y;

    vec2 aspectCorrect = vec2(max(1.0, screenAspect / videoAspect), max(1.0, videoAspect / screenAspect));
    float scale = 1.22;

    // Ink drop in source video begins at bottom-right (1.0, 1.0)
    // Top-Left bloom:
    vec2 uvTL = vec2(1.0, 1.0) - (v_uv * aspectCorrect) / scale;
    // Bottom-Right bloom:
    vec2 uvBR = vec2(1.0, 1.0) - ((vec2(1.0, 1.0) - v_uv) * aspectCorrect) / scale;

    float inkTL = 0.0;
    if (uvTL.x >= 0.0 && uvTL.x <= 1.0 && uvTL.y >= 0.0 && uvTL.y <= 1.0) {
      vec4 colTL = texture2D(u_video, uvTL);
      inkTL = clamp((1.0 - colTL.r) * 1.1, 0.0, 1.0);
    }

    float inkBR = 0.0;
    if (uvBR.x >= 0.0 && uvBR.x <= 1.0 && uvBR.y >= 0.0 && uvBR.y <= 1.0) {
      vec4 colBR = texture2D(u_video, uvBR);
      inkBR = clamp((1.0 - colBR.r) * 1.1, 0.0, 1.0);
    }

    float totalInk = clamp(inkTL + inkBR, 0.0, 1.0);
    float alpha = 1.0 - totalInk;

    // Theme cream color: #d5cebe -> (0.835, 0.808, 0.745)
    vec3 cream = vec3(0.835, 0.808, 0.745);

    // Premultiplied alpha for clean anti-aliasing
    gl_FragColor = vec4(cream * alpha, alpha);
  }
`;

const getReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const InkIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('loading'); // loading -> playing -> fading -> done
  const [reduced] = useState(getReducedMotion);
  const [useFallback, setUseFallback] = useState(false);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Lock scroll on mount, unlock on finish
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let cancelled = false;
    let fadeTimer;
    let playTimer;

    const unlock = () => {
      document.body.style.overflow = previousOverflow;
    };

    if (reduced) {
      setPhase('playing');
      fadeTimer = setTimeout(() => {
        unlock();
        setPhase('fading');
      }, REDUCED_MOTION_PLAY_MS);
      return () => {
        clearTimeout(fadeTimer);
        unlock();
      };
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let gl;
    try {
      gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true }) ||
           canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: true });
    } catch {
      gl = null;
    }

    if (!gl) {
      setUseFallback(true);
      setPhase('playing');
      fadeTimer = setTimeout(() => {
        unlock();
        setPhase('fading');
      }, 1500);
      return () => {
        clearTimeout(fadeTimer);
        unlock();
      };
    }

    // WebGL Shader setup
    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uVidSize = gl.getUniformLocation(program, 'u_videoSize');

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Initial white pixel while video loads
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255])
    );

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let rafId;
    const render = () => {
      if (cancelled) return;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uVidSize, (video.videoWidth || 1920) * dpr, (video.videoHeight || 1080) * dpr);

      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    const startPlayback = () => {
      if (cancelled) return;
      setPhase('playing');
      // Render loop starts now (shows the blank first frame during the pause)
      rafId = requestAnimationFrame(render);

      // Delay the actual animation
      playTimer = setTimeout(() => {
        if (cancelled) return;
        video.play().catch(() => {});
        fadeTimer = setTimeout(() => {
          unlock();
          setPhase('fading');
        }, PLAY_DURATION_MS);
      }, START_DELAY_MS);
    };

    if (video.readyState >= 3) {
      startPlayback();
    } else {
      video.addEventListener('canplay', startPlayback, { once: true });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      clearTimeout(playTimer);
      clearTimeout(fadeTimer);
      window.removeEventListener('resize', resize);
      unlock();

      try {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(posBuffer);
        gl.deleteTexture(texture);
      } catch {}
    };
  }, [reduced]);

  // Transition from fading -> done and signal completion
  useEffect(() => {
    if (phase !== 'fading') return;
    onCompleteRef.current?.();
    const t = setTimeout(
      () => setPhase('done'),
      reduced ? REDUCED_MOTION_FADE_MS : UNMOUNT_MS
    );
    return () => clearTimeout(t);
  }, [phase, reduced]);

  if (phase === 'done') return null;

  const fading = phase === 'fading';

  const className = [
    'ink-intro-overlay',
    phase !== 'loading' && 'is-playing',
    fading && 'fade-out',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      style={{ '--fade-ms': `${FADE_MS}ms` }}
      inert={fading}
      aria-hidden={fading || undefined}
    >
      {!reduced && (
        <>
          <video
            ref={videoRef}
            className="ink-video-source"
            playsInline
            muted
            preload="auto"
            aria-hidden="true"
          >
            <source src={VIDEO_WEBM} type="video/webm" />
            <source src={VIDEO_MP4} type="video/mp4" />
          </video>
          <canvas ref={canvasRef} className="ink-canvas" aria-hidden="true" />
        </>
      )}

      {useFallback && <div className="ink-layer-fallback" aria-hidden="true" />}

      <div className="ink-banner">
        <div className="ink-content">
          <h1 className="ink-title">
            Gurvinder
            <br />
            Singh
          </h1>
          <p>@ gurvindersingh-web</p>
        </div>
      </div>
    </div>
  );
};

export default memo(InkIntro);