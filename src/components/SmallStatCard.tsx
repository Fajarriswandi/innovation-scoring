import { Card, Flex } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { LineChart, Line, ResponsiveContainer } from "recharts";

type Props = {
  title: string;                 // judul card (wajib)
  value: number | string;        // angka besar (contoh: 526)
  deltaLabel?: string;           // label badge kecil (contoh: "+ 4%")
  subtitle?: string;             // teks kecil di bawah value
  data?: { value: number }[];    // data mini-chart
  className?: string;            // opsional tambahan kelas
};

export default function SmallStatCard({
  title,
  value,
  deltaLabel = "+ 0%",
  subtitle,
  data = [
    { value: 100 },
    { value: 120 },
    { value: 115 },
    { value: 140 },
    { value: 160 },
    { value: 180 },
  ],
  className,
}: Props) {
  return (
    <Card
      className={`noborderHeader smallCard ${className ?? ""}`}
      extra={<a href="#"><ReloadOutlined /></a>}
      title={title}
    >
      <span className="badge success">{deltaLabel}</span>
      <Flex justify="space-between" align="end">
        <div style={{ flex: 2 }}>
          <div className="boxInfo">
            <h3>{value}</h3>
            {subtitle && <small>{subtitle}</small>}
          </div>
        </div>
        <div style={{ flex: 2, height: 30 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <Line type="monotone" dataKey="value" stroke="#999" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Flex>
    </Card>
  );
}