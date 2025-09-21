import { useEffect } from 'react';
import { Typography } from 'antd';
import { useAppDispatch } from '@/hooks/redux';
import { setSmallTitle } from '@/store/layoutSlice';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSmallTitle('Dashboard Agent 123'));

    // Reset title on component unmount
    return () => {
      dispatch(setSmallTitle('Dashboard'));
    };
  }, [dispatch]);

  return (
    <>
      <Title level={3}>Selamat Datang, Agent!</Title>
      <Paragraph>Dashboard Agent</Paragraph>
    </>
  );
}