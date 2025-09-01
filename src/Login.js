import React, { useState } from "react";

function Login({ onClose, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    // Gọi hàm onLogin nếu truyền vào, hoặc xử lý đăng nhập tại đây
    if (onLogin) {
      const result = await onLogin(username, password);
      if (result?.success) {
        setMessage("Đăng nhập thành công!");
        setTimeout(onClose, 1000);
      } else {
        setMessage(result?.message || "Đăng nhập thất bại!");
      }
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "32px 24px",
          borderRadius: "8px",
          minWidth: "320px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 12 }}>Đăng nhập</h3>
        <input
          type="text"
          placeholder="User Name"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "10px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Đăng nhập
        </button>
        {message && (
          <div style={{ color: message.includes("thành công") ? "green" : "red" }}>
            {message}
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          style={{
            background: "transparent",
            color: "#1976d2",
            border: "none",
            marginTop: "8px",
            cursor: "pointer"
          }}
        >
          Đóng
        </button>
      </form>
    </div>
  );
}

export default Login;