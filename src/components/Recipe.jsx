function Recipe({ recipe }) {
  const { id, title, sourceUrl } = recipe;

  return (
    <li key={id}>
      <div>
        <h2>
          <a href={sourceUrl} target="_blank">
            {title}
          </a>
        </h2>
      </div>
    </li>
  );
}

export default Recipe;
