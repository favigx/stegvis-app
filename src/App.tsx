import './App.css';
import Footer from './layout/Footer';
import Header from './layout/Header';
import MainContainer from './layout/MainContainer';
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUserProfile } from './redux/slices/profileSlice';
import { fetchUserPreferences } from './redux/slices/userPreferenceSlice';
import type { RootState } from './redux/store';
import { useAppDispatch } from './redux/hooks';
import './api/interceptors';
import Sidebar from './layout/Sidebar';

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
      dispatch(fetchUserPreferences());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <BrowserRouter>
      {isAuthenticated && (
        <Header collapsed={sidebarOpen} setCollapsed={setSidebarOpen} />
      )}

      {isAuthenticated && (
        <Sidebar collapsed={sidebarOpen} setCollapsed={setSidebarOpen} />
      )}

      {isAuthenticated ? (
        <MainContainer />
      ) : (
        <>
          <AppRoutes />
          <div style={{ paddingTop: "70px" }}>
            <Footer />
          </div>
        </>
      )}
    </BrowserRouter>
  );
}


export default App;
