import React, { useState, useEffect } from 'react';
import "./Signin.css";

import password_icon from '../Assets/password.png';
import email_icon from '../Assets/email.png';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //This function handles the google Oauth response
  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
  
    const endpoint = 'http://localhost:5000/users/google-auth'; 
  
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: response.credential }),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Asd")

      if (data.success) {
        console.log('Google Sign-In successful:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/journal'; // Redirect to home
      } else {
        alert(data.message);        
      }
    })
    .catch(error => {
      console.error('Error during Google Sign-In:', error);
      alert('An error occurred during Google Sign-In');
    });
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "870205317500-9gjs5gfkrmd36mhmntj0f8uq81q81s3m.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInButton"),
      { theme: "outline", size: "large" }
    );
  }, []);
  
  //This function handle signing in through normal input
  const handleSignin = async (event) => {
    event.preventDefault();
    console.log('Signin attempted');

    const endpoint = 'http://localhost:5000/users/signin';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Signin successful:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.result));
        window.location.href = '/journal';
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="header">
      <div className="text"> Welcome Back! </div>
      <div className="underline"> </div>
      </div>
      <form className="signin-form" onSubmit={handleSignin}>
        <div className="inputs">
          <div className="input">
            <img src={email_icon} alt="" />
            <input type="email" placeholder="Email" name="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input type="password" placeholder="Password" name="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}/>
          </div>
        </div>
        <button type="submit">Sign In</button>
        <div className="separator">
          <span>Or</span>
        </div>
        <div id="googleSignInButton"></div> {/* Google Sign-In button will be rendered here */}
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </form>
    </div>
  );
};

export default Signin;
