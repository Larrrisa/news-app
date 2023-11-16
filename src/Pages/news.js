import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Page() {
  const { id } = useParams();

  const [newsInfo, setNewsInfo] = useState();
  const [comments, setComments] = useState();
  const [childComment, setChildComment] = useState();
  const getNews = async () => {
    try {
      const link = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
      const newsResult = await fetch(link);
      const info = await newsResult.json();
      const comment = info.kids.map((item) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${item}.json`).then(
          (res) => res.json()
        )
      );
      const result = await Promise.all(comment);

      setNewsInfo(info);
      setComments(result);
      console.log(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  function fetchChildComments(item) {
    return fetch(
      `https://hacker-news.firebaseio.com/v0/item/${item}.json`
    ).then((res) => res.json());
  }

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
            <div key={item.id}>
              <p>{item.text}</p>
              <button id={item.id}>Раскрыть</button>
              <div>
                {item.kids && item.kids.map((item) => <div>{item}</div>)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Page;
