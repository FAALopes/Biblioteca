import React from "react";
import { Layout as AntLayout, Menu, Button } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  FileImageOutlined,
  ImportOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/"),
    },
    {
      key: "/books",
      icon: <BookOutlined />,
      label: "Livros",
      onClick: () => navigate("/books"),
    },
    {
      key: "/shelves",
      icon: <AppstoreOutlined />,
      label: "Prateleiras",
      onClick: () => navigate("/shelves"),
    },
    {
      key: "/photos",
      icon: <FileImageOutlined />,
      label: "Fotos & OCR",
      onClick: () => navigate("/photos"),
    },
    {
      key: "/import",
      icon: <ImportOutlined />,
      label: "Importar Excel",
      onClick: () => navigate("/import"),
    },
  ];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        style={{
          background: "#f5f5f5",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <BookOutlined style={{ fontSize: "28px", color: "#2d6a4f" }} />
          {!collapsed && (
            <h2 style={{ marginTop: "8px", color: "#2d6a4f", fontSize: "14px" }}>
              Biblioteca
            </h2>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderRight: "none" }}
        />
      </Sider>

      <AntLayout>
        <Header
          style={{
            background: "#2d6a4f",
            color: "#ffffff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ color: "#ffffff", margin: 0, fontSize: "20px" }}>
            📚 Inventário de Biblioteca
          </h1>
          <Button
            type="primary"
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: "rgba(255,255,255,0.2)", border: "none" }}
          >
            {collapsed ? "☰" : "✕"}
          </Button>
        </Header>

        <Content
          style={{
            margin: "16px",
            padding: "16px",
            background: "#ffffff",
            borderRadius: "4px",
            minHeight: "calc(100vh - 100px)",
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
