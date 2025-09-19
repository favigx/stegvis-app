import './App.css';
import Sidebar from './layout/Sidebar';
import Footer from './layout/Footer';
import Header from './layout/Header';
import MainContainer from './layout/MainContainer';
import type { RootState } from './redux/store';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import './api/interceptors.ts';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // State för kollaps

  return (
    <BrowserRouter>
      {isAuthenticated && (
        <Header
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed} // Header-knappen styr sidebar
        />
      )}

      {isAuthenticated && <Sidebar collapsed={sidebarCollapsed} />}

      {isAuthenticated ? (
        <MainContainer collapsed={sidebarCollapsed} /> 
      ) : (
        <div style={{ paddingTop: '70px' }}>
          <Footer />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
