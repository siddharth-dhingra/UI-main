import armorCodeLogo from '../../assets/armorcode_logo_blue.svg';
import LoginButton from './LoginButton';
import '../../styles/login.css';

const LeftPane = () => {
  return (
    <div className="left-pane">
      <img
        src={armorCodeLogo}
        alt="Armorcode small logo"
        className="logo-top-left"
      />
      <div className="left-content">
        <h1 className="title">Welcome!</h1>
        <h3 className="subtitle">Please sign in to continue.</h3>
        <LoginButton />
      </div>
    </div>
  );
};

export default LeftPane;
