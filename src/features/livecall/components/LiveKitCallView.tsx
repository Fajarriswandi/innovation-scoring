import {
  LiveKitRoom,
  ControlBar,
  RoomAudioRenderer,
  useParticipants,
  useConnectionState,
} from "@livekit/components-react";
import { ConnectionState, Participant } from "livekit-client";
import type { DisconnectReason } from "livekit-client";
import { Component, memo, useEffect, type ReactNode } from "react";

export type LiveKitCallViewProps = {
  serverUrl: string;
  token: string;
  connect?: boolean;
  onDisconnected?: (reason?: DisconnectReason) => void;
  onConnectionStateChange?: (state: ConnectionState) => void;
  onParticipantsChanged?: (participants: Participant[]) => void;
  onLiveKitError?: (error: Error) => void;
};

type ErrorBoundaryProps = {
  onError?: (error: Error) => void;
  fallback: ReactNode;
  children: ReactNode;
};

type ErrorBoundaryState = { hasError: boolean; error: Error | null };

class LiveKitErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const ParticipantEventsBridge = memo(function ParticipantEventsBridge({
  onConnectionStateChange,
  onParticipantsChanged,
}: Pick<LiveKitCallViewProps, "onConnectionStateChange" | "onParticipantsChanged">) {
  const participants = useParticipants();
  const connectionState = useConnectionState();

  useEffect(() => {
    if (onConnectionStateChange) {
      onConnectionStateChange(connectionState);
    }
  }, [connectionState, onConnectionStateChange]);

  useEffect(() => {
    if (onParticipantsChanged) {
      onParticipantsChanged(participants);
    }
  }, [participants, onParticipantsChanged]);

  return null;
});

export function LiveKitCallView({
  serverUrl,
  token,
  connect = true,
  onDisconnected,
  onConnectionStateChange,
  onParticipantsChanged,
  onLiveKitError,
}: LiveKitCallViewProps) {
  if (!serverUrl || !token) {
    return (
      <div className="livekitCallContainer">
        <div className="livekit-call-fallback">
          <p>LiveKit connection details are missing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="livekitCallContainer">
      <LiveKitErrorBoundary
        key={token}
        onError={(error) => {
          if (onConnectionStateChange) {
            onConnectionStateChange(ConnectionState.Disconnected);
          }
          if (onParticipantsChanged) {
            onParticipantsChanged([]);
          }
          if (onLiveKitError) {
            onLiveKitError(error);
          }
        }}
        fallback={
          <div className="livekit-call-fallback">
            <p>Unable to render LiveKit call view.</p>
          </div>
        }
      >
        <LiveKitRoom
          data-lk-theme="light"
          serverUrl={serverUrl}
          token={token}
          connect={connect}
          audio={true}
          video={false}
          onDisconnected={onDisconnected}
          style={{ display: "grid", gridTemplateRows: "1fr auto", height: "100%" }}
        >
          <ParticipantEventsBridge
            onConnectionStateChange={onConnectionStateChange}
            onParticipantsChanged={onParticipantsChanged}
          />
          <RoomAudioRenderer />
          <div style={{ flexGrow: 1 }} />
          <div style={{ padding: "12px 0" }}>
            <ControlBar variation="minimal" controls={{ screenShare: false, camera: false, microphone: true }} />
          </div>
        </LiveKitRoom>
      </LiveKitErrorBoundary>
    </div>
  );
}

export default LiveKitCallView;
