import * as model from './model.js';
import recipeView from './views/recipeView.js';

// todo renderSpinner

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
controlRecipe();

// todo Event listeners
const init = (function () {
  recipeView.addHandlerRender(controlRecipe);
})();
