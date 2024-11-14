import { getJSON } from './helpers.js';
import { API_URL, RES_PER_PAGE } from './config.js';

// todo state
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
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

// todo getSearchResultsPage
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
