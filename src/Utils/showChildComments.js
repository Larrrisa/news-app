export default function handleShowComments(id, e, item, comments, setComments) {
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
