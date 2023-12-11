import { createSlice, createAsyncThunk, isPending } from "@reduxjs/toolkit";
import getNews from "../Services/getNews";

const initialState = { data: [], isLoading: false };

export const getAllNews = createAsyncThunk(
  "allNews/getAllNews",
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const allNews = await getNews().then((res) => res.slice(0, 100));

      // const newsList = await Promise.allSettled(
      //   allNews.map((i) => getNewsInfo(i))
      // );

      return fulfillWithValue(allNews);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const newsSlice = createSlice({
  name: "newsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllNews.fulfilled, (state, action) => {
      state.isLoading = false;
      state.newsList = action.payload.reduce((acc, el) => {
        if (el.status === "fulfilled") {
          acc.push(el.value);
          return acc;
        } else {
          return acc;
        }
      }, []);
    });
    builder.addMatcher(isPending(getAllNews), (state) => {
      state.isLoading = true;
    });
  },
});
export default newsSlice.reducer;
