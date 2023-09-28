import View from './View.js';
class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded :)';

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');


    constructor() {
        super(); // calling the parent class constructor is required in every child class in order to get access to the 'this' keyword
        this._addHandlerHideWindow();
        this._addHandlerShowWindow();
    };

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    };

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    };

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    };

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {       // inside a handler function, 'this' keyword points to the DOM element that the handler is attached to
            e.preventDefault();
            const dataArr = [...new FormData(this)];                        // FormData is a built-in JS class that allows us to read data from a form
            const data = Object.fromEntries(dataArr);                       // Object.fromEntries() is a built-in JS method that converts an array of key-value pairs into an object
            handler(data);
        });
    };

    _generateMarkup() {
        return '';
    };
};

export default new AddRecipeView();