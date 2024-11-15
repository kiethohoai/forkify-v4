import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarkView.js';

// todo controlRecipe
const controlRecipe = async function () {
  try {
    /* Get the hash id changed*/
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

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
    resultsView.render(model.getSearchResultsPage(1));

    // render initial pagination button
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(`error (controlSearchResult):`, error);
  }
};

// todo controlPagination
const controlPagination = function (gotoPage) {
  // render NEW results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // render NEW pagination button
  paginationView.render(model.state.search);
};

// todo controlServings
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the Recipe View (All UI)
  // recipeView.render(model.state.recipe);

  // Update the Recipe View (Only Update Elements Changed)
  recipeView.update(model.state.recipe);
};

// todo controlAddBookmark
const controlAddBookmark = function () {
  // Add/Remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmark view
  bookmarksView.render(model.state.bookmarks);
};

// todo Event listeners
const init = (function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
})();
