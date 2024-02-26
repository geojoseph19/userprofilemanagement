import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import styles from './ForgotPassword.module.css'; // Import the CSS module
import { TypingAnimation } from './Animations.js';
import axios from 'axios'; // Import Axios
import LottieAnimation from './Animations.js';
axios.defaults.withCredentials = true;

function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorMessageVisible, setIsErrorMessageVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false); // State to manage showing OTP input
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false); // State to manage showing new password input
  const [mailSuccess,setMailSuccess] = useState('');
  const [showResetSuccess, setShowResetSuccess ] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setIsErrorMessageVisible(true);
      const timeout = setTimeout(() => {
        setIsErrorMessageVisible(false);
        setErrorMessage('');
      }, 5000); // Adjust the timeout duration as needed
      return () => clearTimeout(timeout);
    }
  }, [errorMessage]);

  const accountRecovery = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/v1/accountRecovery', { username });
      
      if (response.status === 200) {
        // Request successful, toggle to show OTP input
        setMailSuccess(response.data.message);
        setShowForgotPassword(false);
        setShowOtpInput(true);
      } else {
        // Handle invalid username or password
        setErrorMessage('Invalid username or password');
        setIsErrorMessageVisible(true); // Show error message container
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Check if the error response contains a message from the backend
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
        setIsErrorMessageVisible(true); // Show error message container
      } else {
        setErrorMessage('An error occurred while logging in. Please try again.');
        setIsErrorMessageVisible(true); // Show error message container
      }
    }
  };

  const verifyOTP = async () => {
    try {
      // Send OTP to backend for verification
      const response = await axios.post('http://127.0.0.1:5000/api/v1/verifyOTP', { otp });
      
      if (response.status === 200) {
        // Request successful, toggle to show new password input
        console.log(otp);
        
        setShowNewPasswordInput(true);
        setShowOtpInput(false);
      } else {
        // Handle OTP verification failure
        setErrorMessage('Invalid OTP. Please try again.');
        setIsErrorMessageVisible(true); // Show error message container
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      // Handle OTP verification error
      setErrorMessage('OTP verification failed!');
      setIsErrorMessageVisible(true); // Show error message container
    }
  };
  

  const submitNewPassword = async () => {

    if(password === '' || rePassword === ''){

      setErrorMessage('Empty input');
      setIsErrorMessageVisible(true);
    }
    else if (password === rePassword){
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/v1/resetPassword', { password });
        if (response.status === 200) {
        
          setShowNewPasswordInput(false);
          setShowResetSuccess(true);



        } else {
          setErrorMessage('Password reset failed');
          setIsErrorMessageVisible(true); 
        }
        
      } catch (error) {
        console.error('Error resetting password:', error.message);
        // Handle OTP verification error
        setErrorMessage('Weak password');
        setIsErrorMessageVisible(true); 
        
      }
    }
    else{
      setErrorMessage('Passwords does not match');
      setIsErrorMessageVisible(true);
    }
  };

  return (
    <div className={styles['body-container']}>
      <div className={styles['login-container']}>
        <div className={styles['login-left-container']}>
          <h2 style={{marginTop:'0px'}}>Forgot Password</h2>

          {showForgotPassword && (
            <form className={styles['login-form']} onSubmit={(e) => { e.preventDefault(); accountRecovery(); }}>
              <div className={styles['input-set']} style={{ display: 'block'}}>
                
                <label className={styles['input-label']} htmlFor="username">Username</label>
                <input className={styles['login-input']} type="text" id="username" placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>      
              <div className={styles['input-set']} style={{marginBottom:'30px'}}>
                <button className={styles['login-button']} style={{ padding: "0px" }} type="button">
                  <Link to="/" style={{ color: '#ffffffbf', fontSize: '18px', textDecoration: 'none', display: 'flex',alignItems:'center',justifyContent:'center', borderRadius: '12px', height: '39px' }} 
                  onMouseEnter={(e) => { 
                    e.target.style.backgroundColor = ' rgba(255, 255, 255, 0.75)';
                    e.target.style.color = 'rgba(4, 15, 73, 0.65)';
                  }}
                  onMouseLeave={(e) => { 
                    e.target.style.backgroundColor = ' rgba(255, 255, 255, 0)';
                    e.target.style.color = 'rgba(255, 255, 255, 0.75)';
                  }}>Back</Link>
                </button>
                &nbsp;&nbsp;
                <button className={styles['login-button']} type="submit">Next</button>
              </div>
            </form>
          )}
          {/*-----OTP SECTION-----*/}

          {showOtpInput && (
            <form className={styles['login-form']} onSubmit={(e) => { e.preventDefault(); verifyOTP(); }}>
              <p>{mailSuccess}</p>
              <div className={styles['input-set']} style={{ display: 'block'}}>
                <label className={styles['input-label']} htmlFor="otp">Enter OTP</label>
                <input className={styles['login-input']} type="text" id="otp" placeholder='Enter OTP' value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
              <div className={styles['input-set']} style={{marginBottom:'30px'}}>
                <button className={styles['login-button']} style={{ padding: "0px" }} type="button">
                  <Link to="/" style={{ color: '#ffffffbf', fontSize: '18px', textDecoration: 'none', display: 'flex',alignItems:'center',justifyContent:'center', borderRadius: '12px', height: '39px' }} 
                  onMouseEnter={(e) => { 
                    e.target.style.backgroundColor = ' rgba(255, 255, 255, 0.75)';
                    e.target.style.color = 'rgba(4, 15, 73, 0.65)';
                  }}
                  onMouseLeave={(e) => { 
                    e.target.style.backgroundColor = ' rgba(255, 255, 255, 0)';
                    e.target.style.color = 'rgba(255, 255, 255, 0.75)';
                  }}>Resend</Link>
                </button>
                &nbsp;&nbsp;
                <button className={styles['login-button']} type="submit">Verify</button>
              </div>
            </form>
          )}

          {showNewPasswordInput && (
            <form className={styles['login-form']} onSubmit={(e) => { e.preventDefault(); submitNewPassword(); }}>
              <p style={{textAlign:'justify'}}>Please ensure your password is at least <strong>8 characters long</strong>, contains at least <strong>one uppercase letter</strong>, <strong>one lowercase letter</strong>, <strong>one number</strong>, and <strong>one special character</strong>.</p>
              <div className={styles['input-set']} style={{ display: 'block'}}>
              <label className={styles['input-label']} htmlFor="password">New password</label>
              <div className={styles['password-input-container']} style={{marginBottom:"30px"}}>
                <input className={styles['login-input']} type={showPassword ? 'text' : 'password'} id="new_password" placeholder='Enter new password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className={styles['eye-icon']} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <span className='material-symbols-outlined'>visibility</span> : <span className='material-symbols-outlined'>visibility_off</span>}
                </div>
              </div>
            </div>
            <div className={styles['input-set']} style={{ display: 'block'}}>
              <label className={styles['input-label']} htmlFor="password">Re-type new password</label>
              <div className={styles['password-input-container']}>
                <input className={styles['login-input']} type={showRePassword ? 'text' : 'password'} id="re_new_password" placeholder='Re-type new password' value={rePassword} onChange={(e) => setRePassword(e.target.value)} />
                <div className={styles['eye-icon']} onClick={() => setShowRePassword(!showRePassword)}>
                  {showRePassword ? <span className='material-symbols-outlined'>visibility</span> : <span className='material-symbols-outlined'>visibility_off</span>}
                </div>
              </div>
            </div>


            <div className={styles['input-set']} style={{marginBottom:'30px'}}>
                <button className={styles['login-button']} style={{ padding: "0px" }} type="button">
                  <Link to="/" style={{ color: '#ffffffbf', fontSize: '18px', textDecoration: 'none', display: 'flex',alignItems:'center',justifyContent:'center', borderRadius: '12px', height: '39px' }} 
                  onMouseEnter={(e) => { 
                    e.target.style.backgroundColor = ' rgba(255, 255, 255, 0.75)';
                    e.target.style.color = 'rgba(4, 15, 73, 0.65)';
                  }}
                  onMouseLeave={(e) => { 
                    e.target.style.backgroundColor = ' rgba(255, 255, 255, 0)';
                    e.target.style.color = 'rgba(255, 255, 255, 0.75)';
                  }}>Back</Link>
                </button>
                &nbsp;&nbsp;
                <button className={styles['login-button']} type="submit">Reset</button>
              </div>


            </form>
          )}

          {isErrorMessageVisible && (
            <div className={styles['error-message']}>
              <span className='material-symbols-outlined'>error</span>
              <p style={{ display: 'inline' }}> &nbsp; {errorMessage}</p>
            </div>
          )}
          {showResetSuccess && (
            <form className={styles['login-form']} onSubmit={(e) => { e.preventDefault(); accountRecovery(); }}>

              <div style={{display:'block',width:'30%',alignItems:'center',justifyContent:'center',flexWrap:'wrap',marginLeft:'35%'}}><LottieAnimation />
              
              </div>
              <p style={{marginLeft:'15.5%', marginTop:'0px',marginBottom:'0px'}}>Password reset success!</p>
                
               
              <div className={styles['input-set']} style={{marginBottom:'30px'}}>
                <button className={styles['login-button']} style={{ padding: "0px" }} type="button">
                  <Link to="/" style={{ color: '#ffffffbf', fontSize: '18px', textDecoration: 'none', display: 'flex',alignItems:'center',justifyContent:'center', borderRadius: '12px', height: '39px' }} 
                  onMouseEnter={(e) => { 
                    e.target.style.backgroundColor = ' rgba(255, 255, 255, 0.75)';
                    e.target.style.color = 'rgba(4, 15, 73, 0.65)';
                  }}
                  onMouseLeave={(e) => { 
                    e.target.style.backgroundColor = ' rgba(255, 255, 255, 0)';
                    e.target.style.color = 'rgba(255, 255, 255, 0.75)';
                  }}>Back to login</Link>
                </button>

              </div>
            </form>
          )}
    
        </div>
        
        <div className={styles['login-right-container']}>
          <h1>Hogwarts University.</h1> 
          <p><TypingAnimation text="Igniting Futures, Inspiring Minds.." speed={100} initialDelay={1500} /></p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
