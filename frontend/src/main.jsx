import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/style/global.css";
import { createBrowserRouter as Router, RouterProvider } from "react-router-dom";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import UserPage from "./pages/User/UserPage.jsx";
import ProfilePage from "./pages/User/ProfilePage.jsx";
import AuthorPage from "./pages/Author/AuthorPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import { AuthWrapper } from "./components/Context/AuthContext.jsx";
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './components/Context/AuthContext.jsx';
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import ChangePassPage from "./pages/User/ChangePassPage.jsx";
import TYPE_EMPLOYEE from "./util/userType.js";
import BookPage from "./pages/Book/BookPage.jsx";
import BooksPage from "./pages/Book/BooksPage.jsx";
import ChatPage from "./pages/Chat/ChatPage.jsx";
import { SocketContextProvider } from "./components/Context/SocketContext.jsx";
const PrivateRoute = ({ element, requiredPermission = [] }) => {
  const { auth, appLoading } = useContext(AuthContext);
  const userType = auth?.user?.role;
  const hasPermission =
    requiredPermission.length === 0 || requiredPermission.includes(userType);

  return hasPermission || appLoading ? (
    element
  ) : (
    <Navigate
      to="/unauthorized"
      replace
      state={{ from: window.location.pathname }}
    />
  );
};



const router = Router([
  {
    path: "/",
    element: <App />,
    children: [
      { 
        index: true, 
        element: <HomePage /> 
      },
      { 
        path: "change-password", 
        element: (
          <PrivateRoute 
            element={<ChangePassPage />} 
            requiredPermission={[TYPE_EMPLOYEE.admin, TYPE_EMPLOYEE.user]} 
          />
        ) 
        
      },
      { 
        path: "chat", 
        element: (
          <PrivateRoute 
            element={<ChatPage />} 
            requiredPermission={[TYPE_EMPLOYEE.admin, TYPE_EMPLOYEE.user]} 
          />
        ) 
      },
      { 
        path: "profile", 
        element: (
          <PrivateRoute 
            element={<ProfilePage />} 
            requiredPermission={[TYPE_EMPLOYEE.admin, TYPE_EMPLOYEE.user]} 
          />
        ) 
      },
      { 
        path: "user", 
        element: (
          <PrivateRoute 
            element={<UserPage />} 
            requiredPermission={[TYPE_EMPLOYEE.admin]} 
          />
        ) 
      },
      { 
        path: "author", 
        element: (
          <PrivateRoute 
            element={<AuthorPage />} 
            requiredPermission={[TYPE_EMPLOYEE.admin]} 
          />
        ) 
      },
      { 
        path: "book", 
        element: (
          <PrivateRoute 
            element={<BookPage />} 
            requiredPermission={[TYPE_EMPLOYEE.admin]} 
          />
        ) 
      },
      { 
        path: "books", 
        element: (
          <PrivateRoute 
            element={<BooksPage />} 
            requiredPermission={[TYPE_EMPLOYEE.admin]} 
          />
        ) 
      },
    ]
  },
 
  { 
    path: "register", 
    element: <RegisterPage /> 
  },
  { 
    path: "unauthorized", 
    element: <UnauthorizedPage /> 
  },
  { 
    path: "login", 
    element: <LoginPage /> 
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthWrapper>
      <SocketContextProvider>
        <RouterProvider router={router} />
      </SocketContextProvider>
    </AuthWrapper>
  </React.StrictMode>
);
