import { ThemeConfig } from "antd";

const customTheme: ThemeConfig = {
  token: {
    colorPrimary: "#2d6a4f", // verde escuro
    colorSuccess: "#52b788", // verde médio
    colorWarning: "#d4a574", // bege suave
    colorError: "#d62828",
    colorInfo: "#40916c", // verde info
    colorTextBase: "#1b4332", // texto verde escuro
    colorBgBase: "#ffffff",
    fontSize: 14,
    borderRadius: 6,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  },
  components: {
    Button: {
      controlHeight: 36,
      borderRadius: 6,
      primaryColor: "#2d6a4f",
    },
    Table: {
      headerBg: "#f0f7f4", // verde muito claro
      headerColor: "#2d6a4f",
      rowHoverBg: "#f0f7f4",
    },
    Card: {
      borderRadiusLG: 8,
      boxShadow: "0 2px 8px rgba(45, 106, 79, 0.1)",
    },
    Layout: {
      headerBg: "#2d6a4f",
      headerHeight: 64,
      headerPadding: "0 24px",
      headerColor: "#ffffff",
      siderBg: "#f5f5f5",
    },
    Input: {
      controlHeight: 36,
      borderRadius: 6,
    },
    Select: {
      controlHeight: 36,
      borderRadius: 6,
    },
  },
};

export default customTheme;
