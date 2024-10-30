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

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // RootLayout이 최상위 요소
    children: [
      {
        path: '/',
        element: <SubwaySearchPage />
      },
      {
        path: '/login',
        element: <Login /> // '/login' 경로
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;