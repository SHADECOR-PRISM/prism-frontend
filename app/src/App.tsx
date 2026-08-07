import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import Login from './pages/login.tsx'

import MainLayout from './components/layouts/mainLayout.tsx'
import HeaderOnlyLayout from './components/layouts/headerOnlyLayout.tsx'
import BlankLayout from './components/layouts/blankLayout.tsx'
import PageSlideLayout from './components/layouts/pageSlideLayout.tsx'

import GeneralLog from './pages/general/accounting/log.tsx'
import LogDetailPage from './pages/general/accounting/logDetailPage.tsx'
import GeneralApplication from './pages/general/accounting/application.tsx'
import GeneralSetting from './pages/general/accounting/setting.tsx'
import GeneralExpensePage from './pages/general/accounting/generalExpensePage.tsx'
import TransportExpensePage from './pages/general/accounting/transportExpensePage.tsx'
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
  const defaultTarget = userRole === 'admin' ? '/admin/approval' : '/general/log';
  
  // ガード条件判定関数
  const isGeneral = isAuthenticated && userRole === 'general';
  const isAdmin = isAuthenticated && userRole === 'admin';

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageSlideLayout />}>
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

          {/*. =========   一般ユーザーページへの直接的なアクセス.  ============ */}
          <Route path="/general" element={
            isGeneral ? <Navigate to="/general/log" replace /> : <Navigate to={defaultTarget} replace />
          } />

          {/* 一般ユーザ画面へのアクセス */}
          <Route element={<MainLayout />}>
            
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

          </Route>
          

          {/* フッター無しレイアウトへのアクセス */}
          <Route element={<HeaderOnlyLayout />}>

            {/* 交通費申請ページへのアクセス（general 専用） */}
            <Route path="/general/application/transport" element={
              isGeneral ? <TransportExpensePage /> : (isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />)
            } />

            {/* 経費申請ページへのアクセス（general 専用） */}
            <Route path="/general/application/expense" element={
              isGeneral ? <GeneralExpensePage /> : (isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />)
            } />

          </Route>

          <Route element={<BlankLayout />}>

            {/* 💡 動作テスト用: 申請詳細ページ（handle={{ slide: true }} で横スライド有効化） */}
            <Route path="/general/log/:id" element={
              isGeneral ? <LogDetailPage /> : (isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />)
            } handle={{ slide: true }} />
            
          </Route>


          {/* ============= 管理者ユーザーページへの直接的なアクセス =================== */}

          <Route path="/admin" element={
            isAdmin ? <Navigate to="/admin/approval" replace /> : <Navigate to={defaultTarget} replace />
          } />

          {/* 管理者アカウント画面へのアクセス */}
          <Route element={<MainLayout />}>

            {/* 管理者ユーザー承認ページへのアクセス（admin 専用） */}
            <Route path="/admin/approval" element={
              isAdmin ? <GeneralLog /> : (isAuthenticated ? <Navigate to={defaultTarget} replace /> : <Navigate to="/login" replace />)
            } />

          </Route>

          {/* フッター無しレイアウトへのアクセス */}
          <Route element={<HeaderOnlyLayout />}>


          </Route>



          {/* 機能ページへの直接的なアクセス */}
          {/* 今後機能を追加する場合はここにルータを追加する */}

          

          {/* どこにも当てはまらない場合 */}
          <Route path="*" element={
            <Navigate to="/" replace />
          } />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App