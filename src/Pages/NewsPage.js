import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import handleTime from "../Utils/formatTime";
import { childComments, handleShowComments } from "../Utils/childComments";
import getComments from "../Services/getComments";
import { Image, Segment } from "semantic-ui-react";
import { useFetchNewsByIdQuery } from "../Redux/apis";

function NewsPage() {
  const { id } = useParams();
  const {
    data: newsData,
    isLoading: isNewsLoading,
    refetch: newsRefetch,
  } = useFetchNewsByIdQuery(id);

  console.log(newsData);

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getComments(setIsLoading, setComments, id);
  }, []);

  function handleRefreshComments() {
    getComments(setIsLoading, setComments, id);
  }

  return (
    <div className="container">
      <div className="link">
        <Link
          to={{
            pathname: "/",
          }}
        >
          Go back
        </Link>
      </div>
      {newsData && (
        <div key={newsData.time.id}>
          <div className="header_comments">
            <h1>{newsData.title} </h1>
          </div>
          <div className="comments__info">
            <p className="comments__info__link">{newsData.url}</p>
            <div className="comments__info__social">
              <p>{handleTime(newsData.time)}</p>
              <p>
                by <span className="comments__info__user">{newsData.by}</span>
              </p>
            </div>
          </div>
          <div className="comments__count">
            <span>{newsData.descendants ? newsData.descendants : 0}</span>
            <p>Comments</p>
            <div onClick={handleRefreshComments}>
              <ion-icon size="large" name="refresh-outline"></ion-icon>
            </div>
          </div>
        </div>
      )}

      <div className="content">
        {isLoading ? (
          <Segment>
            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Segment>
        ) : (
          comments &&
          comments.map(
            (item) =>
              !item.main.dead &&
              !item.main.deleted && (
                <div
                  className="comments__item"
                  key={item.main.id}
                  onClick={(e) =>
                    handleShowComments(id, e, item, comments, setComments)
                  }
                >
                  <div dangerouslySetInnerHTML={{ __html: item.main.text }} />
                  <div>{item.show && childComments(item.child)}</div>
                </div>
              )
          )
        )}
      </div>
    </div>
  );
}

export default NewsPage;
