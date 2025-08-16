import './App.css';

import AppRoutes from './routes/AppRoutes';
import Header from './components/header/Header';
import type { RootState } from './redux/store';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

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