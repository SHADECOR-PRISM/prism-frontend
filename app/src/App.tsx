import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import Login from './pages/login.tsx'
import HomeWithFooter from './components/layouts/homeWithFooter.tsx'
import HomeWithoutFooter from './components/layouts/homeWithoutFooter.tsx'
import GeneralLog from './pages/requests/log.tsx'
import GeneralApplication from './pages/requests/application.tsx'
import GeneralSetting from './pages/requests/setting.tsx'
import GeneralExpensePage from './pages/requests/generalExpensePage.tsx'
import TransportExpensePage from './pages/requests/transportExpensePage.tsx'
import apiClient, {setAccessToken} from './api/axiosInstance.tsx'
import './App.css'


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'general'>('general');

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await apiClient.post('/refresh');
        
        const role = res.data?.role;
        if (!role) {
          throw new Error("Missing role in refresh response");
        }

        setAccessToken(res.data.access_token);
        setUserRole(role as 'admin' | 'general');
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

  // 権限ごとのデフォルトトップ画面
  const defaultTarget = userRole === 'admin' ? '/admin/log' : '/general/log';
  
  // ガード条件判定関数
  const isGeneral = isAuthenticated && userRole === 'general';
  const isAdmin = isAuthenticated && userRole === 'admin';

  return (
    <BrowserRouter>
      <Routes>
        {/* ルートページへのアクセス */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />
        } />

        {/* ログインページへの直接的なアクセス */}
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to={defaultTarget} replace />
          ) : (
            <Login 
              onLoginSuccess={(role) => {
                setUserRole(role);
                setIsAuthenticated(true);
              }}
            />
          )
        } />

        {/* 一般ユーザーページへの直接的なアクセス */}
        <Route path="/general" element={
          isGeneral ? <Navigate to="/general/log" replace /> : <Navigate to={defaultTarget} replace />
        } />

        {/* 管理者ユーザーページへの直接的なアクセス */}
        <Route path="/admin" element={
          isAdmin ? <Navigate to="/admin/log" replace /> : <Navigate to={defaultTarget} replace />
        } />

        {/* ホーム画面へのアクセス */}
        <Route element={<HomeWithFooter />}>
          
          {/* 一般ユーザー申請履歴ページへのアクセス（general 専用） */}
          <Route path="/general/log" element={
            isGeneral ? <GeneralLog /> : (isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />)
          } />

          {/* 一般ユーザー費用申請ページへのアクセス（general 専用） */}
          <Route path="/general/application" element={
            isGeneral ? <GeneralApplication /> : (isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />)
          } />

          {/* 一般ユーザー設定ページへのアクセス（general 専用） */}
          <Route path="/general/setting" element={
            isGeneral ? <GeneralSetting /> : (isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />)
          } />

          {/* 💡 追加: 管理者ユーザー申請履歴ページへのアクセス（admin 専用） */}
          <Route path="/admin/log" element={
            isAdmin ? <GeneralLog /> : (isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />)
          } />

        </Route>



        {/* フッター無しレイアウトへのアクセス */}
        <Route element={<HomeWithoutFooter />}>

          {/* 交通費申請ページへのアクセス（general 専用） */}
          <Route path="/general/application/transport" element={
            isGeneral ? <TransportExpensePage /> : (isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />)
          } />

          {/* 経費申請ページへのアクセス（general 専用） */}
          <Route path="/general/application/expense" element={
            isGeneral ? <GeneralExpensePage /> : (isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />)
          } />

        </Route>
        

        {/* 機能ページへの直接的なアクセス */}
        {/* 今後機能を追加する場合はここにルータを追加する */}
        <Route path="/hello" element={
          isGeneral ? <GeneralExpensePage /> : (isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />)
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