import React, { useState, useEffect } from 'react';

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

  return <>{displayText}</>;
}
