import './App.css';

import AppRoutes from './routes/AppRoutes';
import Header from './layout/Header.tsx';
import type { RootState } from './redux/store';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './api/interceptors.ts' 

function App() {

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)


  return (
    
    <BrowserRouter>
    {isAuthenticated && <Header/>}
      <main>
        <AppRoutes />
      </main>

    </BrowserRouter>
  );
}

export default App;