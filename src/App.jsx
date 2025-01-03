import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./layout/Dashboard.jsx";
import User from "./pages/User/User.jsx";
import Profile from "./pages/Profile.jsx";
import Setting from "./pages/Setting.jsx";
import Article from "./pages/Article/Article.jsx";
import Home from "./pages/Home.jsx";
import AddArticle from "./pages/Article/AddArticle.jsx";
import EditArticle from "./pages/Article/EditArticle.jsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("authToken");
  // const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
  // if (!token || role !== "admin") {
  //     return <Navigate to="/login" />;
  // }
  // return children;
}

function App() {
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/user" element={<User />} />
          <Route path="/setting" element={<Setting />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

{
  /*<Route path="/" element={*/
}
{
  /*    // <RequireAuth>*/
}
{
  /*    //     <Dashboard />*/
}
{
  /*    // </RequireAuth>}>}*/
}
{
  /*    // <Route index element={<HomePage />} />*/
}

{
  /*    </Route>*/
}
