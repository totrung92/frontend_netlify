import { useState } from "react";
import Header from "./Header";
import Login from "./Login";
import Register from "./Register";

function App() {
  const API_URL = "https://webtest-jdej.onrender.com"; // 🔴 Thay bằng URL Render backend của bạn

  // State để điều khiển hiển thị Login và Register form
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);

  // Hàm xử lý đăng nhập: trả về { success: boolean, message?: string }
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
        return { success: false, message: "Sai email hoặc mật khẩu!" };
      }

      const result = await res.json();
      console.log("Response JSON:", result);

      if (typeof result.success === "boolean") {
        if (result.success) setUser({ username });
        return result.success
          ? { success: true }
          : { success: false, message: "Sai email hoặc mật khẩu!" };
      }

      if (typeof result === "boolean") {
        if (result) setUser({ username });
        return result
          ? { success: true }
          : { success: false, message: "Sai email hoặc mật khẩu!" };
      }

      console.warn("Login fallback triggered");
      return { success: false, message: "Đăng nhập thất bại!" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Có lỗi xảy ra khi đăng nhập." };
    }
  };

  // Hàm xử lý đăng ký: trả về { success: boolean, message?: string }
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
      if (result && result.id) {
        return { success: true };
      }
      return { success: false, message: "Đăng ký thất bại!" };
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
    </div>
  );
}

export default App;
