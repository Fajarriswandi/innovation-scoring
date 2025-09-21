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
  FieldTimeOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  AppstoreOutlined,
  BellOutlined,
  SunOutlined,
  MoonOutlined

} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  MenuProps,
  Grid,
  Tooltip,
  Switch,
  ConfigProvider,
} from "antd";

import { useAppSelector } from "@/hooks/redux";

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const handleFsChange = () => {
    const fs = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
    setIsFullscreen(fs);
  };

  const toggleFullscreen = async () => {
    try {
      const doc: any = document;
      const el: any = document.documentElement;

      if (!isFullscreen) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen) await el.mozRequestFullScreen();
        else if (el.msRequestFullscreen) await el.msRequestFullscreen();
      } else {
        if (doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
        else if (doc.mozCancelFullScreen) await doc.mozCancelFullScreen();
        else if (doc.msExitFullscreen) await doc.msExitFullscreen();
      }
    } catch (e) {
      console.error("Fullscreen toggle failed:", e);
    }
  };

  React.useEffect(() => {
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange as any);
    document.addEventListener("mozfullscreenchange", handleFsChange as any);
    document.addEventListener("MSFullscreenChange", handleFsChange as any);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFsChange as any
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFsChange as any
      );
      document.removeEventListener("MSFullscreenChange", handleFsChange as any);
    };
  }, []);

  React.useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const { smallTitle } = useAppSelector((state) => state.layout);
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
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
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
            {/* <h6>Navigation</h6> */}
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
              {/* <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 16, width: 64, height: 64 }}
              /> */}
            </div>
            <div className="headerRight">
              <div>
                {/* <Switch
                  checkedChildren="Light"
                  unCheckedChildren="Dark"
                  defaultChecked
                /> */}

                <Switch
                  checkedChildren={<SunOutlined />}
                  unCheckedChildren={<MoonOutlined />}
                  size="default"
                  checked={!isDark}
                  onChange={(checked) => setIsDark(!checked)}
                />
              </div>
              <div>
                <Tooltip title="Notification">
                  <Button shape="circle" size={"large"} icon={<BellOutlined />} />
                </Tooltip>
              </div>
              <div>
                <Tooltip
                  title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
                >
                  <Button
                    shape="circle"
                    size="large"
                    onClick={toggleFullscreen}
                    aria-label={
                      isFullscreen ? "Exit full screen" : "Enter full screen"
                    }
                    icon={
                      isFullscreen ? (
                        <FullscreenExitOutlined />
                      ) : (
                        <FullscreenOutlined />
                      )
                    }
                  />
                </Tooltip>
              </div>
              <div>
                <Tooltip title="Other Modul">
                  <Button
                    shape="circle"
                    size={"large"}
                    icon={<AppstoreOutlined />}
                  />
                </Tooltip>
              </div>
            </div>
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
            {/* Title Small Page */}
            <div className="smallTitlePage">
              <AppstoreAddOutlined /> <span>{smallTitle}</span>
            </div>
            {/* End Title Small Page */}

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
    </ConfigProvider>
  );
};

export default AppLayout;
