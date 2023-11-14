import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Page() {
  const { id } = useParams();

  const [newsInfo, setNewsInfo] = useState();
  const [comments, setComments] = useState();
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
      console.log(info);
      setComments(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  function handleChildComment(e, id) {
    console.log(e.target.id);
    // const getComment = async () => {
    //   try {
    //     const link = `https://hacker-news.firebaseio.com/v0/item/${e.target.id}.json`;
    //     const comment = await fetch(link);
    //     const data = await comment.json();

    //     setNews(data);
    //   } catch {
    //     console.log("error");
    //   }
    // };
    // useEffect(() => {
    //   getComment();
    // }, [e.target.id]);
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
              <button id={item.id} onClick={(e) => handleChildComment(e, id)}>
                Раскрыть
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Page;
