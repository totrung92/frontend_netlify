import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import renderCustomNode from "./PersonNode";
import PopupAdd from "./PopupAdd";
import PopupEdit from "./PopupEdit";

export default function FamilyTree({ user_id }) {
  const [treeData, setTreeData] = useState(null);
  const API_URL = "http://localhost:5000"; // 🔴 Thay bằng URL Render backend của bạn
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Lấy dữ liệu từ backend
  useEffect(() => {
    fetch(`${API_URL}/api/family/${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        const root = buildTree(data);
        setTreeData(root);
      })
      .catch((err) => console.error(err));
  }, [user_id, showAddChild, showAddPartner]);

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
  const CheckBirth = (birthYear,birthMonth,birthDay) => {
    let birth = "";
    if (birthYear) {
      birth = birthYear;
      if (birthMonth) {
        birth += `-${birthMonth.padStart(2, "0")}`;
        if (birthDay) {
          birth += `-${birthDay.padStart(2, "0")}`;
        } else {
          birth += "-01";
        }
      } else {
        birth += "-01-01";
      }
    }
    return birth;
  }
  // Xử lý submit thêm con
  const handleAddChild = async (e, childForm) => {
    e.preventDefault();

    // Gộp ngày tháng năm thành chuỗi yyyy-mm-dd
    let birth = CheckBirth(childForm.birthYear,childForm.birthMonth,childForm.birthDay);
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
      setShowAddPartner(false);
      // Reload tree
      fetch(`${API_URL}/api/family/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          const root = buildTree(data);
          setTreeData(root);
        });
    }
  };


  const handleEditSubmit = async (e, editForm) => {
    e.preventDefault();

    // Gộp ngày tháng năm thành chuỗi yyyy-mm-dd giống như add
    let birth = CheckBirth(editForm.birthYear,editForm.birthMonth,editForm.birthDay);
    // Gửi dữ liệu lên backend
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
            <button style={{ marginRight: "8px" }} onClick={() => setShowAddPartner(true)}>
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
          <PopupAdd selectedNode={selectedNode} handleSubmit={handleAddChild} AddChild={true} setShowAdd={setShowAddChild}/>
      )}

      {/* Popup thêm vợ chồng */}
      {showAddPartner && (
          <PopupAdd selectedNode={selectedNode} handleSubmit={handleAddChild} AddChild={false} setShowAdd={setShowAddPartner}/>
      )}
      {/* Popup chỉnh sửa thông tin */}
      {showEdit && (
        <PopupEdit selectedNode={selectedNode} handleSubmit={handleEditSubmit} setShowEdit={setShowEdit}/>
      )}

      {/* Cột phải: Tree */}
      <div style={{ flex: 4, borderRight: "1px solid #ddd", overflow: "auto", height: "100vh" }}>
        <Tree
          data={treeData}
          orientation="vertical"
          translate={{ x: 400, y: 100 }}
          pathFunc="step"
          collapsible={false}
          renderCustomNodeElement={renderCustomNode(setSelectedNode)}
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
