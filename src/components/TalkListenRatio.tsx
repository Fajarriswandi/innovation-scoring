import { ResponsiveContainer, BarChart, Bar } from "recharts";

type Props = {
    headline?: number;      // 25
    deltaLabel?: string;    // "+12%"
    barValue?: number;      // 25 (tinggi bar)
    leftPercent?: number;   // 75
    rightPercent?: number;  // 25
    talkLabel?: string;     // "Talk: 10%"
    listenLabel?: string;   // "Listen: -5%"
};

export default function TalkListenRatio({
    headline = 25,
    deltaLabel = "+12%",
    barValue = 25,
    leftPercent = 75,
    rightPercent = 25,
    talkLabel = "Talk: 10%",
    listenLabel = "Listen: -5%",
}: Props) {
    return (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
            {/* headline */}
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
                {headline}%
            </div>
            <div style={{ color: "#8c8c8c", marginTop: 4, fontWeight: 500 }}>
                Total : {deltaLabel}
            </div>

            {/* center single bar */}
            <div
                style={{
                    width: "100%",
                    height: 120,
                    marginTop: 0,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div style={{ width: 120, height: 120 }}>
                    <ResponsiveContainer>
                        <BarChart data={[{ key: "ratio", value: barValue, fill: "url(#tlGrad)" }]} barSize={56}>
                            <defs>
                                <linearGradient id="tlGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#69b1ff" stopOpacity="0.9" />
                                    <stop offset="100%" stopColor="#69b1ff" stopOpacity="0.2" />
                                </linearGradient>
                            </defs>
                            <Bar dataKey="value" radius={[16, 16, 16, 16]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* bottom scale */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{leftPercent}%</div>
                <div style={{ position: "relative", height: 8, flex: 1, background: "#ececec", borderRadius: 999 }}>
                    <span
                        style={{
                            position: "absolute",
                            left: "10%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: "#d9d9d9",
                        }}
                    />
                    <span
                        style={{
                            position: "absolute",
                            right: "10%",
                            top: "50%",
                            transform: "translate(50%, -50%)",
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: "#d9d9d9",
                        }}
                    />
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{rightPercent}%</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: "#595959" }}>
                <div>{talkLabel}</div>
                <div>{listenLabel}</div>
            </div>
        </div>
    );
}