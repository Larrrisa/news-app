import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Page() {
  const { id } = useParams();

  const [newsInfo, setNewsInfo] = useState();
  const [comments, setComments] = useState([]);

  const getNews = async () => {
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
        console.log(result);
        setComments(result);
      });

      setNewsInfo(info);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  const childItems = (items) => {
    return (
      <ul>
        {items &&
          items.map((item) => (
            <li key={item.id}>{item.main.text}</li>
            // <div>{item.child.length > 0 && childItems(item.child)}</div>
          ))}
      </ul>
    );
  };

  return (
    <div key={Math.random()}>
      <p>{newsInfo && newsInfo.url}</p>
      <p>{newsInfo && newsInfo.title}</p>
      <p>{newsInfo && newsInfo.time}</p>
      <p>{newsInfo && newsInfo.by}</p>
      <p>{newsInfo && newsInfo.descendants}</p>
      <div>
        {comments &&
          comments.map((item) => (
            <div key={item.main.id}>
              <p>{item.main.text}</p>
              <button id={item.main.id}>Раскрыть</button>
              <div>{item.child.length > 0 && childItems(item.child)}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Page;
