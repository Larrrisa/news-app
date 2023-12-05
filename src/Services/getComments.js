export default async function getComments(setIsLoading, setComments, id) {
  try {
    const link = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
    const newsResult = await fetch(link);
    const info = await newsResult.json();

    function fetchComments(info) {
      setIsLoading(true);
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
      setIsLoading(false);
    });
  } catch (err) {
    console.log(err.message);
  }
}
