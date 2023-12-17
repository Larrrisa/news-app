import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { allNewsApi } from "./apis";

export const store = configureStore({
  reducer: {
    [allNewsApi.reducerPath]: allNewsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(allNewsApi.middleware);
  },
});

setupListeners(store.dispatch);

export { useFetchAllNewsQuery, useFetchNewsByIdQuery } from "./apis";
