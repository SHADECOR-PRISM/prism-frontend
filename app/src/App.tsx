import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Hello from './pages/hello.tsx'
import Login from './pages/login.tsx'
import apiClient, {setAccessToken} from './api/axiosInstance.tsx'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await apiClient.post('/refresh');
        setAccessToken(res.data.access_token);
        setIsAuthenticated(true);
      } 
      catch {
        setIsAuthenticated(false);
      } 
      finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  if (isLoading) {
    return <div>Loading PRISM...</div>;
  }
  
  return (
    <BrowserRouter>
      <Routes>
        {/* ルートページへのアクセス */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/hello" replace /> : <Navigate to="/login" replace />
        } />

        {/* ログインページへの直接的なアクセス */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/hello" replace /> : <Login onLoginSuccess={() => setIsAuthenticated(true)}/>
        } />

        {/* 機能ページへの直接的なアクセス */}
        {/* 今後機能を追加する場合はここにルータを追加する */}
        <Route path="/hello" element={
          isAuthenticated ? <Hello /> : <Navigate to="/login" replace />
        } />
        
        {/* どこにも当てはまらない場合 */}
        <Route path="*" element={
          <Navigate to="/" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App
