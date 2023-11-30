export default function handleTime(item) {
  const time = Math.floor(
    (Date.now() - new Date(item * 1000)) / 1000 / 60 / 60
  );
  if (time === 0) {
    return `${Math.floor(
      (Date.now() - new Date(item * 1000)) / 1000 / 60
    )} minutes ago`;
  } else if (
    Math.floor((Date.now() - new Date(item * 1000)) / 1000 / 60 / 60) === 1
  ) {
    return "1 hour ago";
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
