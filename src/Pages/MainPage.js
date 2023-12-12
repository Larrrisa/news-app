import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import NewsPage from "./NewsPage";
import getNews from "../Services/getNews";

import handleTime from "../Utils/formatTime";
import { Image, Segment } from "semantic-ui-react";

function MainPage() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getNews(setIsLoading, setNews);
  }, []);

  function handleRefreshNews() {
    getNews(setIsLoading, setNews);
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
        {isLoading ? (
          <Segment>
            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Segment>
        ) : (
          news.map((data) => {
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
          })
        )}
      </div>
    </div>
  );
}

export default MainPage;
