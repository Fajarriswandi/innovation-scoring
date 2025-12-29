// src/features/auth/pages/LoginPage.tsx
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  message,
} from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

type LoginFormValues = {
  email: string;
  password: string;
  remember?: boolean;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const onFinish = (values: LoginFormValues) => {
    // Login logic here
  };

  useEffect(() => {
    const prev = document.title;
    document.title = "Login | AI Innovation Scoring Dashboard";
    return () => {
      document.title = prev || "AI Innovation Scoring Dashboard";
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Login | AI Innovation Scoring Dashboard</title>
      </Helmet>
      <Row className="full-height-row" gutter={0}>
        <Col xs={24} md={12} className="pane pane--left">
          <Card bordered={false} className="login-hero">
            <div className="login-hero__text">
              <Title level={1}>
                Serve <br /> With <br /> Excellence
              </Title>
              <Text>
                Every call is a chance to create trust. Log in and make every
                customer experience memorable.
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} className="pane pane--right">
          <Card className="loginWrapper">
            <div className="login-header">
              <img
                src="/src/assets/img/logo-dd.png"
                alt="Digital Dubai"
                className="login-logo"
              />
              <Title level={3}>Welcome Back</Title>
              <Text type="secondary">
                Enter your email and password to access your account
              </Text>
            </div>

            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ remember: true }}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your email!" }]}
              >
                <Input
                  size="large"
                  placeholder="name@digitaldubai.ae"
                  prefix={<MailOutlined />}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="••••••••"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Row
                justify="space-between"
                align="middle"
                className="login-metaRow"
              >
                <Col>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <a className="login-forgot" href="#">
                    Forget your password?
                  </a>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Sign In
                </Button>
              </Form.Item>

              <Form.Item>
                <Button icon={<GoogleOutlined />} size="large" block>
                  Login with Google
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
