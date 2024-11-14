import { getJSON } from './helpers.js';
import { API_URL } from './config.js';

// todo state
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
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

// todo loadSearchResults
export const loadSearchResults = async function (query) {
  try {
    // Fetch data
    const data = await getJSON(`${API_URL}?search=${query}`);

    // Add data to search state
    state.search.query = query;
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
      };
    });
  } catch (error) {
    throw error;
  }
};
loadSearchResults();
