import React, { useContext } from 'react';
import { AppContext } from '../state/context';

const OverlayImage = () => {
  const context = useContext(AppContext);

  return (
    <div>
      {context.image.value && (
        <div>
          <img
            alt="not found"
            style={{
              width: '40%',
              position: 'fixed',
              top: '20%',
              left: '30%',
              margin: '400 auto',
              zIndex: 9999,
              opacity: '30%',
              pointerEvents: 'none',
            }}
            src={URL.createObjectURL(context.image.value)}
          />
        </div>
      )}
    </div>
  );
};

export default OverlayImage;
