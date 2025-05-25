import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import IntroSlide from './components/IntroSlide';
import LocationPermission from './components/LocationPermission';
import WelcomePage from './components/WelcomePage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Profile from './components/Profile';
import PostLoginPage from './components/PostLoginPage';
import BookingPage from './components/BookingPage';
import BookingPage2 from './components/BookingPage2';

import IntroImage1 from './assets/images/IntroImage1.png';
import IntroImage2 from './assets/images/IntroImage2.png';
import IntroImage3 from './assets/images/IntroImage3.png';

const slides = [
  {
    key: 'slide1',
    title: 'Anywhere you are',
    description: 'Wherever life takes you, we’ll drive.',
    imageUrl: IntroImage1,
  },
  {
    key: 'slide2',
    title: 'At anytime',
    description: 'Late night? Early flight? We’ve got you.',
    imageUrl: IntroImage2,
  },
  {
    key: 'slide3',
    title: 'Book your car',
    description: "Tap, book, and ride - it's that simple.",
    imageUrl: IntroImage3,
  },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < slides.length) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === slides.length) {
      setCurrentStep(currentStep + 1); // Move to LocationPermission page
    } else if (currentStep === slides.length + 1) {
      setCurrentStep(currentStep + 1); // Move to WelcomePage
    }
  };

  const handleSkip = () => {
    if (currentStep < slides.length) {
      setCurrentStep(slides.length + 1); // Skip intro slides to LocationPermission
    } else if (currentStep === slides.length + 1) {
      setCurrentStep(currentStep + 1); // Skip LocationPermission to WelcomePage
    }
  };

  const handleUseLocation = () => {
    // For now, just proceed to WelcomePage
    setCurrentStep(slides.length + 2);
  };

  const handleCreateAccount = () => {
    setCurrentStep(slides.length + 3); // Move to SignUp
  };

  const handleLogin = () => {
    setCurrentStep(slides.length + 4); // Move to SignIn
  };

  const handleSignUpBack = () => {
    setCurrentStep(slides.length + 2); // Back to WelcomePage
  };

  const handleSignInBack = () => {
    setCurrentStep(slides.length + 2); // Back to WelcomePage
  };

  const handleProfileBack = () => {
    setCurrentStep(slides.length + 5); // Back to PostLoginPage
  };

  const handleLoginSuccess = () => {
    setCurrentStep(slides.length + 5); // Move to PostLoginPage after successful login
  };

  const handlePostLoginRedirect = () => {
    setCurrentStep(slides.length + 7); // Move to BookingPage2 after PostLoginPage
  };

  const handleBookingBack = () => {
    setCurrentStep(slides.length + 5); // Back to PostLoginPage
  };

  if (currentStep === 0) {
    return <SplashScreen onNext={handleNext} />;
  }

  if (currentStep === slides.length + 7) {
    return <BookingPage2 />;
  }

  if (currentStep > slides.length + 6) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>End of flow</h2>
        <p>Implement further navigation as needed.</p>
      </div>
    );
  }

  if (currentStep === slides.length + 6) {
    return <BookingPage onBack={handleBookingBack} />;
  }

  if (currentStep >= 1 && currentStep <= slides.length) {
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

  if (currentStep === slides.length + 1) {
    return <LocationPermission onUseLocation={handleUseLocation} onSkip={handleSkip} />;
  }

  if (currentStep === slides.length + 2) {
    return <WelcomePage onCreateAccount={handleCreateAccount} onLogin={handleLogin} />;
  }

  if (currentStep === slides.length + 3) {
    return <SignUp onBack={handleSignUpBack} onSignIn={() => setCurrentStep(slides.length + 4)} />;
  }

  if (currentStep === slides.length + 4) {
    return <SignIn onBack={handleSignInBack} onSignUp={() => setCurrentStep(slides.length + 3)} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentStep === slides.length + 5) {
    return <PostLoginPage onRedirect={handlePostLoginRedirect} />;
  }

  if (currentStep === slides.length + 6) {
    return <BookingPage onBack={handleBookingBack} />;
  }

  return null;
}

export default App;
