import React from 'react';
import { SpinWheel } from 'spin-wheel-game';

const segments = [
    { segmentText: '00', segColor: 'darkred' },
    { segmentText: '11', segColor: 'darkblue' },
    { segmentText: '55', segColor: 'darkgreen' },
    { segmentText: '66', segColor: 'purple' },
    { segmentText: '77', segColor: 'grey' },
  ];

const MySpinWheel = () => {
  const handleSpinFinish = (result) => {
    console.log(`Spun to: ${result}`);
    // Handle the result as needed
  };

  const spinWheelProps = {
    segments,
    onFinished: handleSpinFinish,
    primaryColor: 'black',
    contrastColor: 'white',
    buttonText: 'Spin',
    isOnlyOnce: false,
    size: 290,
    upDuration: 100,
    downDuration: 600,
    fontFamily: 'Arial',
    arrowLocation: 'top',
    showTextOnSpin: true,
    isSpinSound: true,
  };

  return <SpinWheel {...spinWheelProps} />;
};

// export default MySpinWheel;
export const SpinWheelsPage1 = () => (
  <div>
    <h1>Spin Wheels 3</h1>
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <MySpinWheel id="wheel3" segments={segments} />
    </div>
  </div>
);
export const SpinWheelsPage2 = () => (
  <div>
    <h1>Spin Wheels 3</h1>
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <MySpinWheel id="wheel3" segments={segments} />
    </div>
  </div>
);
export const SpinWheelsPage3 = () => (
  <div>
    <h1>Spin Wheels 3</h1>
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <MySpinWheel id="wheel3" segments={segments} />
    </div>
  </div>
);