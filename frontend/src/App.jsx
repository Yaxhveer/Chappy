import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import ErrorMessage from "./components/layout/errorMessage";
import Profile from "./components/user/profile";
import Header from "./components/layout/header";
import PrivateRoute from "./utils/privateRoute"
import ChatLayout from "./components/layout/ChatLayout";

function App() {
  return (
    <AuthProvider>
      <Router> 
        <Header></Header>
        <ErrorMessage />
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route exact path="/"
            element={
              <PrivateRoute>
                <ChatLayout/>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;