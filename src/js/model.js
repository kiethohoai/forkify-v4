// todo state
export const state = {
  recipe: {},
};

// todo loadRecipe
export const loadRecipe = async function (id) {
  /* Fetch & get data */
  const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(`${data.message} (${res.status})`);

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
};
