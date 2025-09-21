import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  RadarChartOutlined,
  DashboardOutlined,
  SettingOutlined,
  BarChartOutlined,
  MessageOutlined,
  BellOutlined,
  FileTextOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, MenuProps, Grid } from "antd";

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const screens = Grid.useBreakpoint();

  const menuItems: MenuProps["items"] = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    {
      key: "realtime",
      icon: <RadarChartOutlined />,
      label: "Realtime Log Scanner",
    },
    { key: "calls", icon: <PhoneOutlined />, label: "Calls" },
    { key: "reports", icon: <BarChartOutlined />, label: "Reports" },
    { key: "messages", icon: <MessageOutlined />, label: "Messages" },
    {
      key: "customers",
      icon: <UserOutlined />,
      label: "Customers",
      children: [
        { key: "customers-list", label: "List" },
        { key: "customers-segments", label: "Segments" },
      ],
    },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={240}
        breakpoint="lg"
        collapsedWidth={screens.lg ? 80 : 0}
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        className="siderGlobal" // class custom
        onBreakpoint={(broken) => setCollapsed(broken)}
        theme="light" // ← ubah jadi light
      >
        <div style={{ padding: 16, textAlign: "center" }}>
          <img
            src="/src/assets/img/agent-profile.png"
            alt="Agent Profile"
            style={{ width: 30, borderRadius: "50%" }}
          />
        </div>
        <Menu
          theme="light" // ← menu ikut light
          mode="inline"
          defaultOpenKeys={["customers"]}
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
        />
      </Sider>

      <Layout style={{ marginLeft: screens.lg ? (collapsed ? 80 : 240) : 0 }}>
        <Header
          style={{
            padding: 10,
            background: colorBgContainer,
            position: "fixed",
            top: 0,
            left: screens.lg ? (collapsed ? 80 : 240) : 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 64, height: 64 }}
          />
        </Header>

        <Content
          style={{
            padding: screens.lg ? 24 : 16,
            minHeight: 280,
            marginTop: 64, // agar tidak tertutup Header
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
