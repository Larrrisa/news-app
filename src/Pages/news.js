import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import { Button, Comment, Form, Header } from "semantic-ui-react";

function Page() {
  const { id } = useParams();
  const [newsInfo, setNewsInfo] = useState();
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(true);
  //const [showChildComment, setShowChildComment] = useState(false);

  const getInfo = async () => {
    try {
      const link = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
      const newsResult = await fetch(link);
      const info = await newsResult.json();
      setNewsInfo(info);
      console.log(info);
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
              !item.main.deleted && (
                <li key={item.id}>
                  <div dangerouslySetInnerHTML={{ __html: item.main.text }} />
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
    <div className="container">
      <button>
        <Link
          to={{
            pathname: "/",
          }}
        >
          Go back
        </Link>
      </button>
      {newsInfo && (
        <div key={newsInfo.time.id}>
          <div className="header">
            <h1>{newsInfo.title} </h1>
          </div>
          <div className="comments__info">
            <p className="comments__info__link">{newsInfo.url}</p>
            <div className="comments__info__social">
              <p>{handleTime(newsInfo.time)}</p>
              <p>
                by <span className="comments__info__user">{newsInfo.by}</span>
              </p>
            </div>
          </div>
          <div className="comments__count">
            <span>{newsInfo.descendants}</span>
            <p>Comments</p>
            <div onClick={handleRefreshComments}>
              <ion-icon size="large" name="refresh-outline"></ion-icon>
            </div>
          </div>
        </div>
      )}

      {/* <button onClick={handleRefreshComments}>Refresh</button> */}

      <div className="content">
        {comments &&
          comments.map(
            (item) =>
              !item.main.deleted && (
                <div className="comments__item" key={item.main.id}>
                  <div
                    onClick={(e) => handleShowComments(id, e, item)}
                    dangerouslySetInnerHTML={{ __html: item.main.text }}
                  />
                  <div>{item.show && childItems(item.child)}</div>
                </div>
              )
          )}
      </div>
    </div>
  );
}

export default Page;
