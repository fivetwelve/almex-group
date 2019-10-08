import { useState, useEffect } from 'react';

const checkKeyPress = (key, fn) => {
  const [isKeyPressed, setKeyPressed] = useState();

  // Only allow fetching each keypress event once to prevent infinite loops
  if (isKeyPressed) {
    setKeyPressed(false);
  }

  const downHandler = event => {
    if (event.key === key) {
      setKeyPressed(true);
      fn();
    }
  };

  useEffect(() => {
    // const downHandler = event => {
    //   if (event.key === key) {
    //     setKeyPressed(true);
    //     fn();
    //   }
    // };
    window.addEventListener('keydown', downHandler);
    return () => window.removeEventListener('keydown', downHandler);
  }, [key]);

  return isKeyPressed;
};

export default checkKeyPress;
