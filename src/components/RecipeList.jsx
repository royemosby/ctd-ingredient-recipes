import Recipe from './Recipe';

function RecipeList({ results: recipes }) {
  return (
    <>
      {recipes?.length > 0 ? (
        <ul>
          {recipes.map((recipe) => {
            return <Recipe key={recipe.id} recipe={recipe} />;
          })}
        </ul>
      ) : (
        <p>No results</p>
      )}
    </>
  );
}

export default RecipeList;
