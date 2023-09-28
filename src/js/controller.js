// Importing images
import * as model from './model.js';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import BookmarksView from './views/bookmarksView.js';
import PaginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. Loading a recipe from API

const controlRecipes = async function () {
    try {
        // get hash from url
        const id = window.location.hash.slice(1);
        //console.log(id);

        if (!id) return;
        RecipeView.renderSpinner();

        //1 . Update results view to mark selected search result
        ResultsView.update(model.getSearchResultsPage());

        //2 . Update bookmarks view
        BookmarksView.update(model.state.bookmarks);

        //3 . Loading recipe
        await model.loadRecipe(id);

        //4 . Rendering recipe
        RecipeView.render(model.state.recipe);

    } catch (err) {
        RecipeView.renderError();
        console.log(err);
    };
};

const controlSearchResults = async function () {
    try {
        ResultsView.renderSpinner();
//1 . Get search query
        const query = SearchView.getQuery();
        if (!query) return;
//2 . Load search results
        await model.loadSearchResults(query);
//3 . Render results
        ResultsView.render(model.getSearchResultsPage())
//4 . Render initial pagination buttons
        PaginationView.render(model.state.search);

    } catch (err) {
        console.log(err);
    }
};

const controlPagination = function (goToPage) {
//1 . Render NEW results
    ResultsView.render(model.getSearchResultsPage(goToPage));
//2 . Render NEW pagination buttons
    PaginationView.render(model.state.search);
};

const controlServings = function (newServings) {
//1 . Update the recipe servings (in state)
    model.updateServings(newServings);
//2 . Update the recipe view
    RecipeView.update(model.state.recipe);
    //RecipeView.render(model.state.recipe);
};

const controlAddBookmark = function () {
//1 . Add/remove bookmark
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);
//2 . Update recipe view
    RecipeView.update(model.state.recipe);
//3 . Render bookmarks
    BookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
    BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
    try {
// Show loading spinner
        addRecipeView.renderSpinner();
// Upload the new recipe data
        await model.uploadRecipe(newRecipe);
        console.log(model.state.recipe);
// Render recipe
        RecipeView.render(model.state.recipe);
// Success message
        addRecipeView.renderMessage();
// Render bookmark view
        BookmarksView.render(model.state.bookmarks);
// Change ID in URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);
// Close form window
        setTimeout(function () {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);
    } catch (err) {
        console.error('<^>', err);
        addRecipeView.renderError(err.message);
    }
};

const init = function () {
    RecipeView.addHandlerRender(controlRecipes);
    RecipeView.addHandlerUpdateServings(controlServings);
    RecipeView.addHandlerAddBookmark(controlAddBookmark);
    SearchView.addHandlerSearch(controlSearchResults);
    PaginationView.addHandlerClick(controlPagination);
    BookmarksView.addHandlerRender(controlBookmarks);
    addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();