import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Page from "./News";
import handleTime from "../Utils/formatTime";

function MainPage() {
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

  useEffect(() => {
    const timer = setInterval(getNews, 60000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Hacker News </h1>
        <div onClick={handleRefreshNews}>
          <ion-icon size="large" name="refresh-outline"></ion-icon>
        </div>
      </div>
      <div className="content">
        {news.map((data) => {
          return (
            <div className="news__item" key={data.id}>
              <div className="news__item__info">
                <Link
                  to={{
                    pathname: `${data.id}`,
                  }}
                >
                  <p className="news__item__info__heading">{data.title}</p>
                </Link>

                <div>
                  {handleTime(data.time)} - by
                  <span className="news__item__info__user"> {data.by}</span>
                </div>
              </div>
              <div className="news__item__info__social">
                <p>
                  {data.score === 1
                    ? ` ${data.score} point`
                    : `${data.score} points`}
                </p>
                <p>
                  {data.descendants
                    ? `${data.descendants} comments`
                    : `0 comments`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MainPage;
