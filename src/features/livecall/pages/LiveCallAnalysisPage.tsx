import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Row, Col, Card, List, Button } from "antd";
import { Icon } from "@iconify/react";

const gutter = [16, { xs: 12, sm: 16, md: 20, lg: 24 }] as const;

export default function LiveCallAnalysisPage() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setSmallTitle("Live Call Analysis"));
        return () => {
            dispatch(setSmallTitle("Dashboard"));
        };
    }, [dispatch]);

    return (
        <div>
            <Helmet>
                <title>Live Call Analysis | AI Powered Call Center</title>
            </Helmet>

            <Row gutter={gutter}>


                {/* First Column */}
                <Col xs={24} lg={10} xl={16}>
                    <Row gutter={{ xs: 8, sm: 16, md: 16, lg: 15 }}>

                        <Col xs={24} lg={24} xl={24}>
                            <Card className="noborderHeader CardInCall" style={{ marginBottom: 15, paddingTop: 15 }}>
                                <Row gutter={16} align="stretch">
                                    {/* Video / Avatar Panel */}
                                    <Col xs={24} md={10}>
                                        <div className="imageProfileInCall">
                                            <img
                                                src="/src/assets/img/agent-profile.png"
                                                alt="caller"
                                                className="imgProfile"
                                            />
                                            {/* Top-left status */}
                                            <div style={{ position: "absolute", top: 15, left: 15, display: "flex", alignItems: "center", gap: 8, background: "#ffffff20", padding: "4px 10px", borderRadius: 20 }}>
                                                <span style={{ width: 8, height: 8, borderRadius: 4, background: "#5DDB13", display: "inline-block" }} />
                                                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Now In Call</span>
                                            </div>
                                            {/* Top-right menu */}
                                            <div style={{ position: "absolute", top: 15, right: 15 }}>
                                                <Button className="btnGlass" size="large" icon={<Icon icon="pepicons-pencil:dots-y" width={18} height={18} />} />
                                            </div>
                                            {/* Bottom controls */}
                                            <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12 }}>
                                                <Button className="btnGlass" size="large" icon={<Icon icon="material-symbols:mic" width={18} height={18} />} />
                                                <Button className="btnGlass" size="large" icon={<Icon icon="mdi:volume-high" width={18} height={18} />} />
                                                <Button className="btnGlass" size="large" icon={<Icon icon="solar:videocamera-record-bold" width={18} height={18} />} />
                                                <Button className="btnGlass" size="large" danger style={{ background: "#ff4d5092", borderColor: "#ff383b63", color: "#fff" }} icon={<Icon icon="mdi:phone-hangup" width={18} height={18} />} />
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Info + Quick Actions */}
                                    <Col xs={24} md={14}>
                                        <div className="inCallInfo" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                            {/* In call info box */}
                                            <div style={{ gridColumn: "1 / -1", padding: 10 }}>
                                                <div style={{ fontWeight: 700, marginBottom: 8 }}>In call info</div>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 8, columnGap: 16 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <Icon icon="solar:clock-circle-bold-duotone" width={18} height={18} color="#8c8c8c" />
                                                        <div>
                                                            <div style={{ fontSize: 12, color: "#8c8c8c" }}>Time</div>
                                                            <div style={{ fontSize: 14, fontWeight: 600 }}>12:52 Minutes</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <Icon icon="solar:user-id-bold-duotone" width={18} height={18} color="#8c8c8c" />
                                                        <div>
                                                            <div style={{ fontSize: 12, color: "#8c8c8c" }}>Operator ID</div>
                                                            <div style={{ fontSize: 14, fontWeight: 600 }}>898a898iuy a87asdh&</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Actions grid (2 columns) */}
                                            {[
                                                { icon: "mage:email", label: "Send follow-up email" },
                                                { icon: "fluent:call-24-regular", label: "Transfer call / escalate to supervisor" },
                                                { icon: "mynaui:ticket", label: "Create new case / ticket" },
                                                { icon: "solar:calendar-broken", label: "Schedule callback / meetin" },
                                                { icon: "ion:attach-sharp", label: "Attach document" },
                                                { icon: "flowbite:search-outline", label: "Search Knowledge Base" },
                                            ].map((qa, idx) => (
                                                <div
                                                    key={idx}
                                                    className="btnQuickAction"
                                                >
                                                    <span className="iconWrap">
                                                        <Icon icon={qa.icon} width={18} height={18} />
                                                    </span>
                                                    <span style={{ fontSize: 14 }}>{qa.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24} lg={24} xl={12}>
                            <Card
                                className="cardWithFooter realtimeTranscript"
                                extra={<a href="#"><Icon icon="material-symbols:refresh-rounded" width={20} height={20} /></a>}
                                title={<span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon icon="material-symbols:transcribe-outline-rounded" width={20} height={20} color="#40ACE2" />Realtime Transcript</span>}
                                style={{ marginBottom: 15 }}
                            >
                                <div className="listSmallCard" style={{marginTop:15}}>
                                    {(() => {
                                        type Msg = { time: string; role: "User" | "Agent" | "System"; text: string };
                                        const msgs: Msg[] = [
                                            {
                                                time: "09:27",
                                                role: "User",
                                                text:
                                                    "I paid 150 AED yesterday for my vehicle registration renewal, but I still haven't received the service.",
                                            },
                                            {
                                                time: "09:27",
                                                role: "Agent",
                                                text: "I understand. Let me check the system and raise a case for you",
                                            },
                                            {
                                                time: "09:56",
                                                role: "System",
                                                text: "Case ID DD-2025-4321 created. Status: Pending Provider Action.",
                                            },
                                            {
                                                time: "09:27",
                                                role: "User",
                                                text:
                                                    "I paid 150 AED yesterday for my vehicle registration renewal, but I still haven't received the service.",
                                            },
                                            {
                                                time: "09:27",
                                                role: "Agent",
                                                text: "I understand. Let me check the system and raise a case for you",
                                            },
                                            {
                                                time: "09:56",
                                                role: "System",
                                                text: "Case ID DD-2025-4321 created. Status: Pending Provider Action.",
                                            },
                                        ];

                                        return (
                                            <div>
                                                {msgs.map((m, i) => (
                                                    <div key={i} className="transcriptItem" style={{ marginBottom: 10 }}>
                                                        <div className="time" style={{ fontSize: 12, marginBottom: 6 }}>
                                                            {m.time}
                                                            {m.role !== "User" && (
                                                                <span style={{ marginLeft: 8 }}>{m.role}</span>
                                                            )}
                                                        </div>
                                                        <div className="text">{m.text}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} lg={24} xl={12}>
                            <Card
                                className="cardWithFooter analysisCard"
                                extra={<a href="#"><Icon icon="material-symbols:refresh-rounded" width={20} height={20} /></a>}
                                title={<span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon icon="lineicons:gemini" width={20} height={20} color="#40ACE2" />Sentiment Analysis</span>}
                                style={{ marginBottom: 15 }}
                            >

                                <div className="listSmallCard" style={{marginTop:15}}>
                                    {(() => {
                                        type Insight = { title: string; lines: string[] };
                                        const insights: Insight[] = [
                                            {
                                                title: "Sentiment Analysis",
                                                lines: [
                                                    "Current Sentiment: Negative → Neutral (after agent intervention).",
                                                    "Customer frustration reduced once the agent confirmed a case was raised.",
                                                ],
                                            },
                                            {
                                                title: "Compliance Check",
                                                lines: [
                                                    "Agent acknowledged the issue and confirmed action taken (case created).",
                                                    "Standard escalation procedure followed.",
                                                ],
                                            },
                                            {
                                                title: "Risk / Escalation Alert",
                                                lines: [
                                                    "Keywords detected: ‘not received’, ‘still waiting’ → flagged as service delay.",
                                                    "Risk Level: Medium (may escalate if resolution delayed).",
                                                ],
                                            },
                                            {
                                                title: "Audit Log",
                                                lines: [
                                                    "Case ID DD-2025-4321 generated at 09:56 AM. Status: Pending Provider Action.",
                                                ],
                                            },
                                        ];

                                        return (
                                            <List
                                                itemLayout="vertical"
                                                split={false}
                                                dataSource={insights}
                                                renderItem={(ins, idx) => (
                                                    <List.Item key={idx} style={{ padding: 0, marginBottom: 12 }}>
                                                        <div className="analysisItem">
                                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                                                <span className="iconWrap">
                                                                    <Icon icon="solar:flag-2-bold-duotone" width={16} height={16} />
                                                                </span>
                                                                <span className="title">{ins.title}</span>
                                                            </div>
                                                            <div style={{lineHeight: 1.4 }}>
                                                                {ins.lines.map((ln, i) => (
                                                                    <div key={i}>{ln}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </List.Item>
                                                )}
                                            />
                                        );
                                    })()}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                {/* End First Column */}


                {/* Secondary Column */}
                <Col xs={24} lg={10} xl={8}>
                    <Row gutter={{ xs: 8, sm: 16, md: 16, lg: 15 }}>
                        <Col xs={24} lg={24} xl={24}>
                            <Card
                                className="cardWithFooter"

                                title={<span>Customer 360 View</span>}
                                style={{ marginBottom: 15 }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <img
                                        src="/src/assets/img/client.jpg"
                                        alt="profile"
                                        style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }}
                                    />
                                    <div>
                                        <div style={{ fontSize: 12, color: "#a0a7b3" }}>First Name</div>
                                        <div style={{ fontWeight: 700 }}>Rashid</div>

                                        <div style={{ fontSize: 12, color: "#a0a7b3", marginTop: 10 }}>Email</div>
                                        <div>Rashid@gmail.com</div>

                                        <div style={{ fontSize: 12, color: "#a0a7b3", marginTop: 10 }}>Phone</div>
                                        <div>+971 55 5010650</div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} lg={24} xl={24}>
                            <Card
                                className="cardWithFooter aiIntentBox"
                                extra={<a href="#"><Icon icon="material-symbols:refresh-rounded" width={20} height={20} /></a>}
                                title={<span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon icon="lineicons:gemini" width={20} height={20} color="#40ACE2" />AI Intent Box</span>}
                                style={{ marginBottom: 15 }}
                            >
                                <div className="listMediumCard" style={{marginTop:15}}>
                                    {(() => {
                                        type Intent = { title: string; detail: string; recommendation: string };
                                        const intents: Intent[] = [
                                            {
                                                title: "Payment Status Issue",
                                                detail:
                                                    "Customer reports AED 150 was deducted yesterday, but service not delivered.",
                                                recommendation:
                                                    "Verify payment record, link case ID to billing, and inform customer of expected resolution timeline.",
                                            },
                                            {
                                                title: "Case Creation",
                                                detail:
                                                    "System confirms case ticket has been generated.",
                                                recommendation:
                                                    "Track Case ID: DD-2025-4321 in Case Management Panel. Keep customer updated on provider's response.",
                                            },
                                            {
                                                title: "Refund / Compensation Guidance",
                                                detail:
                                                    "If provider cannot deliver service within SLA, initiate refund inquiry or compensation process.",
                                                recommendation:
                                                    "Offer customer refund inquiry option and set reminder for follow-up.",
                                            },
                                        ];

                                        return (
                                            <List
                                                itemLayout="vertical"
                                                split={false}
                                                dataSource={intents}
                                                renderItem={(it, idx) => (
                                                    <List.Item key={idx} style={{ padding: 0, marginBottom: 12 }}>
                                                        <div className="intentListItem">
                                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                                <span className="iconWrap">
                                                                    <Icon icon="solar:flag-2-bold-duotone" width={16} height={16} />
                                                                </span>
                                                                <span style={{ fontWeight: 600 }}>{it.title}</span>
                                                            </div>

                                                            <div style={{ lineHeight: 1.5, marginBottom: 8 }}>{it.detail}</div>

                                                            <div style={{ lineHeight: 1.5 }}>
                                                                <strong>Recommendation: </strong>
                                                                {it.recommendation}
                                                            </div>
                                                        </div>
                                                    </List.Item>
                                                )}
                                            />
                                        );
                                    })()}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                {/* End Secondary Column */}

            </Row>


        </div>
    );
}
