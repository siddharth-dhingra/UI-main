import { useState } from 'react';
import googleLogin from '../../assets/google_login2.png';
import '../../styles/login.css';

const LoginButton = () => {
  const [hovered, setHovered] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8083/oauth2/authorization/google';
  };

  return (
    <button
      className={`google-button ${hovered ? 'google-button-hover' : ''}`}
      onClick={handleGoogleLogin}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={googleLogin} alt="Google Logo" className="google-logo" />
      Sign in using Google
    </button>
  );
};

export default LoginButton;
