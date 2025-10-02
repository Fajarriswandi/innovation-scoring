import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { Row, Col, Card, List, Button, Spin, Alert, Empty, message, Tag } from "antd";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Icon } from "@iconify/react";
import { useCallStream } from "@/hooks/useCallStream";
import { LIVE_CALL_SESSION_STORAGE_KEY, type LiveCallSession } from "@/constants/liveCall";
import LiveKitCallView from "@/features/livecall/components/LiveKitCallView";
import { endCaseCall, dialCaseCustomer } from "@/api/handlers";
import { ConnectionState, Participant, DisconnectReason as DisconnectReasonEnum } from "livekit-client";
import type { DisconnectReason } from "livekit-client";

const gutter: [number, object] = [16, { xs: 12, sm: 16, md: 20, lg: 24 }];

export default function LiveCallAnalysisPage() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const stateSession = (location.state as { callSession?: LiveCallSession } | null)?.callSession;
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const caseId = useMemo(() => searchParams.get("case") ?? searchParams.get("case_id"), [searchParams]);
    const { transcripts, isConnected, isLoading, error } = useCallStream(caseId);
    const [callSession, setCallSession] = useState<LiveCallSession | null>(null);
    const [isEndingCall, setIsEndingCall] = useState(false);
    const [isDialingCustomer, setIsDialingCustomer] = useState(false);
    const hasEndedRef = useRef(false);
    const [roomState, setRoomState] = useState<ConnectionState>(ConnectionState.Disconnected);
    const [roomParticipants, setRoomParticipants] = useState<Participant[]>([]);
    const [disconnectReason, setDisconnectReason] = useState<DisconnectReason | null>(null);
    const [reconnectKey, setReconnectKey] = useState(0);
    const [livekitError, setLivekitError] = useState<Error | null>(null);

    useEffect(() => {
        dispatch(setSmallTitle("Live Call Analysis"));
        return () => {
            dispatch(setSmallTitle("Dashboard"));
        };
    }, [dispatch]);

    useEffect(() => {
        if (!caseId) {
            setCallSession(null);
            setRoomParticipants([]);
            setRoomState(ConnectionState.Disconnected);
            setLivekitError(null);
            return;
        }

        if (stateSession && stateSession.caseId === caseId) {
            hasEndedRef.current = false;
            setCallSession(stateSession);
            setLivekitError(null);
            return;
        }

        try {
            const raw = sessionStorage.getItem(LIVE_CALL_SESSION_STORAGE_KEY);
            if (!raw) {
                setCallSession(null);
                setRoomParticipants([]);
                setRoomState(ConnectionState.Disconnected);
                setLivekitError(null);
                return;
            }
            const parsed = JSON.parse(raw) as LiveCallSession;
            if (parsed.caseId === caseId) {
                hasEndedRef.current = false;
                setCallSession(parsed);
                setLivekitError(null);
            } else {
                hasEndedRef.current = false;
                setCallSession(null);
            }
        } catch (err) {
            if (import.meta.env.DEV) {
                console.error("[LiveCallAnalysisPage] failed to parse call session", err);
            }
            hasEndedRef.current = false;
            setCallSession(null);
            setLivekitError(err instanceof Error ? err : new Error("Failed to load call session"));
        }
    }, [caseId, stateSession]);

    const transcriptItems = useMemo(() => {
        if (!transcripts.length) return [];
        return transcripts.map((item) => {
            const formattedTime = (() => {
                const date = new Date(item.timestamp);
                if (Number.isNaN(date.getTime())) return item.timestamp;
                return date.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });
            })();

            return {
                id: item.id,
                time: formattedTime,
                role: item.speaker,
                text: item.text,
            };
        });
    }, [transcripts]);

    const connectionLabel = useMemo(() => {
        switch (roomState) {
            case ConnectionState.Connected:
                return { text: "Connected", color: "success" as const };
            case ConnectionState.Connecting:
                return { text: "Connecting", color: "processing" as const };
            case ConnectionState.Reconnecting:
                return { text: "Reconnecting", color: "warning" as const };
            case ConnectionState.Disconnected:
            default:
                return { text: "Disconnected", color: "default" as const };
        }
    }, [roomState]);

    const disconnectMessage = useMemo(() => {
        if (disconnectReason == null) return null;
        const label = DisconnectReasonEnum[disconnectReason] ?? String(disconnectReason);
        switch (disconnectReason) {
            case DisconnectReasonEnum.CLIENT_INITIATED:
                return "Call ended locally.";
            case DisconnectReasonEnum.SERVER_SHUTDOWN:
                return "Server requested the call to end.";
            case DisconnectReasonEnum.DUPLICATE_IDENTITY:
                return "Another client joined with the same identity.";
            case DisconnectReasonEnum.PARTICIPANT_REMOVED:
                return "You were removed from the room.";
            case DisconnectReasonEnum.ROOM_DELETED:
            case DisconnectReasonEnum.ROOM_CLOSED:
                return "Room was closed by the server.";
            case DisconnectReasonEnum.CONNECTION_TIMEOUT:
            case DisconnectReasonEnum.SESSION_TIMEOUT:
                return "Session timed out.";
            case DisconnectReasonEnum.USER_UNAVAILABLE:
                return "Customer did not answer the call.";
            case DisconnectReasonEnum.USER_REJECTED:
                return "Customer rejected the call.";
            case DisconnectReasonEnum.SIP_TRUNK_FAILURE:
                return "SIP trunk failure.";
            case DisconnectReasonEnum.MEDIA_FAILURE:
                return "Media failure detected.";
            default:
                return `Connection to LiveKit was interrupted (${label}).`;
        }
    }, [disconnectReason]);

    const participantBadges = useMemo(() => {
        if (!roomParticipants.length) {
            return [
                <Tag key="no-participants" color="default" style={{ marginBottom: 4 }}>
                    No participants
                </Tag>,
            ];
        }
        return roomParticipants.map((participant) => {
            const label =
                typeof participant.identity === "string" && participant.identity.trim()
                    ? participant.identity
                    : typeof participant.name === "string" && participant.name.trim()
                        ? participant.name
                        : typeof participant.metadata === "string" && participant.metadata.trim()
                            ? participant.metadata
                            : participant.sid;
            const color = participant.isSpeaking ? "green" : "blue";
            return (
                <Tag key={participant.sid} color={color} style={{ marginBottom: 4 }}>
                    {label}
                </Tag>
            );
        });
    }, [roomParticipants]);

    useEffect(() => {
        if (!callSession) {
            setRoomParticipants([]);
            setRoomState(ConnectionState.Disconnected);
            setLivekitError(null);
            setDisconnectReason(null);
        }
    }, [callSession]);

    useEffect(() => {
        if (roomState === ConnectionState.Connected) {
            setDisconnectReason(null);
        }
    }, [roomState]);

    const handleCallDisconnected = useCallback((reason?: DisconnectReason) => {
        setDisconnectReason(reason ?? null);
        setRoomState(ConnectionState.Disconnected);
        setRoomParticipants([]);
        setLivekitError(null);
        if (reason !== undefined && reason !== DisconnectReasonEnum.CLIENT_INITIATED) {
            setReconnectKey((value) => value + 1);
        }
    }, []);

    const handleEndCall = useCallback(async () => {
        if (!callSession?.caseId || isEndingCall || hasEndedRef.current) return;
        setIsEndingCall(true);
        try {
            await endCaseCall(callSession.caseId);
            message.success("Call ended successfully.");
        } catch (err) {
            const errMsg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                (err as { message?: string })?.message ||
                "Unable to end the call.";
            message.error(errMsg);
        } finally {
            setIsEndingCall(false);
            hasEndedRef.current = true;
            sessionStorage.removeItem(LIVE_CALL_SESSION_STORAGE_KEY);
            setCallSession(null);
            setRoomParticipants([]);
            setRoomState(ConnectionState.Disconnected);
            setLivekitError(null);
            setDisconnectReason(DisconnectReasonEnum.CLIENT_INITIATED);
            setReconnectKey(0);
        }
    }, [callSession?.caseId, isEndingCall]);

    const handleDialCustomer = useCallback(async () => {
        if (!callSession?.caseId || isDialingCustomer) return;
        setIsDialingCustomer(true);
        try {
            const result = await dialCaseCustomer(callSession.caseId);
            console.log("Dial customer response:", result);
            message.success(result.message || "Customer is being dialed.");
        } catch (err) {
            console.error("Dial customer error:", err);
            const errMsg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                (err as { message?: string })?.message ||
                "Unable to dial customer.";
            message.error(errMsg);
        } finally {
            setIsDialingCustomer(false);
        }
    }, [callSession?.caseId, isDialingCustomer]);

    // This effect now ONLY runs on component unmount to prevent accidental calls
    useEffect(() => {
        const sessionAtMount = callSession;
        return () => {
            if (!hasEndedRef.current && sessionAtMount?.caseId) {
                endCaseCall(sessionAtMount.caseId).catch((err) => {
                    if (import.meta.env.DEV) {
                        console.error("[LiveCallAnalysisPage] failed to end call on unmount", err);
                    }
                });
                hasEndedRef.current = true;
                sessionStorage.removeItem(LIVE_CALL_SESSION_STORAGE_KEY);
            }
            setLivekitError(null);
            setDisconnectReason(null);
            setReconnectKey(0);
        };
    }, []);

    useEffect(() => () => {
        setRoomParticipants([]);
        setRoomState(ConnectionState.Disconnected);
        setLivekitError(null);
        setDisconnectReason(null);
        setReconnectKey(0);
    }, []);

    useEffect(() => {
        if (callSession) {
            console.log("[LiveCallAnalysisPage] Call session data loaded:", callSession);
        }
    }, [callSession]);

    return (
        <div>
            <Helmet>
                <title>Live Call Analysis | AI Powered Call Center</title>
            </Helmet>

            {!caseId && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message="No case selected"
                    description="Case identifier is missing. Please start a call from the dashboard."
                />
            )}

            <Row gutter={gutter}>


                {/* First Column */}
                <Col xs={24} lg={10} xl={16}>
                    <Row gutter={{ xs: 8, sm: 16, md: 16, lg: 15 }}>

                        <Col xs={24} lg={24} xl={24}>
                            <Card className="noborderHeader CardInCall" style={{ marginBottom: 15, paddingTop: 15 }}>
                                <Row gutter={16} align="stretch">
                                    {/* Video / Avatar Panel */}
                                    <Col xs={24} md={14}>
                                        <div className="imageProfileInCall">
                                            {callSession ? (
                                                <div style={{ position: "relative", width: "100%", height: "400px" }}>
                                                    <LiveKitCallView
                                                        key={`${callSession.roomName}-${reconnectKey}`}
                                                        serverUrl={callSession.livekitUrl}
                                                        token={callSession.livekitToken}
                                                        onDisconnected={handleCallDisconnected}
                                                        onConnectionStateChange={setRoomState}
                                                        onParticipantsChanged={setRoomParticipants}
                                                        onLiveKitError={(err) => setLivekitError(err)}
                                                    />
                                                    <div style={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                                                        <Tag color={connectionLabel.color}>{connectionLabel.text}</Tag>
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-end" }}>
                                                            {participantBadges}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src="/src/assets/img/agent-profile.png"
                                                    alt="caller"
                                                    className="imgProfile"
                                                />
                                            )}
                                            {/* Top-left status */}
                                            <div style={{ position: "absolute", top: 15, left: 15, display: "flex", alignItems: "center", gap: 8, background: "#ffffff20", padding: "4px 10px", borderRadius: 20 }}>
                                                <span
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: 4,
                                                        background:
                                                            roomState === ConnectionState.Connected
                                                                ? "#5DDB13"
                                                                : roomState === ConnectionState.Connecting || roomState === ConnectionState.Reconnecting
                                                                    ? "#ffc107"
                                                                    : "#ff4d4f",
                                                        display: "inline-block",
                                                    }}
                                                />
                                                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
                                                    {connectionLabel.text}
                                                </span>
                                            </div>
                                            {/* Top-right menu 
                                            <div style={{ position: "absolute", top: 15, right: 15 }}>
                                                <Button className="btnGlass" size="large" icon={<Icon icon="pepicons-pencil:dots-y" width={18} height={18} />} />
                                            </div>*/}
                                            {/* Bottom controls */}
                                            <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12 }}>
                                               {/* <Button className="btnGlass" size="large" icon={<Icon icon="material-symbols:mic" width={18} height={18} />} />
                                                <Button className="btnGlass" size="large" icon={<Icon icon="mdi:volume-high" width={18} height={18} />} />
                                                <Button className="btnGlass" size="large" icon={<Icon icon="solar:videocamera-record-bold" width={18} height={18} />} />*/}
                                                <Button
                                                    className="btnGlass"
                                                    size="large"
                                                    danger
                                                    style={{ background: "#ff4d5092", borderColor: "#ff383b63", color: "#fff" }}
                                                    icon={isEndingCall ? <Icon icon="eos-icons:three-dots-loading" width={18} height={18} /> : <Icon icon="mdi:phone-hangup" width={18} height={18} />}
                                                    onClick={handleEndCall}
                                                    disabled={!callSession || isEndingCall}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="primary"
                                            onClick={handleDialCustomer}
                                            disabled={!callSession || isDialingCustomer || roomState !== ConnectionState.Connected}
                                            loading={isDialingCustomer}
                                            style={{ marginTop: 12, width: '100%' }}
                                            icon={<Icon icon="mdi:phone-outgoing" />}
                                        >
                                            Dial Customer
                                        </Button>
                                        {livekitError && (
                                            <Alert
                                                type="error"
                                                showIcon
                                                message="LiveKit error"
                                                description={livekitError.message}
                                                style={{ marginTop: 12 }}
                                            />
                                        )}
                                        {!livekitError && disconnectMessage && (
                                            <Alert
                                                type="warning"
                                                showIcon
                                                message="Disconnected from LiveKit"
                                                description={disconnectMessage}
                                                style={{ marginTop: 12 }}
                                            />
                                        )}
                                    </Col>

                                    {/* Info + Quick Actions */}
                                    <Col xs={24} md={10}>
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
                                    {callSession && (
                                        <div style={{ marginBottom: 12, fontSize: 12, color: "#64748b" }}>
                                            Live room: <strong>{callSession.roomName}</strong>
                                            {callSession.customerName && (
                                                <span style={{ marginLeft: 6 }}>
                                                    • Customer: {callSession.customerName}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {error && (
                                        <Alert
                                            type="error"
                                            showIcon
                                            style={{ marginBottom: 12 }}
                                            message="Live transcript connection error"
                                            description={error}
                                        />
                                    )}

                                    {isLoading && !transcriptItems.length && (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "24px 0" }}>
                                            <Spin />
                                            <div style={{ fontSize: 12, color: "#64748b" }}>Connecting to call stream...</div>
                                        </div>
                                    )}

                                    {!isLoading && !transcriptItems.length && (
                                        <Empty description="No transcript yet" />
                                    )}

                                    {transcriptItems.length > 0 && (
                                        <div>
                                            {transcriptItems.map((item) => (
                                                <div key={item.id} className="transcriptItem" style={{ marginBottom: 10 }}>
                                                    <div className="time" style={{ fontSize: 12, marginBottom: 6 }}>
                                                        {item.time}
                                                        {item.role && item.role.toLowerCase() !== "user" && (
                                                            <span style={{ marginLeft: 8 }}>{item.role}</span>
                                                        )}
                                                    </div>
                                                    <div className="text">{item.text}</div>
                                                </div>
                                            ))}
                                            {!isConnected && !isLoading && (
                                                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
                                                    Stream disconnected. Waiting for updates...
                                                </div>
                                            )}
                                        </div>
                                    )}
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
                                        <div>+6285150920046</div>
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
