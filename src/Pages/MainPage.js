import { useEffect, useState } from "react";
import { Card, Space, Typography, Button, Comment, Flex } from "antd";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  UserOutlined,
  ClockCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";

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

  function handleTime(item) {
    const time = Math.floor(
      (Date.now() - new Date(item * 1000)) / 1000 / 60 / 60
    );
    if (time === 0) {
      return `${Math.floor(
        (Date.now() - new Date(item * 1000)) / 1000 / 60
      )} minutes ago`;
    } else if (time >= 24 && time < 48) {
      return "1 day ago";
    } else if (time >= 48 && time < 72) {
      return "2 days ago";
    } else if (time >= 72) {
      return "few days ago";
    } else {
      return `${Math.floor(
        (Date.now() - new Date(item * 1000)) / 1000 / 60 / 60
      )} hours ago`;
    }
  }

  return (
    <div>
      <Title>Hacker News </Title>
      <div onClick={handleRefreshNews}>
        <RedoOutlined />
        Refresh
      </div>
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
                <Flex gap="middle">
                  {data.score} points
                  <div>
                    <UserOutlined /> {data.by}
                  </div>
                  <div>
                    <ClockCircleOutlined />
                    {handleTime(data.time)}
                  </div>
                </Flex>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

export default MainPage;
