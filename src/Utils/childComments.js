function childComments(items) {
  if (!items || items.length === 0) return null;
  return (
    <ul>
      {items &&
        items.map(
          (item) =>
            !item.main.deleted && (
              <li key={item.id}>
                <div dangerouslySetInnerHTML={{ __html: item.main.text }} />
                {item.child && childComments(item.child)}
              </li>
            )
        )}
    </ul>
  );
}

function handleShowComments(id, e, item, comments, setComments) {
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

export { childComments, handleShowComments };
