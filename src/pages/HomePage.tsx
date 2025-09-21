import { Card, Typography } from 'antd';
const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <Card>
      <Title level={3}>Home</Title>
      <Paragraph>Skeleton UI siap. Kita akan slicing dari desain pakai dummy data.</Paragraph>
    </Card>
  );
}