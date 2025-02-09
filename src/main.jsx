import ReactDOM from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css'; // or 'antd/dist/antd.css' for older versions
import { UserProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <App />
  </UserProvider>)