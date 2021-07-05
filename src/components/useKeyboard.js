import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardWillShow", (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      });
      const hideSubscription = Keyboard.addListener("keyboardWillHide", (e) => {
        setKeyboardHeight(0);
      });
  
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };     
  }, []);
  return [keyboardHeight];
};