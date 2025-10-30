import React, { useRef, useEffect, useState, Suspense } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { gsap } from 'gsap';

// Lazy load Three.js for better performance
const ThreeJSComponent = React.lazy(() => import('./ThreeJSBackground'));

const Container = styled.div`
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  overflow: hidden;
  font-family: 'Futura', sans-serif;
  color: #333333;
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Title = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 3;
  color: #007bff;
  font-family: 'Arial', sans-serif;

  h1 {
    font-size: 3em;
    margin: 0;
    font-weight: bold;
  }

  p {
    font-size: 1.2em;
    margin: 5px 0 0 0;
    font-weight: normal;
  }

  .japanese {
    font-size: 1em;
    margin: 10px 0 0 0;
    letter-spacing: 3px;
  }
`;

const InfoBlock = styled.div`
  background: #007bff;
  border: 1px solid #ffffff;
  padding: 10px;
  font-size: 12px;
  color: #ffffff;
  cursor: move;
  user-select: none;
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 3;
`;

const CyberpunkPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [info, setInfo] = useState({
    time: '',
    date: '',
    browser: '',
    language: '',
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 123, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      const v1 = canvas.width * 0.3;
      const v2 = canvas.width * 0.7;
      ctx.beginPath();
      ctx.moveTo(v1, 0);
      ctx.lineTo(v1, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(v2, 0);
      ctx.lineTo(v2, canvas.height);
      ctx.stroke();

      const h1 = canvas.height * 0.4;
      const h2 = canvas.height * 0.8;
      ctx.beginPath();
      ctx.moveTo(0, h1);
      ctx.lineTo(canvas.width, h1);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, h2);
      ctx.lineTo(canvas.width, h2);
      ctx.stroke();

      ctx.fillStyle = '#007bff';
      ctx.font = '12px Futura';
      ctx.fillText(`x: ${mousePos.x}`, mousePos.x + 20, mousePos.y + 20);
      ctx.fillText(`y: ${mousePos.y}`, mousePos.x + 20, mousePos.y + 34);

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePos]);

  useEffect(() => {
    const updateInfo = () => {
      const now = new Date();
      setInfo({
        time: now.toLocaleTimeString(),
        date: now.toLocaleDateString(),
        browser: navigator.userAgent.substring(0, 30) + '...',
        language: navigator.language,
      });
    };

    updateInfo();
    const interval = setInterval(updateInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP animation for title entrance
  useEffect(() => {
    gsap.fromTo('.title', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1 });
  }, []);

  return (
    <Container>
      <Canvas ref={canvasRef} />
      <Suspense fallback={<div>Loading...</div>}>
        <ThreeJSComponent />
      </Suspense>
      <Title className="title">
        <h1>XAPA® '26</h1>
        <p>Creative Development<br />& Experience Designer</p>
        <p className="japanese">人間の心は究極の創造者だ。</p>
      </Title>
      <Draggable>
        <InfoBlock>
          Time: {info.time}<br />
          Date: {info.date}<br />
          Browser: {info.browser}<br />
          Language: {info.language}
        </InfoBlock>
      </Draggable>
    </Container>
  );
};

export default CyberpunkPage;