import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InboundCall } from "@/api/inbound";

type InboundState = {
  callsByRoom: Record<string, InboundCall>;
  queue: string[];
  isPendingLoading: boolean;
  isSseConnecting: boolean;
  isSseConnected: boolean;
  lastEventAt?: string;
  error?: string | null;
};

const initialState: InboundState = {
  callsByRoom: {},
  queue: [],
  isPendingLoading: false,
  isSseConnecting: false,
  isSseConnected: false,
  error: null,
};

const upsertQueue = (queue: string[], roomName: string) => {
  const idx = queue.indexOf(roomName);
  if (idx !== -1) return queue;
  return [roomName, ...queue].slice(0, 25);
};

const removeFromQueue = (queue: string[], roomName: string) => {
  return queue.filter((room) => room !== roomName);
};

const inboundSlice = createSlice({
  name: "inbound",
  initialState,
  reducers: {
    setPendingLoading(state, action: PayloadAction<boolean>) {
      state.isPendingLoading = action.payload;
    },
    setPendingCalls(state, action: PayloadAction<InboundCall[]>) {
      state.callsByRoom = {};
      state.queue = [];
      action.payload.forEach((call) => {
        state.callsByRoom[call.roomName] = call;
        state.queue.push(call.roomName);
      });
    },
    upsertInboundCall(state, action: PayloadAction<InboundCall>) {
      const call = action.payload;
      state.callsByRoom[call.roomName] = call;
      state.queue = upsertQueue(state.queue, call.roomName);
      state.lastEventAt = new Date().toISOString();
    },
    removeInboundCall(state, action: PayloadAction<string>) {
      const roomName = action.payload;
      delete state.callsByRoom[roomName];
      state.queue = removeFromQueue(state.queue, roomName);
      state.lastEventAt = new Date().toISOString();
    },
    setSseStatus(state, action: PayloadAction<"idle" | "connecting" | "open" | "closed">) {
      state.isSseConnecting = action.payload === "connecting";
      state.isSseConnected = action.payload === "open";
      if (action.payload === "closed") {
        state.isSseConnecting = false;
        state.isSseConnected = false;
      }
    },
    setInboundError(state, action: PayloadAction<string | null | undefined>) {
      state.error = action.payload ?? null;
    },
    clearInboundCalls(state) {
      state.callsByRoom = {};
      state.queue = [];
    },
  },
});

export const {
  setPendingLoading,
  setPendingCalls,
  upsertInboundCall,
  removeInboundCall,
  setSseStatus,
  setInboundError,
  clearInboundCalls,
} = inboundSlice.actions;

export default inboundSlice.reducer;
