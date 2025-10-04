import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";

export default function FamilyTree({ user_id }) {
  const [treeData, setTreeData] = useState(null);
  const API_URL = "https://webtest-jdej.onrender.com"; // 🔴 Thay bằng URL Render backend của bạn
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [childForm, setChildForm] = useState({
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
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    gender: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    description: "",
    avatar: "",
  });

  // Lấy dữ liệu từ backend
  useEffect(() => {
    fetch(`${API_URL}/api/family/${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        const root = buildTree(data);
        setTreeData(root);
      })
      .catch((err) => console.error(err));
  }, [user_id, showAddChild]);

  // Hàm chuyển danh sách thành cấu trúc cây
  function buildTree(data) {
    const map = {};
    data.forEach((item) => {
      map[item.id] = {
        name: item.name,
        id: item.id,
        attributes: {
          avatar: item.avatar,
          birth: item.birth,
          gender: item.gender,
          description: item.description,
          partner_id: item.partner_id,
        },
        children: [],
        partner: null, // Thêm trường partner
      };
    });

    let root = null;
    data.forEach((item) => {
      if (!item.rootnode) {
        if (item.parent_id) {
          map[item.parent_id].children.push(map[item.id]);
        }
      } else {
        root = map[item.id];
      }
      // Gán partner nếu có
      if (item.partner_id && map[item.partner_id]) {
        map[item.id].partner = map[item.partner_id];
      }
    });
    return root;
  }

  const renderCustomNode = ({ nodeDatum }) => (
    <g>
      {/* Khung cho node chính */}
      <g
        style={{ cursor: "pointer" }}
        onClick={e => {
          e.stopPropagation();
          setSelectedNode(nodeDatum);
        }}
      >
        <rect x="-35" y="-35" width="70" height="70" rx="5" fill="#fff" stroke="#19d282" strokeWidth={2} />
        <image
          href={nodeDatum.attributes?.avatar || (nodeDatum.attributes.gender === "Nam"
            ? "/male.png"
            : "female.png")}
          x="-30"
          y="-30"
          width="60"
          height="60"
        />
        <rect x="-50" y="37" width="100" height="22" rx="5" fill="#fff"stroke="#fff"/>
        <text
          fill="#13035bff"
          stroke="#13035bff"
          stroke-width="0.5"
          x="0"
          y="55"
          textAnchor="middle"
          fontSize="18"
          font-family="Times New Roman"
          font-weight="normal"
        >
          {nodeDatum.name}
        </text>
      </g>
      {/* Khung cho partner nếu có */}
      {nodeDatum.partner && (
        <g
          style={{ cursor: "pointer" }}
          onClick={e => {
            e.stopPropagation();
            setSelectedNode(nodeDatum.partner);
          }}
          transform="translate(80,0)"
        >
          <rect x="-35" y="-35" width="70" height="85" rx="5" fill="#fff" stroke="#f39c12" strokeWidth={2} />
          <image
            href={nodeDatum.partner.attributes?.avatar || (nodeDatum.partner.attributes.gender === "Nam"
              ? "/male.png"
              : "female.png")}
            x="-30"
            y="-30"
            width="60"
            height="60"
          />
          <rect x="-50" y="37" width="100" height="20" rx="5" fill="#fff"stroke="#fff"/>
          <text
            fill="#13035bff"
            stroke="#13035bff"
            stroke-width="0.5"
            x="0"
            y="55"
            textAnchor="middle"
            fontSize="18"
            font-family="Times New Roman"
            font-weight="normal"
          >
            {nodeDatum.partner.name}
          </text>
        </g>
      )}
    </g>
  );

  // Xử lý submit thêm con
  const handleAddChild = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Gộp ngày tháng năm thành chuỗi yyyy-mm-dd
    let birth = "";
    if (childForm.birthYear) {
      birth = childForm.birthYear;
      if (childForm.birthMonth) {
        birth += `-${childForm.birthMonth.padStart(2, "0")}`;
        if (childForm.birthDay) {
          birth += `-${childForm.birthDay.padStart(2, "0")}`;
        } else {
          birth += "-01";
        }
      } else {
        birth += "-01-01";
      }
    }
    if (childForm.partner_id === "") {
      childForm.partner_id = null; // Đặt partner_id là null nếu không có giá trị
    }

    // Gửi dữ liệu lên backend
    const res = await fetch(`${API_URL}/api/family`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...childForm,
        birth,
        parent_id: selectedNode?.attributes?.id || selectedNode?.id,
        user_id: user_id,
        rootnode: false,
      }),
    });
    if (res.ok) {
      setShowAddChild(false);
      setChildForm({
        name: "",
        gender: "Nam",
        birthYear: "",
        birthMonth: "",
        birthDay: "",
        description: "",
        partner_id: "",
        avatar: "", // Reset trường avatar
      });
      // Reload tree
      fetch(`${API_URL}/api/family/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          const root = buildTree(data);
          setTreeData(root);
        });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (showEdit && selectedNode) {
      // Tách ngày tháng năm từ birth
      let birthYear = "", birthMonth = "", birthDay = "";
      if (selectedNode.attributes.birth) {
        // Lấy đúng yyyy-mm-dd từ chuỗi gốc
        console.log("Original birth:", selectedNode.attributes.birth);
        const [y, m, d] = selectedNode.attributes.birth.slice(0, 10).split("-");
        birthYear = y || "";
        birthMonth = m || "";
        birthDay = d || "";
      }
      setEditForm({
        name: selectedNode.name || "",
        gender: selectedNode.attributes.gender || "",
        birthYear,
        birthMonth,
        birthDay,
        description: selectedNode.attributes.description || "",
        avatar: selectedNode.attributes.avatar || "",
      });
    }
  }, [showEdit, selectedNode]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Gộp ngày tháng năm thành chuỗi yyyy-mm-dd giống như add
    let birth = "";
    if (editForm.birthYear) {
      birth = editForm.birthYear;
      if (editForm.birthMonth) {
        birth += `-${editForm.birthMonth.padStart(2, "0")}`;
        if (editForm.birthDay) {
          birth += `-${editForm.birthDay.padStart(2, "0")}`;
        } else {
          birth += "-01";
        }
      } else {
        birth += "-01-01";
      }
    }
    console.log("Submitting edit:", { ...editForm, birth, id: selectedNode.id });
    
    const res = await fetch(`${API_URL}/api/family/${selectedNode.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        birth,
        id: selectedNode.id,
      }),
    });
    if (res.ok) {
      setShowEdit(false);
      // Reload tree và cập nhật lại selectedNode như bạn đã làm
      fetch(`${API_URL}/api/family/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          const root = buildTree(data);
          setTreeData(root);
          const findNodeById = (node, id) => {
            if (!node) return null;
            if (node.id === id) return node;
            if (node.children) {
              for (const child of node.children) {
                const found = findNodeById(child, id);
                if (found) return found;
              }
            }
            if (node.partner && node.partner.id === id) return node.partner;
            return null;
          };
          const updatedNode = findNodeById(root, selectedNode.id);
          if (updatedNode) setSelectedNode(updatedNode);
        });
    }
    setLoading(false);
  };

  if (!treeData) return <p>Loading...</p>;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Cột trái: Info panel */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          background: "#dbd2f0ff",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        {selectedNode ? (
          <div>
            <h2>Thông tin chi tiết</h2>
            <img
              src={
                selectedNode.attributes?.avatar ||
                (selectedNode.attributes.gender === "Nam"
                  ? "/male.png"
                  : "female.png")
              }
              alt="avatar"
              width={100}
              height={100}
              style={{ borderRadius: "50%", margin: "10px 0", objectFit: "cover" }}
            />
            <p>
              <strong>Tên:</strong> {selectedNode.name}
            </p>
            <p>
              <strong>Giới tính:</strong> {selectedNode.attributes.gender}
            </p>
            <p>
              <strong>Năm Sinh:</strong>{" "}
              {selectedNode.attributes.birth
                ? selectedNode.attributes.birth.slice(0, 10).split("-").reverse().join("/")
                : ""}
            </p>
            {selectedNode.attributes?.description && (
              <p>
                <strong>Giới thiệu:</strong> {selectedNode.attributes.description}
              </p>
            )}
            <button style={{ marginRight: "8px" }} onClick={() => setShowAddChild(true)}>
              ➕ Thêm con
            </button>
            <button style={{ marginRight: "8px" }} onClick={() => setShowAddChild(true)}>
              ➕ Thêm {(selectedNode.attributes.gender === "Nam" ? "vợ" : "chồng")}
            </button>
            <button onClick={() => setShowEdit(true)}>✏️ Chỉnh sửa</button>
          </div>
        ) : (
          <p>👉 Click vào một người để xem chi tiết</p>
        )}
      </div>

      {/* Popup thêm con */}
      {showAddChild && (
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
            onSubmit={handleAddChild}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 320,
              boxShadow: "0 2px 8px #0002",
            }}
          >
            <h3>Thêm con cho: {selectedNode?.name}</h3>
            <div>
              <label>Tên</label>
              <input
                name="name"
                value={childForm.name}
                onChange={(e) => setChildForm({ ...childForm, name: e.target.value })}
                style={{ width: "100%", marginBottom: 8 }}
                required
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <label style={{ marginRight: 8, minWidth: 70 }}>Giới tính</label>
              <select
                name="gender"
                value={childForm.gender}
                onChange={(e) => setChildForm({ ...childForm, gender: e.target.value })}
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
                value={childForm.birthYear}
                onChange={(e) => setChildForm({ ...childForm, birthYear: e.target.value })}
                style={{ width: "60px", marginRight: 8, padding: "4px 8px" }}
                min="1900"
                max="2100"
                required
              />
              <label style={{ width: "50px", paddingRight: "8px" }}>Tháng</label>
              <input
                type="number"
                name="birthMonth"
                value={childForm.birthMonth}
                onChange={(e) => setChildForm({ ...childForm, birthMonth: e.target.value })}
                style={{ width: "40px", marginRight: 8, padding: "4px 8px" }}
                min="1"
                max="12"
              />
              <label style={{ width: "50px", paddingRight: "8px" }}>Ngày</label>
              <input
                type="number"
                name="birthDay"
                value={childForm.birthDay}
                onChange={(e) => setChildForm({ ...childForm, birthDay: e.target.value })}
                style={{ width: "40px", padding: "4px 8px" }}
                min="1"
                max="31"
              />
            </div>
            <div>
              <label>Mô tả</label>
              <textarea
                name="description"
                value={childForm.description}
                onChange={(e) => setChildForm({ ...childForm, description: e.target.value })}
                style={{ width: "100%", marginBottom: 8, minHeight: 60, resize: "vertical" }}
              />
            </div>
            <div>
              <label>Đường dẫn avatar</label>
              <input
                name="avatar"
                value={childForm.avatar}
                onChange={(e) => setChildForm({ ...childForm, avatar: e.target.value })}
                style={{ width: "100%", marginBottom: 8 }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", marginBottom: 8 }}>
              {loading ? "Đang gửi..." : "Thêm con"}
            </button>
            <button type="button" onClick={() => setShowAddChild(false)} style={{ width: "100%" }}>
              Đóng
            </button>
          </form>
        </div>
      )}

      {/* Popup chỉnh sửa thông tin */}
      {showEdit && (
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
            onSubmit={handleEditSubmit}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 320,
              boxShadow: "0 2px 8px #0002",
            }}
          >
            <h3>Chỉnh sửa thông tin: {selectedNode?.name}</h3>
            <div>
              <label>Tên</label>
              <input
                name="name"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                style={{ width: "100%", marginBottom: 8 }}
                required
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <label style={{ marginRight: 8, minWidth: 70 }}>Giới tính</label>
              <select
                name="gender"
                value={editForm.gender}
                onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                style={{ width: 80 }}
                required
              >
                <option value="">Chọn</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div style={{ marginBottom: 8, paddingTop: 8 }}>
              <label>Năm sinh</label>
              <input
                type="number"
                name="birthYear"
                value={editForm.birthYear}
                onChange={e => setEditForm({ ...editForm, birthYear: e.target.value })}
                style={{ width: "100px", marginRight: 8, padding: "4px 8px" }}
                min="1900"
                max="2100"
                required
              />
              <label>Tháng</label>
              <input
                type="number"
                name="birthMonth"
                value={editForm.birthMonth}
                onChange={e => setEditForm({ ...editForm, birthMonth: e.target.value })}
                style={{ width: "40px", marginRight: 8, padding: "4px 8px" }}
                min="1"
                max="12"
              />
              <label>Ngày</label>
              <input
                type="number"
                name="birthDay"
                value={editForm.birthDay}
                onChange={e => setEditForm({ ...editForm, birthDay: e.target.value })}
                style={{ width: "40px", padding: "4px 8px" }}
                min="1"
                max="31"
              />
            </div>
            <div>
              <label>Mô tả</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                style={{ width: "100%", marginBottom: 8, minHeight: 60, resize: "vertical" }}
              />
            </div>
            <div>
              <label>Đường dẫn avatar</label>
              <input
                name="avatar"
                value={editForm.avatar}
                onChange={e => setEditForm({ ...editForm, avatar: e.target.value })}
                style={{ width: "100%", marginBottom: 8 }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", marginBottom: 8 }}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button type="button" onClick={() => setShowEdit(false)} style={{ width: "100%" }}>
              Đóng
            </button>
          </form>
        </div>
      )}

      {/* Cột phải: Tree */}
      <div style={{ flex: 4, borderRight: "1px solid #ddd", overflow: "auto", height: "100vh" }}>
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 400, y: 100 }}
          pathFunc="step"
          collapsible={false}
          renderCustomNodeElement={renderCustomNode}
          scaleExtent={{ min: 0.5, max: 2 }}
          nodeSize={{ x: 200, y: 200 }}
          translateExtent={[
            [0, 0],      // top-left limit
            [800, 600],  // bottom-right limit
          ]}
        />
      </div>
    </div>
  );
}
