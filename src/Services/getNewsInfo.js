export default async function getNewsInfo(id, setNewsInfo) {
  try {
    const link = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
    const newsResult = await fetch(link);
    const info = await newsResult.json();
    setNewsInfo(info);
  } catch (err) {
    console.log(err.message);
  }
}
