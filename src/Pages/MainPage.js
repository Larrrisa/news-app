import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import NewsPage from "./NewsPage";
import handleTime from "../Utils/formatTime";
import { Image, Segment } from "semantic-ui-react";
import { useFetchAllNewsQuery } from "../Redux/apis";

function MainPage() {
  const { data, isLoading, refetch } = useFetchAllNewsQuery();

  function handleRefreshNews() {
    refetch();
  }

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
          data &&
          data.map((item) => {
            return (
              <div className="news__item" key={item.data.id}>
                <div className="news__item__info">
                  <Link
                    to={{
                      pathname: `${item.data.id}`,
                    }}
                  >
                    <p className="news__item__info__heading">
                      {item.data.title}
                    </p>
                  </Link>
                  <div>
                    {handleTime(item.data.time)} - by
                    <span className="news__item__info__user">
                      {" "}
                      {item.data.by}
                    </span>
                  </div>
                </div>
                <div className="news__item__info__social">
                  <p>
                    {item.data.score === 1
                      ? ` ${item.data.score} point`
                      : `${item.data.score} points`}
                  </p>
                  <p>
                    {item.data.descendants
                      ? `${item.data.descendants} comments`
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
