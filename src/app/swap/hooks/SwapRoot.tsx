import React, { createContext, useReducer } from "react";

export interface SwapItem {
  inputValue?: string;
  balance?: number;
  token?: "dota" | "usdt";
}

export interface Swap {
  pay: SwapItem;
  received: SwapItem;
}

export interface SwapPayload {
  type: "pay" | "received";
  data?: SwapItem;
}

export type SwapDispatch =
  | {
      type: "set" | "clear";
      payload: SwapPayload;
    }
  | {
      type: "switch";
    };

const swapState: Swap = {
  pay: {},
  received: {},
};

function swapReducer(state: Swap, action: SwapDispatch) {
  switch (action.type) {
    case "set":
      const setPld = action.payload;
      if (setPld.data) {
        state[setPld.type] = { ...state[setPld.type], ...setPld.data };
      } else {
        state[setPld.type] = {};
      }
      return { ...state };
    case "clear":
      const clearPld = action.payload;
      if (clearPld.data) {
        state[clearPld.type] = {};
      }
      return { ...state };
    case "switch":
      const oldPay = state.pay;
      const oldReceived = state.received;
      state = {
        pay: {
          token: oldReceived.token,
          inputValue: "",
        },
        received: { token: oldPay.token, inputValue: "" },
      };
      return { ...state };
    default:
      throw new Error("Action error");
  }
}

export const SwapContext = createContext<{
  data: Swap;
  dispatch: React.Dispatch<SwapDispatch>;
} | null>(null);

export const SwapConsumer = SwapContext.Consumer;

export const SwapRoot: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, dispatch] = useReducer(swapReducer, swapState);
  return (
    <SwapContext.Provider value={{ data, dispatch }}>
      {children}
    </SwapContext.Provider>
  );
};
