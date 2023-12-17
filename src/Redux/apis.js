import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const allNewsApi = createApi({
  reducerPath: "allNews",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://hacker-news.firebaseio.com/v0",
  }),
  endpoints(builder) {
    return {
      fetchAllNews: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          const allNews = await fetchWithBQ("/topstories.json");
          if (allNews.error)
            return {
              error: allNews.error,
            };
          const oneNewsInfo = allNews.data.slice(0, 100);

          const result = await Promise.all(
            oneNewsInfo.map((itemId) => {
              return fetchWithBQ(`/item/${itemId}.json`);
            })
          );

          return { data: result };
        },
      }),

      fetchNewsById: builder.query({
        query: (id) => {
          return {
            url: `/item/${id}.json`,
            params: { id: id },
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useFetchAllNewsQuery, useFetchNewsByIdQuery } = allNewsApi;
export { allNewsApi };
