import armorcodeLogin from '../assets/armorcode_login.png';
import armorCodeLogo from '../assets/armorcode_logo_blue.svg';
import googleLogin from '../assets/google_login2.png';
import iconVulnerability from '../assets/icon_vulnerability.png';
import iconSecurity from '../assets/icon_security.png';
import iconCompliance from '../assets/icon_compliance.png';
import iconPrivacy from '../assets/icon_privacy.png';

function LoginPage() {

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8083/oauth2/authorization/google';
  };

  return (
    <div style={styles.container}>
      {/* Left Pane: Login Form */}
      <div style={styles.leftPane}>
        <img
          src={armorCodeLogo}
          alt="Armorcode small logo"
          style={styles.logoTopLeft}
        />
        <div style={styles.leftContent}>
          <h1 style={styles.title}>Welcome!</h1>
          <h3 style={styles.subtitle}>Please sign in to continue.</h3>
          <button style={styles.googleButton} onClick={handleGoogleLogin}>
            <img
              src={googleLogin}
              alt="Google Logo"
              style={styles.googleLogo}
            />
            Sign in using Google
          </button>
        </div>
      </div>

      {/* Right Pane: Branding/Graphics */}
      <div style={styles.rightPane}>
        <div style={styles.brandContent}>
          <img
            src={armorcodeLogin}
            alt="ArmorCode Logo"
            style={styles.brandLogo}
          />
          <div style={styles.iconsRow}>
            <img
              src={iconSecurity}
              alt="Security Icon"
              style={{ ...styles.icon, ...styles.iconTopLeft }}
            />
            <img
              src={iconVulnerability}
              alt="Vulnerability Icon"
              style={{ ...styles.icon, ...styles.iconTopRight }}
            />
            <img
              src={iconCompliance}
              alt="Compliance Icon"
              style={{ ...styles.icon, ...styles.iconBottomLeft }}
            />
            <img
            src={iconPrivacy}
            alt="Monitoring Icon"
            style={{ ...styles.icon, ...styles.iconBottomRight }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'sans-serif',
  },
  leftPane: {
    position: 'relative', // allows absolute positioning for the top-left logo
    flex: 0.35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // The small ArmorCode logo in top-left corner
  logoTopLeft: {
    position: 'absolute',
    top: '30px',
    left: '30px',
    width: '200px', // adjust as desired
    height: 'auto',
  },
  leftContent: {
    maxWidth: '360px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '8px',
    fontSize: '32px',
  },
  subtitle: {
    marginBottom: '24px',
    color: '#555',
  },
  googleButton: {
    cursor: 'pointer',
    padding: '12px 24px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#fff',
    boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
    display: 'inline-flex',
    alignItems: 'center',
  },
  googleLogo: {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  },
  rightPane: {
    flex: 0.8,
    backgroundColor: '#fafafa',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  brandContent: {
    position: 'relative',
    width: '900px',
    height: '650px', // tall enough for scattered icons
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // center the main logo & text vertically
    alignItems: 'center',     // center them horizontally
    textAlign: 'center',
  },
  brandLogo: {
    width: '900px',
    marginBottom: '16px',
    zIndex: 2, // ensures the logo is above any icons behind it
  },
  brandText: {
    zIndex: 2,
    marginTop: 0,
    marginBottom: 0,
  },

  // All icons share these base styles
  icon: {
    position: 'absolute',
    width: '60px',
    height: '60px',
    opacity: 0.5, // reduced opacity
    objectFit: 'contain',
    zIndex: 1,
  },
  // 2 icons "above" the logo
  iconTopLeft: {
    top: '-50px',
    left: '-100px',
  },
  iconTopRight: {
    top: '-50px',
    right: '-100px',
  },
  // 2 icons "below" the logo
  iconBottomLeft: {
    bottom: '-50px',
    left: '-100px',
  },
  iconBottomRight: {
    bottom: '-50px',
    right: '-100px',
  },
};


export default LoginPage;
