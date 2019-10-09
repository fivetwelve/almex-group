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
    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  });

  return isKeyPressed;
};

export default checkKeyPress;
