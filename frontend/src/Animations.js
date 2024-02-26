import React, { useState,useRef, useEffect } from 'react';
import lottie from 'lottie-web';
import animationData from './assets/icons/icons8-success.json';

export function TypingAnimation({ text, speed, initialDelay }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;
    let delayTimer;

    // Function to start typing after initial delay
    const startTyping = () => {
      delayTimer = setInterval(() => {
        setDisplayText((prevText) => {
          if (index < text.length) {
            return prevText + text[index++];
          } else {
            clearInterval(delayTimer);
            return prevText;
          }
        });
      }, speed);
    };

    // Start typing after initial delay
    const delayTimeout = setTimeout(() => {
      startTyping();
    }, initialDelay);

    // Cleanup function
    return () => {
      clearTimeout(delayTimeout);
      clearInterval(delayTimer);
    };
  }, [text, speed, initialDelay]);

  return <div>{displayText}</div>;
}

const LottieAnimation = () => {
  const container = useRef(null);

  useEffect(() => {
    if (container.current) {
      lottie.loadAnimation({
        container: container.current,
        animationData: animationData,
        renderer: 'svg', // Use SVG renderer
        loop: true, // Optional
        autoplay: true, // Optional
      });
    }
  }, []);

  return <div ref={container}></div>;
};

export default LottieAnimation;