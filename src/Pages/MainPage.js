import { useEffect, useState } from "react";
import { Card, Space, Typography, Button, Comment } from "antd";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";

import Page from "./news";

export function MainPage() {
  const [news, setNews] = useState([]);
  const { Title, Text } = Typography;

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
    <div>
      <Title>Hacker News </Title>
      <Button onClick={handleRefreshNews}>Refresh</Button>
      {news.map((data) => {
        return (
          <div key={data.id}>
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: "flex",
              }}
            ></Space>
            <Card size="middle">
              <Link
                to={{
                  pathname: `${data.id}`,
                }}
              >
                <Text strong>{data.title}</Text>
              </Link>
              <div>
                {data.score} points by {data.by}
                {new Date(data.time).toString()}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

export default MainPage;
