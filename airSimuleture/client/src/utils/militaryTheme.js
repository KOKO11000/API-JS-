export const MILITARY_COLORS = {
  primary: "#11150f",
  secondary: "#1a2018",
  accent: "#8f9a68",
  accentStrong: "#b6c68e",
  alert: "#b75d4a",
  success: "#7ca56f",
  text: {
    primary: "#eef1e4",
    muted: "#a8b09b",
  },
  border: "#3d4938",
};

export const STATUS_COLORS = {
  scheduled: "#7f8975",
  outbound: "#b75d4a",
  returning: "#d1b26f",
  landed: "#7ca56f",
};

export const MAP_ROUTE_COLORS = {
  outbound: "#b75d4a",
  returning: "#d1b26f",
  destination: "#8f9a68",
  searchRadius: "#8f9a68",
  polygon: "#67715c",
};

export const getStatusColor = (status) => {
  const colorMap = {
    Landed: "border-l-[var(--success)]",
    Returning: "border-l-[#d1b26f]",
    Outbound: "border-l-[var(--danger)]",
    Scheduled: "border-l-[var(--panel-border)]",
  };
  return colorMap[status] || "border-l-[var(--panel-border)]";
};

export const getStatusBgColor = (status) => {
  const colorMap = {
    Landed: "bg-[rgba(124,165,111,0.16)] text-[#cfe0c8]",
    Returning: "bg-[rgba(209,178,111,0.16)] text-[#ead8aa]",
    Outbound: "bg-[rgba(183,93,74,0.16)] text-[#e4b5aa]",
    Scheduled: "bg-[rgba(127,137,117,0.16)] text-[#c5cbbe]",
  };
  return colorMap[status] || "bg-[rgba(127,137,117,0.16)] text-[#c5cbbe]";
};
