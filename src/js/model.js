import { getJSON, sendJSON } from './helpers.js';
import { API_KEY, API_URL, RES_PER_PAGE } from './config.js';

// state
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

// createRecipeObject
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

// loadRecipe
export const loadRecipe = async function (id) {
  try {
    /* Fetch & get data */
    const data = await getJSON(`${API_URL}/${id}`);

    /* Format & save data state` */
    state.recipe = createRecipeObject(data);

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

// loadSearchResults
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

// getSearchResultsPage
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

// updateServings
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

// persistBookmarks
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// addBookmark
export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  // Save bookmarks to localStorage
  persistBookmarks();
};

// deleteBookmark
export const deleteBookmark = function (id) {
  // Find & delete current recipe in bookmarks state
  const index = state.bookmarks.findIndex((el) => el.id === id);
  if (index === -1) return;
  state.bookmarks.splice(index, 1);

  // Un-mark current recipe
  if (state.recipe.id === id) state.recipe.bookmarked = false;

  // Save bookmarks to localStorage
  persistBookmarks();
};

// init get the bookmarks from localStorage
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

// uploadRecipe
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((ing) => ing[0].startsWith('ingredient') && ing[1] !== '')
      .map((ing) => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3)
          throw new Error(`Wrong ingredient format. Please use the correct format!`);

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : 0,
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      source_url: newRecipe.sourceUrl,
      ingredients,
    };

    // Fetch API & add to state
    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
