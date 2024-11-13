import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';

import './App.css';

import Header from './components/Header';
import SideBar from './components/SideBar';
import SubwaySearchPage from './pages/SubwaySearchPage';
import LoginPage from './pages/LoginPage';
import SubwayLivePage from './pages/SubwayLivePage';
import MyPage from './pages/MyPage';
import SubwayRoutePage from './pages/SubwayRoutePage';

import { sidebarState } from './atoms/atom';

const RootLayout = () => {
  const isSidebarOpen = useRecoilValue(sidebarState);

  return (
    <>
      <Header /> {/* 고정된 Header */}
      {isSidebarOpen && <SideBar />} {/* 사이드바를 상태에 따라 표시 */}
      <Outlet /> {/* 라우팅된 페이지가 렌더링될 위치 */}
    </>
  );
};

// 라우터 설정: 경로별로 각 페이지 연결
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // 최상위 요소로 RootLayout 지정
    children: [
      {
        path: '/subway/search',
        element: <SubwaySearchPage />
      },
      {
        path: '/auth/login',
        element: <LoginPage />
      },
      {
        path: '/subway/live',
        element: <SubwayLivePage />
      },
      {
        path: '/mypage',
        element: <MyPage />
      },
      {
        path: '/subway/route',
        element: <SubwayRoutePage />
      },
    ],
  },
]);

// RouterProvider를 사용하여 앱에 라우터 적용
function App() {
  return (
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  );
}

export default App;