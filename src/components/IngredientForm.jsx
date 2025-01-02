import { useState } from 'react';

function IngredientForm({ setTerm }) {
  const [workingTerm, setWorkingTerm] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setTerm(workingTerm);
  }

  return (
    <form>
      <label htmlFor="searchTerms"></label>
      <input
        type="text"
        id="searchTerms"
        value={workingTerm}
        onChange={(e) => setWorkingTerm(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
}

export default IngredientForm;
