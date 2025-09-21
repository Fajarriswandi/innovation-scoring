import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  return (
    <>
      <Title level={3}>Selamat Datang, Agent!</Title>
      <Paragraph>Dashboard Agent</Paragraph>
    </>
  );
}