import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';
import SubwaySearchPage from './pages/SubwaySearchPage';
import Login from './pages/Login'
import Header from './components/Header'

const RootLayout = () => {
  return (
    <>
      <Header /> {/* 고정된 Header */}
      <Outlet />  {/* 라우팅된 페이지가 렌더링될 위치 */}
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
        path: '/',
        element: <SubwaySearchPage />
      },
      {
        path: '/login',
        element: <Login />
      },
    ],
  },
]);

// RouterProvider를 사용하여 앱에 라우터 적용
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;