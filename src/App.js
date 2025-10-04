import { useState } from "react";
import Header from "./Header";
import Login from "./Login";
import Register from "./Register";
import FamilyTree from "./FamilyTree/FamilyTree";
function App() {
  const API_URL = "https://webtest-jdej.onrender.com"; // 🔴 Thay bằng URL Render backend của bạn

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        console.warn("Login failed: HTTP error");
        return { success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" };
      }

      const result = await res.json();
      console.log("Response JSON:", result);

      if (result.success && result.id && result.username) {
        setUser({ id: result.id, username: result.username });
        return { success: true };
      }
      return {
        success: false,
        message: result.message || "Sai tên đăng nhập hoặc mật khẩu!",
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Có lỗi xảy ra khi đăng nhập." };
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        return { success: false, message: "Đăng ký thất bại!" };
      }
      const result = await res.json();
      if (result && result.success && result.id) {
        return { success: true, id: result.id };
      }
      return { success: false, message: result.message || "Đăng ký thất bại!" };
    } catch (error) {
      return { success: false, message: "Có lỗi xảy ra khi đăng ký." };
    }
  };

  const handleLogout = () => {
    setUser(null);
  };


  return (
    <div style={{ padding: "0px", fontFamily: "sans-serif" }}>
      <Header
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Hiển thị form đăng nhập nếu showLogin = true */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLogin={async (username, password) => {
            const result = await handleLogin(username, password);
            if (result.success) setShowLogin(false);
            return result;
          }}
        />
      )}

      {/* Hiển thị form đăng ký nếu showRegister = true */}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onRegister={handleRegister}
          onAutoLogin={async (username, password) => {
            const result = await handleLogin(username, password);
            if (result.success) setShowRegister(false);
            return result;
          }}
        />
      )}

      {/* Hiển thị thông tin thành viên sau khi đăng nhập */}

      {user && <FamilyTree user_id={user.id} />}
    </div>
  );
}

export default App;
