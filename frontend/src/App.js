import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import IntroSlide from './components/IntroSlide';

const slides = [
  {
    key: 'slide1',
    title: 'Anywhere you are',
    description: 'Sell houses easily with the help of Listenoryx and to make this line big I am writing more.',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // placeholder image URL
  },
  {
    key: 'slide2',
    title: 'At anytime',
    description: 'Sell houses easily with the help of Listenoryx and to make this line big I am writing more.',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // placeholder image URL
  },
  {
    key: 'slide3',
    title: 'Book your car',
    description: 'Sell houses easily with the help of Listenoryx and to make this line big I am writing more.',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // placeholder image URL
  },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < slides.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(slides.length);
  };

  if (currentStep === 0) {
    return <SplashScreen onNext={handleNext} />;
  }

  if (currentStep > slides.length) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>Intro Completed</h2>
        <p>Proceed to Sign In / Sign Up pages.</p>
      </div>
    );
  }

  const slide = slides[currentStep - 1];

  return (
    <IntroSlide
      title={slide.title}
      description={slide.description}
      imageUrl={slide.imageUrl}
      onNext={handleNext}
      onSkip={handleSkip}
      isLast={currentStep === slides.length}
    />
  );
}

export default App;
