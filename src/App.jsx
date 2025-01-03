import { useEffect, useState } from 'react';
import './App.css';
import IngredientForm from './components/IngredientForm';
import RecipeList from './components/RecipeList';

const KEY = import.meta.env.VITE__API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';
function App() {
  const [term, setTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [searchCache, setSearchCache] = useState({});
  const [currentOffset, setCurrentOffset] = useState(0);
  const [nextOffset, setNextOffset] = useState(0);
  const [resultsCount, setResultsCount] = useState(0);
  const [isPaginationDisabled, setIsPaginationDisabled] = useState(false);
  const paginationSize = 10;

  useEffect(() => {
    if (!term) {
      return;
    }
    if (nextOffset > 0) {
      if (nextOffset === currentOffset) {
        return;
      }
    }
    const pendingQuery = `${term} offset ${nextOffset}`;
    if (searchCache[pendingQuery]) {
      console.log('setting from cache: ', searchCache[pendingQuery]);
      setCurrentOffset(nextOffset);
      setRecipes([...searchCache[pendingQuery]]);
      return;
    }
    async function getRecipes() {
      console.log('fetching from api...');
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${KEY}`,
        },
      };
      const params = [
        `includeIngredients=${term}`,
        `addRecipeInformation=true`,
        `offset=${nextOffset}`,
        `number=${paginationSize}`,
      ];
      const url = `${BASE_URL}/complexSearch?${params.join('&')}`;
      console.log(url);
      try {
        const resp = await fetch(url, options);
        if (resp.ok) {
          const results = await resp.json();
          setRecipes([...results.results]);
          setResultsCount(results.totalResults);
          setCurrentOffset(results.offset);
          setSearchCache((prev) => {
            return {
              ...prev,
              [`${term} offset ${results.offset}`]: [...results.results],
            };
          });
          //setTerm('');
        }
      } catch (e) {
        console.log(e);
      }
    }
    getRecipes();
  }, [term, searchCache, nextOffset, currentOffset]);

  useEffect(() => {
    setNextOffset(0);
  }, [term]);

  function pageForward() {
    setIsPaginationDisabled(true);
    const maxPages = Math.ceil(resultsCount / paginationSize);
    const currentPage = Math.ceil(currentOffset / paginationSize) + 1;
    if (currentPage >= maxPages) {
      return;
    }
    setNextOffset(currentOffset + paginationSize);
    setTimeout(() => setIsPaginationDisabled(false), 650);
  }

  function pageBack() {
    setIsPaginationDisabled(true);
    if (currentOffset <= 0) {
      return;
    }
    setNextOffset(currentOffset - paginationSize);
    setTimeout(() => setIsPaginationDisabled(false), 650);
  }

  function isBackButtonDisabled() {
    return currentOffset + paginationSize >= resultsCount;
  }

  return (
    <>
      <main>
        <h1>Find Recipes by Ingredient</h1>
        <IngredientForm term={term} setTerm={setTerm} />
        <RecipeList results={recipes} />
        {recipes.length > 0 && (
          <div className="paginate">
            <button
              disabled={currentOffset === 0 || isPaginationDisabled}
              onClick={pageBack}
            >
              Previous
            </button>
            <span>
              Page {Math.floor(currentOffset / paginationSize) + 1} of{' '}
              {Math.ceil(resultsCount / paginationSize)}
            </span>
            <button
              onClick={pageForward}
              disabled={isBackButtonDisabled() || isPaginationDisabled}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
