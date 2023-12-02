import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="container">
      <div className="header">
        <h1>404 ERROR</h1>
      </div>
      <div className="content_errorpage">
        <p>Try again, please</p>

        <div className="link_errorpage">
          <Link
            to={{
              pathname: "/",
            }}
          >
            Back to the homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
