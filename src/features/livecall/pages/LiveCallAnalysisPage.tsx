import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, List, Button, Spin, Alert, Empty, message, Tag } from "antd";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Icon } from "@iconify/react";
import { useCallStream } from "@/hooks/useCallStream";
import {
    LIVE_CALL_SESSION_STORAGE_KEY,
    LIVE_CALL_DEBUG_MAX_ENTRIES,
    type LiveCallSession,
    type LiveCallDebugEntry,
} from "@/constants/liveCall";
import LiveKitCallView from "@/features/livecall/components/LiveKitCallView";
import { endCaseCall, dialCaseCustomer, fetchCaseDetail, type BECaseItem } from "@/api/handlers";
import { ConnectionState, Participant, DisconnectReason as DisconnectReasonEnum } from "livekit-client";
import type { DisconnectReason } from "livekit-client";
import {
    appendLiveCallDebugEntry,
    readLiveCallDebugEntries,
    clearLiveCallDebugEntries,
} from "@/utils/liveCallDebug";

const gutter: [number, object] = [16, { xs: 12, sm: 16, md: 20, lg: 24 }];

const createDebugEntryId = () =>
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `livecall-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

export default function LiveCallAnalysisPage() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const locationState = location.state as { callSession?: LiveCallSession; callDebugEntry?: LiveCallDebugEntry } | null;
    const stateSession = locationState?.callSession;
    const stateDebugEntry = locationState?.callDebugEntry;
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const caseId = useMemo(() => searchParams.get("case") ?? searchParams.get("case_id"), [searchParams]);
    const { transcripts, sentiments, isConnected, isLoading, error } = useCallStream(caseId);
    const [callSession, setCallSession] = useState<LiveCallSession | null>(null);
    const [isEndingCall, setIsEndingCall] = useState(false);
    const [isDialingCustomer, setIsDialingCustomer] = useState(false);
    const hasEndedRef = useRef(false);
    const [roomState, setRoomState] = useState<ConnectionState>(ConnectionState.Disconnected);
    const [roomParticipants, setRoomParticipants] = useState<Participant[]>([]);
    const [disconnectReason, setDisconnectReason] = useState<DisconnectReason | null>(null);
    const [reconnectKey, setReconnectKey] = useState(0);
    const [livekitError, setLivekitError] = useState<Error | null>(null);
    const [debugEntries, setDebugEntries] = useState<LiveCallDebugEntry[]>([]);
    const [customerDetail, setCustomerDetail] = useState<BECaseItem | null>(null);
    const [isCustomerLoading, setIsCustomerLoading] = useState(false);
    const [customerError, setCustomerError] = useState<string | null>(null);

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
            setDebugEntries([]);
            setCustomerDetail(null);
            setCustomerError(null);
            setIsCustomerLoading(false);
            return;
        }

        if (stateSession && stateSession.caseId === caseId) {
            hasEndedRef.current = false;
            setCallSession(stateSession);
            setLivekitError(null);
            const storedEntries = readLiveCallDebugEntries();
            if (storedEntries.length) {
                setDebugEntries(storedEntries);
            } else if (stateDebugEntry) {
                setDebugEntries([stateDebugEntry]);
            }
            return;
        }

        try {
            const raw = sessionStorage.getItem(LIVE_CALL_SESSION_STORAGE_KEY);
            if (!raw) {
                setCallSession(null);
                setRoomParticipants([]);
                setRoomState(ConnectionState.Disconnected);
                setLivekitError(null);
                const storedEntries = readLiveCallDebugEntries();
                if (storedEntries.length) {
                    setDebugEntries(storedEntries);
                } else if (!stateDebugEntry) {
                    setDebugEntries([]);
                } else {
                    setDebugEntries([stateDebugEntry]);
                }
                return;
            }
            const parsed = JSON.parse(raw) as LiveCallSession;
            if (parsed.caseId === caseId) {
                hasEndedRef.current = false;
                setCallSession(parsed);
                setLivekitError(null);
                const storedEntries = readLiveCallDebugEntries();
                if (storedEntries.length) {
                    setDebugEntries(storedEntries);
                } else if (stateDebugEntry) {
                    setDebugEntries([stateDebugEntry]);
                }
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
            const storedEntries = readLiveCallDebugEntries();
            if (storedEntries.length) {
                setDebugEntries(storedEntries);
            } else if (stateDebugEntry) {
                setDebugEntries([stateDebugEntry]);
            }
        }
    }, [caseId, stateSession, stateDebugEntry]);

    useEffect(() => {
        const caseUuid = caseId?.trim();
        if (!caseUuid) {
            setCustomerDetail(null);
            setCustomerError(null);
            setIsCustomerLoading(false);
            return;
        }

        let cancelled = false;

        const load = async () => {
            setIsCustomerLoading(true);
            setCustomerError(null);
            try {
                const detail = await fetchCaseDetail(caseUuid);
                if (cancelled) return;
                setCustomerDetail(detail);
            } catch (err) {
                if (cancelled) return;
                const errMsg =
                    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                    (err as { message?: string })?.message ||
                    "Gagal memuat detail pelanggan.";
                setCustomerError(errMsg);
            } finally {
                if (!cancelled) {
                    setIsCustomerLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [caseId]);

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

    const sentimentItems = useMemo(() => {
        if (!sentiments.length) return [];
        const sorted = [...sentiments].sort((a, b) => {
            const aTime = new Date(a.timestamp).getTime();
            const bTime = new Date(b.timestamp).getTime();
            return Number.isNaN(bTime) || Number.isNaN(aTime) ? 0 : bTime - aTime;
        });
        return sorted.map((item) => {
            const formattedTime = (() => {
                const date = new Date(item.timestamp);
                return Number.isNaN(date.getTime())
                    ? item.timestamp
                    : date.toLocaleString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    });
            })();

            return {
                id: item.id,
                time: formattedTime,
                overall: item.overallSentiment,
                score: item.sentimentScore,
                confidence: item.confidence,
                lastUpdated: item.lastUpdated,
                rawTimestamp: item.timestamp,
            };
        });
    }, [sentiments]);

    const toLabelCase = (value?: string | null) => {
        if (!value) return undefined;
        return value
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/(^|\s)\w/g, (match) => match.toUpperCase());
    };

    const customerSummary = useMemo(() => {
        const sessionName = callSession?.customerName?.trim();
        const sessionAvatar = callSession?.customerAvatarUrl?.trim();
        const sessionCaseId = callSession?.caseId;

        const customer = customerDetail?.customer;
        const names = [customer?.first_name, customer?.last_name]
            .map((value) => (typeof value === "string" ? value.trim() : ""))
            .filter(Boolean);
        const nameFromRecord = names.length
            ? names.join(" ")
            : typeof customer?.name === "string" && customer.name.trim()
                ? customer.name.trim()
                : undefined;
        const displayName = nameFromRecord ?? sessionName ?? "Customer";

        const email = typeof customer?.email === "string" && customer.email.trim() ? customer.email.trim() : undefined;
        const phone = typeof customer?.phone === "string" && customer.phone.trim() ? customer.phone.trim() : undefined;

        const avatarCandidates = [customer?.image_url, customer?.photo, sessionAvatar].map((value) =>
            typeof value === "string" && value.trim() ? value.trim() : undefined
        );
        let avatarUrl = avatarCandidates.find((value) => Boolean(value));
        if (!avatarUrl) {
            const encoded = encodeURIComponent(displayName);
            avatarUrl = `https://ui-avatars.com/api/?background=E8F1FF&color=0B3C5D&name=${encoded}`;
        }

        const caseIdentifier = customerDetail?.case_id ?? sessionCaseId ?? caseId ?? undefined;
        const statusLabel = toLabelCase(customerDetail?.status);
        const priorityLabel = toLabelCase(customerDetail?.priority);

        const openedAtRaw = customerDetail?.created_at ?? customerDetail?.updated_at ?? undefined;
        const openedAt = (() => {
            if (!openedAtRaw) return undefined;
            const date = new Date(openedAtRaw);
            if (Number.isNaN(date.getTime())) return openedAtRaw;
            return date.toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        })();

        return {
            name: displayName,
            email,
            phone,
            avatarUrl,
            caseId: caseIdentifier,
            status: statusLabel,
            priority: priorityLabel,
            openedAt,
        };
    }, [callSession?.caseId, callSession?.customerAvatarUrl, callSession?.customerName, caseId, customerDetail]);

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

    const debugTimeline = useMemo(() => [...debugEntries].reverse(), [debugEntries]);

    const recordDebugEntry = useCallback((entry: LiveCallDebugEntry) => {
        appendLiveCallDebugEntry(entry);
        setDebugEntries((prev) => {
            const combined = [...prev, entry];
            const seen = new Set<string>();
            const deduped = combined.filter((item) => {
                if (seen.has(item.id)) {
                    return false;
                }
                seen.add(item.id);
                return true;
            });
            return deduped.slice(-LIVE_CALL_DEBUG_MAX_ENTRIES);
        });
    }, []);

    const handleClearDebugEntries = useCallback(() => {
        clearLiveCallDebugEntries();
        setDebugEntries([]);
    }, []);

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
            recordDebugEntry({
                id: createDebugEntryId(),
                timestamp: new Date().toISOString(),
                action: "end-call",
                caseId: callSession.caseId,
                request: { caseId: callSession.caseId },
                response: { message: "Call ended successfully." },
                notes: "Call ended from live call page.",
            });
            navigate("/dashboard", {
                state: { postCallMessage: "Telah selesai melakukan panggilan." },
            });
        } catch (err) {
            const errMsg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                (err as { message?: string })?.message ||
                "Unable to end the call.";
            message.error(errMsg);
            recordDebugEntry({
                id: createDebugEntryId(),
                timestamp: new Date().toISOString(),
                action: "end-call",
                caseId: callSession.caseId,
                request: { caseId: callSession.caseId },
                error: errMsg,
                notes: "endCaseCall returned an error.",
            });
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
    }, [callSession?.caseId, isEndingCall, navigate, recordDebugEntry]);

    const handleDialCustomer = useCallback(async () => {
        if (!callSession?.caseId || isDialingCustomer) return;
        setIsDialingCustomer(true);
        try {
            const result = await dialCaseCustomer(callSession.caseId);
            console.log("Dial customer response:", result);
            message.success(result.message || "Customer is being dialed.");
            recordDebugEntry({
                id: createDebugEntryId(),
                timestamp: new Date().toISOString(),
                action: "dial-customer",
                caseId: callSession.caseId,
                request: { caseId: callSession.caseId },
                response: result,
                notes: "Dial customer triggered from live call page.",
            });
        } catch (err) {
            console.error("Dial customer error:", err);
            const errMsg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                (err as { message?: string })?.message ||
                "Unable to dial customer.";
            message.error(errMsg);
            recordDebugEntry({
                id: createDebugEntryId(),
                timestamp: new Date().toISOString(),
                action: "dial-customer",
                caseId: callSession?.caseId,
                request: callSession?.caseId ? { caseId: callSession.caseId } : undefined,
                error: errMsg,
                notes: "dialCaseCustomer returned an error.",
            });
        } finally {
            setIsDialingCustomer(false);
        }
    }, [callSession?.caseId, isDialingCustomer, recordDebugEntry]);

    useEffect(() => {
        const sessionCaseId = callSession?.caseId;
        return () => {
            if (!hasEndedRef.current && sessionCaseId) {
                endCaseCall(sessionCaseId).catch((err) => {
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
    }, [callSession?.caseId]);

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
                                    <Col xs={24} md={12}>
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
                                    <Col xs={24} md={12}>
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
                        
                        {/* <Col xs={24} lg={24} xl={12}>
                            <Card
                                className="cardWithFooter"
                                title={<span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon icon="mdi:console" width={20} height={20} color="#40ACE2" />Call API Debug</span>}
                                extra={
                                    <Button
                                        size="small"
                                        type="link"
                                        onClick={handleClearDebugEntries}
                                        disabled={!debugEntries.length}
                                        style={{ padding: 0 }}
                                    >
                                        Clear
                                    </Button>
                                }
                                style={{ marginBottom: 15 }}
                            >
                                {debugTimeline.length === 0 ? (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="No call debug entries yet"
                                        style={{ margin: "24px 0" }}
                                    />
                                ) : (
                                    <List
                                        split={false}
                                        dataSource={debugTimeline}
                                        renderItem={(entry) => {
                                            const formattedTime = (() => {
                                                const date = new Date(entry.timestamp);
                                                return Number.isNaN(date.getTime())
                                                    ? entry.timestamp
                                                    : date.toLocaleString("en-GB", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    });
                                            })();

                                            const actionLabel = entry.action.replace(/-/g, " ");

                                            return (
                                                <List.Item key={entry.id} style={{ paddingLeft: 0, paddingRight: 0 }}>
                                                    <div style={{ width: "100%" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                                                            <span style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{actionLabel}</span>
                                                            <span style={{ fontSize: 11, color: "#64748b" }}>{formattedTime}</span>
                                                        </div>
                                                        {entry.notes && (
                                                            <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>
                                                                {entry.notes}
                                                            </div>
                                                        )}
                                                        {entry.request && (
                                                            <div style={{ marginBottom: 8 }}>
                                                                <div style={{ fontSize: 11, fontWeight: 600, color: "#334155", marginBottom: 4 }}>Request</div>
                                                                <pre
                                                                    style={{
                                                                        background: "#0f172a0d",
                                                                        padding: "8px 10px",
                                                                        borderRadius: 6,
                                                                        fontSize: 12,
                                                                        lineHeight: 1.45,
                                                                        overflowX: "auto",
                                                                        margin: 0,
                                                                    }}
                                                                >
                                                                    {JSON.stringify(entry.request, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}
                                                        {entry.response && (
                                                            <div style={{ marginBottom: 8 }}>
                                                                <div style={{ fontSize: 11, fontWeight: 600, color: "#334155", marginBottom: 4 }}>Response</div>
                                                                <pre
                                                                    style={{
                                                                        background: "#0f172a0d",
                                                                        padding: "8px 10px",
                                                                        borderRadius: 6,
                                                                        fontSize: 12,
                                                                        lineHeight: 1.45,
                                                                        overflowX: "auto",
                                                                        margin: 0,
                                                                    }}
                                                                >
                                                                    {JSON.stringify(entry.response, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}
                                                        {entry.error && (
                                                            <Alert
                                                                type="error"
                                                                showIcon
                                                                message="API error"
                                                                description={entry.error}
                                                                style={{ marginTop: 6 }}
                                                            />
                                                        )}
                                                    </div>
                                                </List.Item>
                                            );
                                        }}
                                    />
                                )}
                            </Card>
                        </Col> */}

                        <Col xs={24} lg={24} xl={12}>
                            <Card
                                className="cardWithFooter analysisCard"
                                title={<span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon icon="lineicons:gemini" width={20} height={20} color="#40ACE2" />Sentiment Analysis</span>}
                                style={{ marginBottom: 15 }}
                            >
                                <div className="listSmallCard" style={{ marginTop: 15 }}>
                                    {sentimentItems.length === 0 ? (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description="No sentiment data yet"
                                            style={{ margin: "24px 0" }}
                                        />
                                    ) : (
                                        <List
                                            itemLayout="vertical"
                                            split={false}
                                            dataSource={sentimentItems}
                                            renderItem={(item) => {
                                                const normalized = item.overall.replace(/_/g, " ");
                                                const overallLabel = normalized.charAt(0).toUpperCase() + normalized.slice(1);
                                                const sentimentStyle = (() => {
                                                    const key = item.overall.toLowerCase();
                                                    if (key.includes("positive")) return { background: "#dcfce7", color: "#166534" };
                                                    if (key.includes("negative")) return { background: "#fee2e2", color: "#991b1b" };
                                                    if (key.includes("neutral")) return { background: "#e2e8f0", color: "#1e293b" };
                                                    return { background: "#f1f5f9", color: "#475569" };
                                                })();

                                                const scoreLabel =
                                                    typeof item.score === "number"
                                                        ? `${(item.score * 100).toFixed(0)}%`
                                                        : "N/A";
                                                const confidenceLabel =
                                                    typeof item.confidence === "number"
                                                        ? `${(item.confidence * 100).toFixed(0)}%`
                                                        : "N/A";
                                                const lastUpdatedTime = item.lastUpdated ? new Date(item.lastUpdated) : null;
                                                const lastUpdatedLabel = lastUpdatedTime && !Number.isNaN(lastUpdatedTime.getTime())
                                                    ? lastUpdatedTime.toLocaleTimeString("en-GB", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                    })
                                                    : item.lastUpdated;

                                                return (
                                                    <List.Item key={item.id} style={{ padding: 0, marginBottom: 12 }}>
                                                        <div className="analysisItem">
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                                                                <span
                                                                    style={{
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                        gap: 8,
                                                                        fontWeight: 600,
                                                                        fontSize: 14,
                                                                        padding: "4px 10px",
                                                                        borderRadius: 999,
                                                                        background: sentimentStyle.background,
                                                                        color: sentimentStyle.color,
                                                                    }}
                                                                >
                                                                    <Icon icon="mdi:chart-bubble" width={16} height={16} />
                                                                    {overallLabel}
                                                                </span>
                                                                <span style={{ fontSize: 11, color: "#64748b" }}>{item.time}</span>
                                                            </div>
                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#475569" }}>
                                                                <span>
                                                                    <strong>Score:</strong> {scoreLabel}
                                                                </span>
                                                                <span>
                                                                    <strong>Confidence:</strong> {confidenceLabel}
                                                                </span>
                                                                {item.lastUpdated && (
                                                                    <span>
                                                                        <strong>Last updated:</strong> {lastUpdatedLabel ?? "—"}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </List.Item>
                                                );
                                            }}
                                        />
                                    )}
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
                                <div style={{ minHeight: 128 }}>
                                    {isCustomerLoading ? (
                                        <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
                                            <Spin />
                                        </div>
                                    ) : customerError ? (
                                        <Alert
                                            type="error"
                                            showIcon
                                            message="Tidak dapat memuat data pelanggan"
                                            description={customerError}
                                        />
                                    ) : (
                                        <>
                                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                                                <img
                                                    src={customerSummary.avatarUrl}
                                                    alt={`${customerSummary.name} avatar`}
                                                    style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }}
                                                />
                                                <div>
                                                    <div style={{ fontSize: 12, color: "#a0a7b3" }}>Name</div>
                                                    <div style={{ fontWeight: 700 }}>{customerSummary.name}</div>

                                                    <div style={{ fontSize: 12, color: "#a0a7b3", marginTop: 10 }}>Email</div>
                                                    <div>{customerSummary.email ?? "—"}</div>

                                                    <div style={{ fontSize: 12, color: "#a0a7b3", marginTop: 10 }}>Phone</div>
                                                    <div>{customerSummary.phone ?? "—"}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}>
                                                <div>
                                                    <div style={{ fontSize: 12, color: "#a0a7b3" }}>Case ID</div>
                                                    <div style={{ fontWeight: 600 }}>{customerSummary.caseId ?? "—"}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 12, color: "#a0a7b3" }}>Status</div>
                                                    <div style={{ fontWeight: 600 }}>{customerSummary.status ?? "—"}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 12, color: "#a0a7b3" }}>Priority</div>
                                                    <div style={{ fontWeight: 600 }}>{customerSummary.priority ?? "—"}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 12, color: "#a0a7b3" }}>Opened</div>
                                                    <div style={{ fontWeight: 600 }}>{customerSummary.openedAt ?? "—"}</div>
                                                </div>
                                            </div>
                                        </>
                                    )}
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
