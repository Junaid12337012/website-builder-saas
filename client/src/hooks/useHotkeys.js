import { useEffect } from 'react';

export const useHotkeys = (keys, callback, deps = []) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
      
      // Check if the key combination matches
      const modifiers = {
        ctrl: ctrlKey || metaKey,
        shift: shiftKey,
        alt: altKey
      };
      
      const keyString = keys.toLowerCase();
      const pressedKey = key.toLowerCase();
      
      // Simple key matching for common shortcuts
      if (keyString.includes('ctrl+') && modifiers.ctrl) {
        const targetKey = keyString.replace('ctrl+', '');
        if (pressedKey === targetKey) {
          event.preventDefault();
          callback(event);
        }
      } else if (keyString.includes('shift+') && modifiers.shift) {
        const targetKey = keyString.replace('shift+', '');
        if (pressedKey === targetKey) {
          event.preventDefault();
          callback(event);
        }
      } else if (pressedKey === keyString) {
        callback(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, deps);
};

export default useHotkeys;
