import { Button, Form, Input, Typography, Card } from "antd";

const { Title } = Typography;

type LoginValues = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const onFinish = (values: LoginValues) => {
    console.log("Login submit:", values);
  };

  return (
    <Card>
      <Title level={3} style={{ textAlign: "center" }}>Login</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Username" name="username" rules={[{ required: true }]}>
          <Input placeholder="Enter username" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
