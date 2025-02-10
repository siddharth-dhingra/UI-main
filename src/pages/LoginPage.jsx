import LeftPane from '../components/LoginPageComponents/LeftPane';
import RightPane from '../components/LoginPageComponents/RightPane';
import '../styles/login.css';

const LoginPage = () => {
  return (
    <div className="container">
      <LeftPane />
      <RightPane />
    </div>
  );
};

export default LoginPage;
