import { Action, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import userSlice from "./slices/userSlice";
import conversationsSlice from "./slices/conversationSlice";
import { createWrapper } from "next-redux-wrapper";
import messagesSlice from "./slices/messageSlice";
import { postsApi, profilesApi } from "@/utils/api";
const { serialize, deserialize } = require("json-immutable");

export function makeStore() {
  return configureStore({
    reducer: {
      user: userSlice,
      conversations: conversationsSlice,
      messages: messagesSlice,
      [postsApi.reducerPath]: postsApi.reducer,
      [profilesApi.reducerPath]: profilesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        profilesApi.middleware,
        postsApi.middleware,
      ]),
  });
}

export const store = makeStore();

export type RootStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<RootStore["getState"]>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;

export const wrapper = createWrapper<RootStore>(makeStore, {
  serializeState: (state) => serialize(state),
  deserializeState: (state) => deserialize(state),
});
