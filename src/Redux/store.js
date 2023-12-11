import { configureStore } from "@reduxjs/toolkit";
import newsSlice from "../Redux/slice";

export const store = configureStore({
  reducer: {
    news: newsSlice,
  },
});
