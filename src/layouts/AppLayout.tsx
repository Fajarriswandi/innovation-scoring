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
import { usePathname, useRouter } from "next/navigation";

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
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("theme");
      return saved === "dark";
    }
    return false;
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
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", isDark ? "dark" : "light");
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );
    }
  }, [isDark]);

  const { smallTitle } = useAppSelector((state) => state.layout);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("sidebarCollapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    }
  }, []);
  const screens = Grid.useBreakpoint();

  const pathname = usePathname();
  const router = useRouter();

  const routeKey = (() => {
    if (pathname?.startsWith("/dashboard")) return "dashboard";
    if (pathname?.startsWith("/blank")) return "blank";
    if (pathname?.startsWith("/innovations")) return "innovations";
    if (pathname?.startsWith("/inbox")) return "inbox";
    return "dashboard";
  })();

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    const map: Record<string, string> = {
      dashboard: "/dashboard",
      blank: "/blank",
      innovations: "/innovations",
      inbox: "/inbox",
    };
    const to = map[key as string];
    if (to) router.push(to);
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "dashboard",
      icon: <Icon icon="solar:home-2-bold-duotone" width={20} height={20} />,
      label: "Dashboard",
    },
    {
      key: "blank",
      icon: <Icon icon="solar:document-bold-duotone" width={20} height={20} />,
      label: "Blank Page",
    },
      {
        key: "innovations",
        icon: <Icon icon="solar:lightbulb-bold-duotone" width={20} height={20} />,
        label: "Innovations",
      },
      {
        key: "inbox",
        icon: <Icon icon="solar:inbox-bold-duotone" width={20} height={20} />,
        label: "Inbox",
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
          collapsed={mounted ? collapsed : true}
          style={{
            position: "fixed",
            //   height: "100vh",
            left: 15,
            top: 15,
          }}
          className="siderGlobal"
          onBreakpoint={(broken) => {
            if (broken) {
              setCollapsed(true);
              if (typeof window !== 'undefined') {
                localStorage.setItem("sidebarCollapsed", "true");
              }
            }
          }}
          theme="light"
        >
            <div className={`topSider ${mounted && collapsed ? "topSider--collapsed" : ""}`}>
            {/* <img
                src="/assets/img/agent-profile.png"
              alt="Agent Profile"
              style={{ width: 30, borderRadius: "50%" }}
            /> */}
            {/* <h6>Navigation</h6> */}
            <Button
              type="text"
              icon={mounted && collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                const newCollapsed = !collapsed;
                setCollapsed(newCollapsed);
                if (typeof window !== 'undefined') {
                  localStorage.setItem("sidebarCollapsed", String(newCollapsed));
                }
              }}
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
                src="/assets/img/logo-dd.png"
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
                {/* <Tooltip title="Other Modul">
                  <Button
                    shape="circle"
                    size={"large"}
                    color="primary"
                    variant="outlined"
                    icon={<Icon icon="solar:widget-6-bold-duotone" width={20} height={20} />}
                  />
                </Tooltip> */}
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
