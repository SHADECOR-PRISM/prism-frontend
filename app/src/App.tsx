import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Login from './pages/login.tsx'
import Home from './components/layouts/home.tsx'
import GeneralLog from './pages/requests/log.tsx'
import GeneralApplication from './pages/requests/application.tsx'
import GeneralSetting from './pages/requests/setting.tsx'
import Hello from './pages/hello.tsx'
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
          isAuthenticated ? <Navigate to="/general" replace /> : <Navigate to="/login" replace />
        } />

        {/* ログインページへの直接的なアクセス */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/general" replace /> : <Login onLoginSuccess={() => setIsAuthenticated(true)}/>
        } />

        {/* 一般ユーザーページへの直接的なアクセス */}
        <Route path="/general" element={
          isAuthenticated ? <Navigate to="/general/log" replace /> : <Navigate to="/login" replace />
        } />

        {/* ホーム画面へのアクセス */}
        <Route element={<Home />}>
          
          {/* 一般ユーザー申請履歴ページへのアクセス */}
          <Route path="/general/log" element={
            isAuthenticated ? <GeneralLog /> : <Navigate to="/login" replace />
          } />

          {/* 一般ユーザー費用申請ページへのアクセス */}
          <Route path="/general/application" element={
            isAuthenticated ? <GeneralApplication /> : <Navigate to="/login" replace />
          } />

          {/* 一般ユーザー設定ページへのアクセス */}
          <Route path="/general/setting" element={
            isAuthenticated ? <GeneralSetting /> : <Navigate to="/login" replace />
          } />

        </Route>
        
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
