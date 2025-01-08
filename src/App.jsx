import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./layout/Dashboard.jsx";
import User from "./pages/User/User.jsx";
import Article from "./pages/Article/Article.jsx";
import Home from "./pages/Home.jsx";
import AddArticle from "./pages/Article/AddArticle.jsx";
import EditArticle from "./pages/Article/EditArticle.jsx";
import { useEffect } from "react";

function RequireAuth({ children }) {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/login" />;
  }
  return children;
}
// const saveToken = (token, expiresIn) => {
//   const expirationTime = new Date().getTime() + expiresIn * 5000;
//   localStorage.setItem('authToken', token);
//   localStorage.setItem('tokenExpiration', expirationTime);
// };

const checkTokenExpiration = () => {
  const expirationTime = localStorage.getItem('tokenExpiration');
  if (expirationTime && new Date().getTime() > expirationTime) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiration');
      window.location.href = "/login"; 
  }
};


function App() {
  useEffect(() => {
    // Mulai pemeriksaan token kedaluwarsa
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 300000);

    // Hapus interval ketika komponen di-unmount
    return () => clearInterval(interval);
}, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        >
          <Route index element={<Home />} />
          <Route path="/article" element={<Article />} />
          <Route path="/article/add" element={<AddArticle />} />
          <Route path="/article/edit/:id" element={<EditArticle />} />
          <Route path="/user" element={<User />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
