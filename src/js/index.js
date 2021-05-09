import axios from "axios";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime/runtime";
// import "core-js/stable"; // if polyfills are also needed
// import "@babel/polyfill";
import Search from "./models/search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/**
 * - search object
 * - current recipe
 * - shopping lisst object
 * linked list object
 */
const state = {};

const controlSearch = async () => {
    //1) get query from view
    const query = searchView.getInput();
    console.log(query);

    //TESTING
    // const query = 'pizza';

    if (query) {
        //2. new search object
        state.search = new Search(query);

        //3. prepare ui for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            //4. search for recipes
            await state.search.getResults();

            //5. render results on ui
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something wrong with the search value');
            clearLoader();
        }
    }
};

elements.searchResForm.addEventListener("submit", (e) => {
    e.preventDefault();
    controlSearch();
});

//testing
/*window.addEventListener("load", (e) => {
    e.preventDefault();
    controlSearch();
});*/

elements.searchResPage.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-inline");
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});

//const search = new Search('tomato');
//console.log(search);

// const r = new Recipe(46956);
// r.getRecipe();
// console.log(r);

/*
    Recipe controller
*/
const controlRecipe = async () => {
    //getting the id of the recipe
    const id = window.location.hash.replace("#", "");
    console.log(id);

    if (id) {
        //prepare the ui for the result
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //HighLight selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        }

        //create new recipe object
        state.recipe = new Recipe(id);
 
        //testing
        //window.r = state.recipe;

        try {
            //get recipe data using the id and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calculate servings time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
            // console.log(state.recipe);
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }
};

window.addEventListener("hashchange", controlRecipe);

["hashchange", "load"].forEach((event) =>
    window.addEventListener(event, controlRecipe)
);

// List controller
const controlList = () => {
   // Create a new list IF there in none yet
   if (!state.list) state.list = new List();

   // Add each ingredient to the list and UI
   state.recipe.ingredients.forEach(el => {
       const item = state.list.addItem(el.count, el.unit, el.ingredient);
       listView.renderItem(item);
   });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    }
    else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});
   
/** 
 * LIKE CONTROLLER
 */
 

 const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    console.log(state.likes);
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
        console.log(state.likes);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restor liked recipes on page load
window.addEventListener('load', ()=>{
    state.likes = new Likes();

    //Restore like
    state.likes.readStorage();
    //Toggle the menu btn
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})

elements.recipe.addEventListener('click', e => {

    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            
            state.recipe.updateServings('dec');
           recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {

        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});










