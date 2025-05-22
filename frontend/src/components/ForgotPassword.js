import React, { useState, useRef } from 'react';

const ForgotPassword = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1);
  const [contactMethod, setContactMethod] = useState('sms'); // 'sms' or 'email'
  const [contactValue, setContactValue] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const otpRefs = useRef([]);

  const handleContactMethodChange = (method) => {
    setContactMethod(method);
    setContactValue('');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return; // only digits allowed
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index]) {
      if (index > 0) {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  const handleSendOtp = () => {
    if (!contactValue) {
      alert('Please enter your email or phone number');
      return;
    }
    // Mock sending OTP
    alert(`OTP sent to ${contactValue}`);
    setStep(3);
  };

  const handleVerifyOtp = () => {
    if (otp.some(d => d === '')) {
      alert('Please enter complete OTP');
      return;
    }
    // Mock verify OTP
    setStep(4);
  };

  const handleSavePassword = () => {
    if (!newPassword || !confirmPassword) {
      alert('Please fill both password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Mock save password
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onComplete();
    }, 3000);
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>Back</button>

      {step === 1 && (
        <>
          <h2 style={styles.title}>Forgot Password</h2>
          <p>Select which contact details should we use to reset your password</p>
          <div style={styles.contactOptions}>
            <label style={{...styles.contactOption, borderColor: contactMethod === 'sms' ? '#FFC107' : '#ccc'}}>
              <input
                type="radio"
                name="contactMethod"
                value="sms"
                checked={contactMethod === 'sms'}
                onChange={() => handleContactMethodChange('sms')}
                style={{display: 'none'}}
              />
              <div>Via SMS</div>
              <div>*****970</div>
            </label>
            <label style={{...styles.contactOption, borderColor: contactMethod === 'email' ? '#FFC107' : '#ccc'}}>
              <input
                type="radio"
                name="contactMethod"
                value="email"
                checked={contactMethod === 'email'}
                onChange={() => handleContactMethodChange('email')}
                style={{display: 'none'}}
              />
              <div>Via Email</div>
              <div>***@xyz.com</div>
            </label>
          </div>
          <button onClick={() => setStep(2)} style={styles.button}>Continue</button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={styles.title}>Verification email or phone number</h2>
          <input
            type="text"
            placeholder={contactMethod === 'sms' ? 'Phone number' : 'Email'}
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSendOtp} style={styles.button}>Send OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 style={styles.title}>Forgot Password</h2>
          <p>Code has been sent to {contactMethod === 'sms' ? '*****970' : '***@xyz.com'}</p>
          <div style={styles.otpContainer}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                style={styles.otpInput}
                ref={(el) => (otpRefs.current[idx] = el)}
              />
            ))}
          </div>
          <p>
            Didn't receive code?{' '}
            <span style={styles.link} onClick={() => alert('Resend OTP (mock)')}>Resend again</span>
          </p>
          <button onClick={handleVerifyOtp} style={styles.button}>Verify</button>
        </>
      )}

      {step === 4 && (
        <>
          <h2 style={styles.title}>Set New password</h2>
          <input
            type="password"
            placeholder="Enter Your New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
          <p>At least 1 number or a special character</p>
          <button onClick={handleSavePassword} style={styles.button}>Save</button>
        </>
      )}

      {showSuccess && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.successIcon}>✔</div>
            <p>Your account is ready to use. You will be redirected to the Home Page in a few seconds.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    maxWidth: 400,
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  },
  backButton: {
    marginBottom: 10,
    background: 'none',
    border: 'none',
    color: '#FFC107',
    cursor: 'pointer',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  contactOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    marginBottom: 20,
  },
  contactOption: {
    border: '2px solid #ccc',
    borderRadius: 10,
    padding: 15,
    cursor: 'pointer',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderRadius: 10,
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#FFC107',
    color: 'white',
    border: 'none',
    padding: 15,
    width: '100%',
    fontSize: 18,
    cursor: 'pointer',
    borderRadius: 10,
  },
  otpContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  otpInput: {
    width: 40,
    height: 40,
    fontSize: 24,
    textAlign: 'center',
  },
  link: {
    color: '#FFC107',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    textAlign: 'center',
    maxWidth: 300,
  },
  successIcon: {
    fontSize: 48,
    color: '#4BB543',
    marginBottom: 20,
  },
};

export default ForgotPassword;
