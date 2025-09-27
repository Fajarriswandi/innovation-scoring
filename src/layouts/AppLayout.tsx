import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreAddOutlined,
  FieldTimeOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { Icon } from "@iconify/react";
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
import { useLocation, useNavigate } from "react-router-dom";

import { useAppSelector } from "@/hooks/redux";

const { Header, Sider, Content } = Layout;

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
};

const fullscreenEvents = [
  "fullscreenchange",
  "webkitfullscreenchange",
  "mozfullscreenchange",
  "MSFullscreenChange",
] as const;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  const handleFsChange = () => {
    const doc = document as FullscreenDocument;
    const fs = Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
    setIsFullscreen(fs);
  };

  const toggleFullscreen = async () => {
    try {
      const doc = document as FullscreenDocument;
      const el = document.documentElement as FullscreenElement;

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
    fullscreenEvents.forEach((eventName) => {
      document.addEventListener(
        eventName as unknown as keyof DocumentEventMap,
        handleFsChange as EventListener
      );
    });
    return () => {
      fullscreenEvents.forEach((eventName) => {
        document.removeEventListener(
          eventName as unknown as keyof DocumentEventMap,
          handleFsChange as EventListener
        );
      });
    };
  }, []);

  React.useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
  }, [isDark]);

  const { smallTitle } = useAppSelector((state) => state.layout);
  const [collapsed, setCollapsed] = useState(false);
  const screens = Grid.useBreakpoint();

  const location = useLocation();
  const navigate = useNavigate();

  const routeKey = (() => {
    if (location.pathname.startsWith("/dashboard")) return "dashboard";
    if (location.pathname.startsWith("/anomaly")) return "realtime"; // Realtime Log Scanner = anomaly
    if (location.pathname.startsWith("/live-call")) return "calls";
    return "dashboard";
  })();

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    const map: Record<string, string> = {
      dashboard: "/dashboard",
      realtime: "/anomaly",
      calls: "/live-call",
      reports: "/notavailable",
      messages: "/notavailable",
      customers: "/notavailable",
      "customers-list": "/notavailable",
      "customers-segments": "/notavailable",
      settings: "/notavailable",
    };
    const to = map[key as string];
    if (to) navigate(to);
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "dashboard",
      icon: <Icon icon="solar:home-2-bold-duotone" width={20} height={20} />,
      label: "Dashboard",
    },
    {
      key: "realtime",
      icon: <Icon icon="streamline-flex:ai-scanner-robot-remix" width={20} height={20} />,
      label: "Realtime Log Scanner",
    },
    {
      key: "calls",
      icon: <Icon icon="solar:call-chat-rounded-bold-duotone" width={20} height={20} />,
      label: "Calls",
    },
    {
      key: "reports",
      icon: <Icon icon="solar:chart-2-bold-duotone" width={20} height={20} />,
      label: "Reports",
    },
    {
      key: "messages",
      icon: <Icon icon="duo-icons:message-2" width={20} height={20} />,
      label: "Messages",
    },
    {
      key: "customers",
      icon: <Icon icon="solar:users-group-rounded-bold-duotone" width={20} height={20} />,
      label: "Customers",
      children: [
        {
          key: "customers-list",
          label: "List",
          icon: <Icon icon="solar:list-bold-duotone" width={18} height={18} />,
        },
        {
          key: "customers-segments",
          label: "Segments",
          icon: <Icon icon="solar:bookmark-square-bold-duotone" width={18} height={18} />,
        },
      ],
    },
    {
      key: "settings",
      icon: <Icon icon="lets-icons:setting-line-duotone" width={20} height={20} />,
      label: "Settings",
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#40ACE2",
          colorSuccess: "#52c41a",
          colorWarning: "#faad14",
          colorError: "#ff4d4f",
          colorInfo: "#13c2c2",
          borderRadius: 8,
          colorTextBase: "#7D8497",
          colorText: "#7D8497",
          colorTextSecondary: "#64869e",
          colorTextHeading: "#3E5B70",
        },
      }}
    >
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
            items={menuItems}
            style={{ padding: 15 }}
            selectedKeys={[routeKey]}
            onClick={onMenuClick}
          />
        </Sider>

        <Layout style={{ marginLeft: screens.lg ? (collapsed ? 95 : 255) : 0 }} >
          <Header
            className="headerGlobal"
            style={{
              position: "fixed",
              top: 0,
              left: screens.lg ? (collapsed ? 95 : 255) : 0,
              right: 0,
              zIndex: 999,
              padding: 0,
              transition:"all 0.3s ease"
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
                  <Button
                    shape="circle"
                    color="primary"
                    variant="outlined"
                    size={"large"}
                    icon={<Icon icon="solar:bell-bing-bold-duotone" width={20} height={20} />}
                  />
                </Tooltip>
              </div>
              <div>
                <Tooltip
                  title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
                >
                  <Button
                    shape="circle"
                    size="large"
                    color="primary"
                    variant="outlined"
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
                    color="primary"
                    variant="outlined"
                    icon={<Icon icon="solar:widget-6-bold-duotone" width={20} height={20} />}
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
              zIndex: 888,
              transition:"all 0.3s ease"
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
              marginTop: 145, // agar tidak tertutup Header
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
