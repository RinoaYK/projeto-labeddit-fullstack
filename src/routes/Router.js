import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import PostsPage from "../pages/PostsPage";
import Header from '../components/header'
import CommentsPage from "../pages/CommentsPage";
import UserPage from "../pages/UserPage";

function Router() {
  return (
    <BrowserRouter>
    {/* <Header /> */}
      <Routes>
      <Route path={"/comments/:id"} element={<CommentsPage />} />
        <Route path={"/posts"} element={<PostsPage />} />
        <Route path={"/signup"} element={<SignUpPage />} />
        <Route path={"/user"} element={<UserPage />} />
        <Route path={"/"} element={<LoginPage />} />
        <Route path={"*"} element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;