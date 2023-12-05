export default async function getNews(setIsLoading, setNews) {
  setIsLoading(true);
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
  setIsLoading(false);
}
