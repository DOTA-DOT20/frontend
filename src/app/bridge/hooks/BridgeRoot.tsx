import React, { createContext, useReducer } from "react";

export interface BridgeItem {
  inputValue?: string;
  inputPercent?: number;
  balance?: number;
  tick?: string;
}

export interface Bridge {
  dot20: BridgeItem;
  token: BridgeItem;
}

export interface BridgePayload {
  type: "dot20" | "token";
  data?: BridgeItem;
}

export type BridgeDispatch = {
  type: "set" | "clear";
  payload: BridgePayload;
};

const bridgeState: Bridge = {
  dot20: {
    inputValue: "0",
    tick: "DOTA",
  },
  token: {
    inputValue: "0",
    tick: "DOTA",
  },
};
function bridgeReducer(state: Bridge, action: BridgeDispatch) {
  const { type, data } = action.payload;
  switch (action.type) {
    case "set":
      if (data) {
        state[type] = { ...state[type], ...data };
      }
      return { ...state };
    case "clear":
      if (data) {
        state[type] = {};
      }
      return { ...state };
    default:
      throw new Error("Action error");
  }
}

export const BridgeContext = createContext<{
  bridge: Bridge;
  dispatch: React.Dispatch<BridgeDispatch>;
} | null>(null);

export const BridgeConsumer = BridgeContext.Consumer;

export const BridgeRoot: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bridge, dispatch] = useReducer(bridgeReducer, bridgeState);
  return (
    <BridgeContext.Provider value={{ bridge, dispatch }}>
      {children}
    </BridgeContext.Provider>
  );
};
