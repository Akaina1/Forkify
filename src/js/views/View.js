// imports
import icons from 'url:../../img/icons.svg'; // Parcel 2
export default class View {

    _data;

// JSdoc comment for documentation
/** 
 * Render the received object to the DOM
 * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
 * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
 * @returns {undefined | string} A markup string is returned if render=false
 * @this {Object} View instance
 */
    render(data, render = true) {

        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner = function () {
        const markup = `
        <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this._errorMessage) {
        const markup = `
              <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
            `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderMessage = function (message = this._message) {
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="src/${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    update = function (data) {
        this._data = data;
        const newMarkup = this._generateMarkup();
        // create virtual DOM
        const newDOM = document.createRange().createContextualFragment(newMarkup); // convert string to DOM object
        // convert virtual DOM to real DOM
        const newElements = Array.from(newDOM.querySelectorAll('*')); // convert DOM object to array
        // convert real DOM to virtual DOM
        const curElements = Array.from(this._parentElement.querySelectorAll('*')); 

        // update changed TEXT and ATTRIBUTES
        if (newElements.length !== curElements.length) return this.render(data, false);

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // update changed TEXT
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                curEl.textContent = newEl.textContent;
            }
            // update changed ATTRIBUTES
            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
            }
        });
    };
};