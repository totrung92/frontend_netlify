import React from "react";

function Header({ onLoginClick, onRegisterClick, user, onLogout }) {
  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 24px",
      background: "#19d282ff",
      color: "#fff"
    }}>
      <h2 style={{ margin: 0 }}>My Website</h2>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 16 }}>Xin chào, <b>{user.username}</b></span>
            <button
              onClick={onLogout}
              style={{
                background: "#fff",
                color: "#d32f2f",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onLoginClick}
              style={{
                background: "#fff",
                color: "#1976d2",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: "bold",
                marginRight: "8px"
              }}
            >
              Login
            </button>
            <button
              onClick={onRegisterClick}
              style={{
                background: "#fff",
                color: "#19d282",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;