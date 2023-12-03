export default function childComments(items) {
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
