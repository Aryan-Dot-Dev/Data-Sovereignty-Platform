import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import UploadPage from './pages/UploadPage';
import UserDashboardPage from './pages/UserDashboardPage';
import CompanyDashboardPage from './pages/CompanyDashboardPage';
import './App.css';

function App() {
  return (
    <Web3Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="dashboard/user" element={<UserDashboardPage />} />
            <Route path="dashboard/company" element={<CompanyDashboardPage />} />
            <Route path="connect" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Web3Provider>
  );
}

export default App;
