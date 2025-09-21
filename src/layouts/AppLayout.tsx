import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  RadarChartOutlined,
  DashboardOutlined,
  SettingOutlined,
  BarChartOutlined,
  MessageOutlined,
  PhoneOutlined,
  AppstoreAddOutlined,
  FieldTimeOutlined
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
          //   height: "100vh",
          left: 15,
          top: 15,
        }}
        className="siderGlobal"
        onBreakpoint={(broken) => setCollapsed(broken)}
        theme="light"
      >
        <div className={`topSider ${collapsed ? "topSider--collapsed" : ""}`}>
          {/* <img
            src="/src/assets/img/agent-profile.png"
            alt="Agent Profile"
            style={{ width: 30, borderRadius: "50%" }}
          /> */}
          <h6>Navigation</h6>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 60, height: 60 }}
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultOpenKeys={["customers"]}
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          style={{ padding: 15 }}
        />
      </Sider>

      <Layout style={{ marginLeft: screens.lg ? (collapsed ? 95 : 255) : 0 }}>
        <Header
          className="headerGlobal"
          style={{
            position: "fixed",
            top: 0,
            left: screens.lg ? (collapsed ? 95 : 255) : 0,
            right: 0,
            zIndex: 1,
            padding: 0,
          }}
        >
          <div className="headerLeft">
            <img
              src="/src/assets/img/logo-dd.png"
              alt="Agent Profile"
              style={{ width: "auto", height: 25 }}
            />
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 64, height: 64 }}
            />
          </div>
          <div className="headerRight">Right</div>
        </Header>

        <div
          className="subHeader"
          style={{
            marginLeft: screens.lg ? (collapsed ? 30 : 30) : 0,
            position: "fixed",
            top: -10,
            left: screens.lg ? (collapsed ? 80 : 240) : 0,
            right: 0,
            zIndex: 0,
            // padding: 0,
          }}
        >
          <div className="smallTitlePage">
            <AppstoreAddOutlined /> <span>Dashboard Agent</span>
          </div>
          <div className="smallTitlePage">
            <FieldTimeOutlined />{" "}
            <span>Lates updated on 15:43PM, 10 Mar 24 </span>
          </div>
        </div>

        <Content
          style={{
            // padding: screens.lg ? 24 : 16,
            minHeight: 280,
            marginTop: 135, // agar tidak tertutup Header
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
