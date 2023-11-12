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
      const result = Promise.all(comment);
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

  return (
    <div>
      <p>{newsInfo && newsInfo.url}</p>
      <p>{newsInfo && newsInfo.title}</p>
      <p>{newsInfo && newsInfo.time}</p>
      <p>{newsInfo && newsInfo.by}</p>
      <p>{newsInfo && newsInfo.descendants}</p>
      {/* <div>{comments && comments.map((item) => <div>{item.text}</div>)}</div> */}
    </div>
  );
}

export default Page;
