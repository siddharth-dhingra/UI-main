import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/SideBar';
import AppHeader from './components/AppHeader'
import DashboardPage from './pages/DashboardPage';
import FindingsPage from './pages/FindingsPage';
import SettingsPage from './pages/SettingsPage';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />

        <Layout>
          {/* Header with Scan Button */}
          <AppHeader />

          {/* Main Content Area */}
          <Content style={{ margin: '24px', background: '#fff', padding: '24px' }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/findings" element={<FindingsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
