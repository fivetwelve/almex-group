import { useState, useEffect } from 'react';

const checkKeyPress = (key, fn) => {
  const [isKeyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = event => {
      if (event.key === key) {
        setKeyPressed(true);
        fn();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', downHandler);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', downHandler);
      }
    };
  });

  return isKeyPressed;
};

export default checkKeyPress;
