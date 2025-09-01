import { useState } from "react";

function Register({ onRegister, onClose, onAutoLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", rePassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!form.username || !form.email || !form.password || !form.rePassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      setLoading(false);
      return;
    }
    if (form.password !== form.rePassword) {
      setError("Mật khẩu nhập lại không khớp.");
      setLoading(false);
      return;
    }
    try {
      if (onRegister) {
        const result = await onRegister(form.username, form.email, form.password);
        if (!result.success) {
          setError(result.message || "Đăng ký thất bại.");
        } else {
          // Auto login after successful register
          if (onAutoLogin) {
            await onAutoLogin(form.username, form.password);
          }
          onClose();
        }
      }
    } catch (err) {
      setError("Có lỗi xảy ra.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff", padding: 24, borderRadius: 8, minWidth: 320, boxShadow: "0 2px 8px #0002"
        }}
      >
        <h2>Đăng ký</h2>
        <div>
          <label>Tên đăng nhập</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 8 }}
            autoFocus
          />
        </div>
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 8 }}
          />
        </div>
        <div>
          <label>Mật khẩu</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 8 }}
          />
        </div>
        <div>
          <label>Nhập lại mật khẩu</label>
          <input
            name="rePassword"
            type="password"
            value={form.rePassword}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 8 }}
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: "100%", marginBottom: 8 }}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
        <button type="button" onClick={onClose} style={{ width: "100%" }}>
          Đóng
        </button>
      </form>
    </div>
  );
}

export default Register;