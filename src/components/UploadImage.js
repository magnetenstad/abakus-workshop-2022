import React, { useContext } from 'react';
import { AppContext } from '../state/context';

const UploadAndDisplayImage = () => {
  const context = useContext(AppContext);

  return (
    <div>
      <input
        type="file"
        name="my-image"
        text="test"
        onChange={(event) => {
          context.image.set(event.target.files[0]);
        }}
      />
      <button onClick={() => context.image.set(null)}>Remove</button>
    </div>
  );
};

export default UploadAndDisplayImage;
