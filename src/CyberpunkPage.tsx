import React, { useEffect, useState, Suspense } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { gsap } from 'gsap';

// Lazy load Three.js for better performance
const ThreeJSComponent = React.lazy(() => import('./ThreeJSBackground'));

const Container = styled.div`
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  background-image: radial-gradient(circle, rgba(0, 123, 255, 0.3) 1px, transparent 1px);
  background-size: 20px 20px;
  overflow: hidden;
  font-family: 'Futura', sans-serif;
  color: #333333;
  position: relative;
  width: 100vw;
  height: 100vh;
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

interface MouseCoordsProps {
  top: number;
  left: number;
}

const MouseCoords = styled.div<MouseCoordsProps>`
  position: fixed;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  z-index: 2;
  color: #007bff;
  font-size: 12px;
  font-family: 'Futura', sans-serif;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 4px;
  border-radius: 4px;
`;

const CyberpunkPage: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [info, setInfo] = useState({
    time: '',
    date: '',
    browser: '',
    language: '',
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
      <Suspense fallback={<div>Loading...</div>}>
        <ThreeJSComponent />
      </Suspense>
      <MouseCoords top={mousePos.y + 20} left={mousePos.x + 20}>
        x: {mousePos.x}<br />
        y: {mousePos.y}
      </MouseCoords>
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