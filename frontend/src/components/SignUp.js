import React, { useState } from 'react';

const SignUp = ({ onBack, onSignIn }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    otp: ['', '', '', '', '', ''],
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData((prev) => ({ ...prev, otp: newOtp }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };

  const handleSubmit = () => {
    alert('Registration complete (mock)');
    onSignIn();
  };

  return (
    <div style={styles.container}>
      <button onClick={handleBack} style={styles.backButton}>Back</button>
      {step === 1 && (
        <>
          <h2 style={styles.title}>Sign up</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your mobile number"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <button onClick={handleNext} style={styles.button}>Sign Up</button>
          <p style={styles.or}>or</p>
          <div style={styles.socialButtons}>
            <button style={styles.socialButton}>G</button>
            <button style={styles.socialButton}>F</button>
            <button style={styles.socialButton}>O</button>
          </div>
          <p>
            Already have an account?{' '}
            <span style={styles.link} onClick={onSignIn}>Sign in</span>
          </p>
        </>
      )}
      {step === 2 && (
        <>
          <h2 style={styles.title}>Phone verification</h2>
          <p>Enter your OTP code</p>
          <div style={styles.otpContainer}>
            {formData.otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                style={styles.otpInput}
              />
            ))}
          </div>
          <p>
            Didn't receive code?{' '}
            <span style={styles.link} onClick={() => alert('Resend OTP (mock)')}>Resend again</span>
          </p>
          <button onClick={handleNext} style={styles.button}>Verify</button>
        </>
      )}
      {step === 3 && (
        <>
          <h2 style={styles.title}>Set password</h2>
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />
          <p>At least 1 number or a special character</p>
          <button onClick={handleSubmit} style={styles.button}>Register</button>
        </>
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
  input: {
    display: 'block',
    width: '100%',
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFC107',
    color: 'white',
    border: 'none',
    padding: 15,
    width: '100%',
    fontSize: 18,
    cursor: 'pointer',
    marginBottom: 15,
  },
  or: {
    textAlign: 'center',
    marginBottom: 15,
  },
  socialButtons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  socialButton: {
    backgroundColor: '#eee',
    border: 'none',
    padding: 10,
    fontSize: 18,
    cursor: 'pointer',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  link: {
    color: '#FFC107',
    cursor: 'pointer',
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
};

export default SignUp;
