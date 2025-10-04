const renderCustomNode = (setSelectedNode) => ({ nodeDatum }) => (
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
        strokeWidth="0.5"
        x="0"
        y="55"
        textAnchor="middle"
        fontSize="18"
        fontFamily="Times New Roman"
        fontWeight="normal"
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
        strokeWidth="0.5"
        x="0"
        y="55"
        textAnchor="middle"
        fontSize="18"
        fontFamily="Times New Roman"
        fontWeight="normal"
        >
        {nodeDatum.partner.name}
        </text>
    </g>
    )}
</g>
);

export default renderCustomNode;