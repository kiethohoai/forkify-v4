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
  bookmarks: [],
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

    // add bookmarked state into current recipe
    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
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

// todo updateServings
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

// todo addBookmark
export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
};

// todo deleteBookmark
export const deleteBookmark = function (id) {
  // Find & delete current recipe in bookmarks state
  const index = state.bookmarks.findIndex((el) => el.id === id);
  if (index === -1) return;
  state.bookmarks.splice(index, 1);

  // Un-mark current recipe
  if (state.recipe.id === id) state.recipe.bookmarked = false;
};
