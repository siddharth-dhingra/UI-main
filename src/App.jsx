import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/FindingComponents/SideBar';
import AppHeader from './components/FindingComponents/AppHeader'
import DashboardPage from './pages/DashboardPage';
import FindingsPage from './pages/FindingsPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import TicketsPage from './pages/TicketsPage';
import RunbooksPage from './pages/RunbookPage';

const { Content } = Layout;

function MainLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <AppHeader />
        <Content style={{ margin: '24px', background: '#fff', padding: '24px' }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/findings" element={<FindingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/runbooks" element={<RunbooksPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* The login route does NOT use your main layout. */}
        <Route path="/login" element={<LoginPage />} />

        {/* All other routes use your main layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;