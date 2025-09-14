import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";

const containerStyles = {
  width: "100%",
  height: "100vh",
};
export default function FamilyTree({user_id}) {
    const [treeData, setTreeData] = useState(null);
    const API_URL = "http://192.168.100.147:5000";
    const [selectedNode, setSelectedNode] = useState(null);
    // 🔹 Lấy dữ liệu từ backend
        fetch(`${API_URL}/api/family/${user_id}`) // backend trả về danh sách family_members
        .then((res) => res.json())
        .then((data) => {
            // ✅ Convert DB data (flat list) -> tree format
            const root = buildTree(data);
            setTreeData(root);
        })
        .catch((err) => console.error(err));
    // Hàm chuyển danh sách thành cấu trúc cây
    function buildTree(data) {
        // map id -> node
        const map = {};
        data.forEach((item) => {
        map[item.id] = {
            name: item.name,
            attributes: {
            avatar: item.avatar,
            birth: item.birth,
            gender: item.gender,
            description: item.description,
            },
            children: [],
        };
        });

        let root = null;
        data.forEach((item) => {
        if (item.parent_id) {
            map[item.parent_id].children.push(map[item.id]);
        } else {
            root = map[item.id]; // không có parent => root
        }
        });
        return root;
    }

    const renderCustomNode = ({ nodeDatum }) => (
    <g
        onClick={() => {
        console.log("Clicked:", nodeDatum);
        setSelectedNode(nodeDatum);
        }}
        style={{ cursor: "pointer" }}
    >
        {/* Avatar */}
        <image
            href={nodeDatum.attributes?.avatar || "https://via.placeholder.com/60"}
            x="-30"
            y="-30"
            width="60"
            height="60"
        />

        {/* Tên */}
        <text
        fill="black"
        strokeWidth="1"
        x="0"
        y="45"
        textAnchor="middle"
        fontSize="14"
        >
        {nodeDatum.name}
        </text>

    </g>
    );



    if (!treeData) return <p>Loading...</p>;

    return (
        <div style={{ display: "flex", height: "100vh", width: "100vw" }}>

            {/* Cột trái: Info panel */}
            <div style={{ flex: 1, padding: "16px", background: "#7049d4ff" }}>
                {selectedNode ? (
                <div>
                    <h2>Thông tin chi tiết</h2>
                    <img
                        src={selectedNode.attributes?.avatar || "https://via.placeholder.com/60"}
                        alt="avatar"
                        width={100}
                        style={{ borderRadius: "50%", margin: "10px 0" }}
                    />
                    <p><strong>Tên:</strong> {selectedNode.name}</p>
                    {selectedNode.attributes?.description && (
                    <p><strong>Chi tiết:</strong> {selectedNode.attributes.description}</p>
                    )}
                    <button style={{ marginRight: "8px" }}>➕ Thêm con</button>
                    <button>✏️ Chỉnh sửa</button>
                </div>
                ) : (
                <p>👉 Click vào một người để xem chi tiết</p>
                )}
            </div>

            {/* Cột phải: Tree */}
            <div style={{ flex: 4, borderRight: "1px solid #ddd" }}>
            <Tree
                data={treeData}
                orientation="vertical"
                translate={{ x: 400, y: 100 }}
                pathFunc="step"
                collapsible={false}
                renderCustomNodeElement={renderCustomNode}
                scaleExtent ={{ min: 0.5, max: 2 }}
            />
            </div>
        </div>
    );
}
