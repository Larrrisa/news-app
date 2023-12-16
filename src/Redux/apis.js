import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const allNewsApi = createApi({
  reducerPath: "allNews",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://hacker-news.firebaseio.com/v0",
  }),
  endpoints(builder) {
    return {
      fetchAllNews: builder.query({
        query: (news) => {
          return {
            url: "/topstories.json",
            params: {},
            method: "GET",
          };
        },
      }),
      fetchNewsById: builder.query({
        query: (id) => {
          return {
            url: `/item/${id}.json`,
            params: {},
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useFetchAllNewsQuery, useFetchNewsByIdQuery } = allNewsApi;
export { allNewsApi };
