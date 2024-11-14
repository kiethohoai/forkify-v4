import { getJSON } from './helpers.js';
import { API_URL } from './config.js';

// todo state
export const state = {
  recipe: {},
};

// todo loadRecipe
export const loadRecipe = async function (id) {
  try {
    /* Fetch & get data */
    const data = await getJSON(`${API_URL}/${id}`);

    /* Format data */
    let { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      cookingTime: recipe.cooking_time,
    };
  } catch (error) {
    throw error;
  }
};
