import armorcodeLogin from '../../assets/armorcode_login.png';
import iconVulnerability from '../../assets/icon_vulnerability.png';
import iconSecurity from '../../assets/icon_security.png';
import iconCompliance from '../../assets/icon_compliance.png';
import iconPrivacy from '../../assets/icon_privacy.png';
import '../../styles/login.css';

const RightPane = () => {
  return (
    <div className="right-pane">
      <div className="brand-content">
        <img
          src={armorcodeLogin}
          alt="ArmorCode Logo"
          className="brand-logo"
        />
        <div>
          <img
            src={iconSecurity}
            alt="Security Icon"
            className="icon icon-top-left"
          />
          <img
            src={iconVulnerability}
            alt="Vulnerability Icon"
            className="icon icon-top-right"
          />
          <img
            src={iconCompliance}
            alt="Compliance Icon"
            className="icon icon-bottom-left"
          />
          <img
            src={iconPrivacy}
            alt="Privacy Icon"
            className="icon icon-bottom-right"
          />
        </div>
      </div>
    </div>
  );
};

export default RightPane;
