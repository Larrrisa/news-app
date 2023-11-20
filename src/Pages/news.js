import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Comment, Button } from "antd";
import Icon from "@ant-design/icons";

function Page() {
  const { Title, Text } = Typography;

  const { id } = useParams();
  const [newsInfo, setNewsInfo] = useState();
  const [comments, setComments] = useState([]);
  //const [showChildComment, setShowChildComment] = useState(false);

  const getInfo = async () => {
    try {
      const link = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
      const newsResult = await fetch(link);
      const info = await newsResult.json();
      setNewsInfo(info);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getComments = async () => {
    try {
      const link = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
      const newsResult = await fetch(link);
      const info = await newsResult.json();

      function fetchComments(info) {
        const commentPromises = info.kids.map((item) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${item}.json`).then(
            (res) => res.json()
          )
        );

        return Promise.all(commentPromises).then((comments) => {
          const nestedComments = comments.map((item) => {
            if (item.kids && item.kids.length > 0) {
              return fetchComments(item).then((child) => {
                return {
                  main: item,
                  child: child,
                };
              });
            } else {
              return {
                main: item,
                child: [],
              };
            }
          });
          return Promise.all(nestedComments);
        });
      }
      const allChildComments = fetchComments(info).then((result) => {
        setComments(result);
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getInfo();
    getComments();
  }, []);

  function childItems(items) {
    return (
      <ul>
        {items &&
          items.map(
            (item) =>
              !item.main.dead && (
                <li key={item.id}>
                  {item.main.text}

                  {item.child && childItems(item.child)}
                </li>
              )
          )}
      </ul>
    );
  }

  function handleRefreshComments() {
    getComments();
  }

  function handleShowComments(id, e, item) {
    const updatedComments = comments.map((comment) => {
      if (comment.main.id === item.main.id) {
        return {
          ...comment,
          show: true,
        };
      }
      return comment;
    });
    setComments(updatedComments);
  }

  return (
    <div>
      <Button>
        <Link
          to={{
            pathname: "/",
          }}
        >
          Go back
        </Link>
      </Button>
      {newsInfo && (
        <div key={newsInfo.time.id}>
          <Title>{newsInfo.title} </Title>
          <p>
            <Text underline>{newsInfo.url}</Text>
          </p>

          <p>
            <Text strong>{newsInfo.time}</Text>
          </p>

          <Text strong>By {newsInfo.by}</Text>
          <Text strong>{newsInfo.descendants}</Text>
        </div>
      )}

      <button onClick={handleRefreshComments}>Refresh</button>
      <h2> Comments</h2>

      <div>
        {comments &&
          comments.map(
            (item) =>
              !item.main.dead && (
                <div key={item.main.id}>
                  {item.main.text}

                  <button
                    id={item.main.id}
                    onClick={(e) => handleShowComments(id, e, item)}
                  >
                    Раскрыть
                  </button>
                  <div>{item.show && childItems(item.child)}</div>
                </div>
              )
          )}
      </div>
    </div>
  );
}

export default Page;
