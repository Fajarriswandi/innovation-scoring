import { ResponsiveContainer, BarChart, Bar, LabelList } from "recharts";

export default function SentimentChart() {
    return (
        <div style={{ width: "100%", height: 180, paddingTop: 20 }}>
            <ResponsiveContainer>
                <BarChart
                    data={[
                        { key: "Positive", value: 20, fill: "url(#positiveGrad)" },
                        { key: "Negative", value: 70, fill: "url(#negativeGrad)" },
                        { key: "Neutral", value: 5, fill: "url(#neutralGrad)" },
                    ]}
                    barSize={56}
                >
                    <defs>
                        <linearGradient id="positiveGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#69b1ff" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#69b1ff" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="negativeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#cfcfcf" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#cfcfcf" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="neutralGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d9d9d9" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#d9d9d9" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                        <LabelList
                            dataKey="value"
                            position="top"
                            formatter={(v: number) => `${v}%`}
                            style={{ fill: "#333", fontWeight: 600 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 24,
                    marginTop: 10,
                    marginBottom: 8,
                    color: "#8c8c8c",
                    fontWeight: 500,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#69b1ff",
                            display: "inline-block",
                        }}
                    />
                    Positive
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#c9c9c9",
                            display: "inline-block",
                        }}
                    />
                    Negative
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#d9d9d9",
                            display: "inline-block",
                        }}
                    />
                    Neutral
                </div>
            </div>
        </div>
    );
}