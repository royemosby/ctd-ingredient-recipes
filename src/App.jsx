import { useEffect, useState } from 'react';
import './App.css';
import IngredientForm from './components/IngredientForm';
import RecipeList from './components/RecipeList';

const KEY = import.meta.env.VITE__API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';
function App() {
  const [term, setTerm] = useState('');
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (!term) {
      return;
    }
    async function getRecipes() {
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${KEY}`,
        },
      };
      try {
        const resp = await fetch(
          `${BASE_URL}/complexSearch?includeIngredients=${term}&addRecipeInformation=true`,
          options
        );
        if (resp.ok) {
          // resp includes number, offset, totalResults
          const recipeList = await resp.json();
          setRecipes([...recipeList.results]);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getRecipes();
  }, [term]);
  return (
    <>
      <main>
        <h1>Find Recipes by Ingredient</h1>
        <IngredientForm term={term} setTerm={setTerm} />
        <RecipeList results={recipes} />
      </main>
    </>
  );
}

export default App;
