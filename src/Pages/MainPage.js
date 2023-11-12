import { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Page from "./news";

export function MainPage() {
  const [news, setNews] = useState([]);

  const getNews = async () => {
    try {
      const link = "https://hacker-news.firebaseio.com/v0/topstories.json";
      const newsResult = await fetch(link);
      const data = await newsResult.json();
      const news = data
        .slice(0, 100)
        .map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
            (res) => res.json()
          )
        );
      const result = await Promise.all(news);
      setNews(result);
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  function handleRefreshNews() {
    getNews();
  }

  return (
    <div>
      <h1>Hacker News</h1>
      <Button content="Refresh" active onClick={handleRefreshNews} />
      {news.map((data) => {
        return (
          <div key={data.id}>
            <Link
              to={{
                pathname: `${data.id}`,
              }}
            >
              {data.title} - Рейтинг:{data.score} - Name: {data.by} - Date:
              {new Date(data.time).toString()}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default MainPage;
