import { Icon } from "@iconify/react";

type IncomingCallWidgetProps = {
  callerName?: string;
  callerStatus?: string;
  avatarUrl?: string;
  visible?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
};

export default function IncomingCallWidget({
  callerName = "Amanda Henderson",
  callerStatus = "is now calling...",
  avatarUrl,
  visible = true,
  onAccept,
  onReject,
  isAccepting = false,
  isRejecting = false,
}: IncomingCallWidgetProps) {
  if (!visible) return null;

  const initials = getInitials(callerName);

  return (
    <aside className="incoming-call-widget">
      <div className="incoming-call-widget__alert">
        <Icon icon="solar:bell-bing-bold" />
      </div>
      <div className="incoming-call-widget__content">
        <div className="incoming-call-widget__identity">
          <div className="incoming-call-widget__avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={callerName} />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="incoming-call-widget__meta">
            <p className="incoming-call-widget__name">{callerName}</p>
            <p className="incoming-call-widget__status">{callerStatus}</p>
          </div>
        </div>
        <div className="incoming-call-widget__actions">
          <button
            type="button"
            className="incoming-call-widget__button incoming-call-widget__button--accept"
            onClick={onAccept}
            disabled={isAccepting}
            aria-busy={isAccepting}
          >
            {isAccepting ? "Joining..." : "Accept"}
          </button>
          <button
            type="button"
            className="incoming-call-widget__button incoming-call-widget__button--reject"
            onClick={onReject}
            disabled={isAccepting || isRejecting}
            aria-busy={isRejecting}
          >
            {isRejecting ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </aside>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("");
}
