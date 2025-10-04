import React, { useState } from "react";
const PopupAdd = ({ selectedNode, handleSubmit, AddChild, setShowAdd }) => 
{
    const [informationForm, setInformationForm] = useState({
    name: "",
    gender: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    description: "",
    partner_id: "",
    avatar: "",
    });
    const [loading, setLoading] = useState(false);
    const handleSubmitWrapper = async (e) => {
        setLoading(true);
        await handleSubmit(e, informationForm);
        setLoading(false);
        setShowAdd(false);
    }
    return (
        <div
            style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            }}
        >
            <form
            onSubmit={(e) => handleSubmitWrapper(e)}
            style={{
                background: "#fff",
                padding: 24,
                borderRadius: 8,
                minWidth: 320,
                boxShadow: "0 2px 8px #0002",
            }}
            >
            <h3>Thêm {AddChild ? "con" : (selectedNode.attributes.gender === "Nam" ? "vợ" : "chồng")} cho: {selectedNode?.name}</h3>
            <div>
                <label>Tên</label>
                <input
                name="name"
                value={informationForm.name}
                onChange={(e) => setInformationForm({ ...informationForm, name: e.target.value })}
                style={{ width: "100%", marginBottom: 8 }}
                required
                />
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <label style={{ marginRight: 8, minWidth: 70 }}>Giới tính</label>
                <select
                name="gender"
                value={informationForm.gender}
                onChange={(e) => setInformationForm({ ...informationForm, gender: e.target.value })}
                style={{ width: 80 }}
                required
                >
                <option value="">Chọn</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                </select>
            </div>
            <div style={{ marginBottom: 8, paddingTop: 8 }}>
                <label style={{ width: "50px", paddingRight: "8px" }}>Năm sinh</label>
                <input
                type="number"
                name="birthYear"
                value={informationForm.birthYear}
                onChange={(e) => setInformationForm({ ...informationForm, birthYear: e.target.value })}
                style={{ width: "60px", marginRight: 8, padding: "4px 8px" }}
                min="1900"
                max="2100"
                required
                />
                <label style={{ width: "50px", paddingRight: "8px" }}>Tháng</label>
                <input
                type="number"
                name="birthMonth"
                value={informationForm.birthMonth}
                onChange={(e) => setInformationForm({ ...informationForm, birthMonth: e.target.value })}
                style={{ width: "40px", marginRight: 8, padding: "4px 8px" }}
                min="1"
                max="12"
                />
                <label style={{ width: "50px", paddingRight: "8px" }}>Ngày</label>
                <input
                type="number"
                name="birthDay"
                value={informationForm.birthDay}
                onChange={(e) => setInformationForm({ ...informationForm, birthDay: e.target.value })}
                style={{ width: "40px", padding: "4px 8px" }}
                min="1"
                max="31"
                />
            </div>
            <div>
                <label>Mô tả</label>
                <textarea
                name="description"
                value={informationForm.description}
                onChange={(e) => setInformationForm({ ...informationForm, description: e.target.value })}
                style={{ width: "100%", marginBottom: 8, minHeight: 60, resize: "vertical" }}
                />
            </div>
            <div>
                <label>Đường dẫn avatar</label>
                <input
                name="avatar"
                value={informationForm.avatar}
                onChange={(e) => setInformationForm({ ...informationForm, avatar: e.target.value })}
                style={{ width: "100%", marginBottom: 8 }}
                />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", marginBottom: 8 }}>
                {loading ? "Đang gửi..." : (AddChild ? "Thêm con":(selectedNode.attributes.gender === "Nam" ? "Thêm vợ" : "Thêm chồng"))}
            </button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ width: "100%" }}>
                Đóng
            </button>
            </form>
        </div>
);
};
export default PopupAdd;