import { useInboundNotifications } from "@/hooks/useInboundNotifications";

export default function InboundCallProvider() {
  useInboundNotifications(true);
  return null;
}
