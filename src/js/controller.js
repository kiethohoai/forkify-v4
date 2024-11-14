import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

// todo controlRecipe
const controlRecipe = async function () {
  try {
    /* Get the hash id changed*/
    const id = window.location.hash.slice(1);
    if (!id) return;

    /* Render spinner */
    recipeView.renderSpinner();

    /* Loading Recipe */
    await model.loadRecipe(id);

    /* Render recipe */
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(`error (controlRecipe):`, error);
    recipeView.renderError();
  }
};

// todo controlSearchResult
const controlSearchResult = async function () {
  try {
    // display spinner
    resultsView.renderSpinner();

    // get query
    const query = searchView.getQuery() || `pizza`;
    if (!query) return;

    // fetching data
    await model.loadSearchResults(query);

    // render results
    resultsView.render(model.state.search.results);
  } catch (error) {
    console.log(`error (controlSearchResult):`, error);
  }
};

// todo Event listeners
const init = (function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResult);
})();
