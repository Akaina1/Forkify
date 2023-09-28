import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    _generateMarkup() {
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const curPage = this._data.page;

        // Page 1, and there are other pages
        if (curPage === 1 && numPages > 1) {
            return this._generateMarkupButton(curPage, 'next');
        }

        // Last page
        if (curPage === numPages && numPages > 1) {
            return this._generateMarkupButton(curPage, 'prev');
        }

        // Other page
        if (curPage < numPages) {
            return `
                ${this._generateMarkupButton(curPage, 'prev')}
                ${this._generateMarkupButton(curPage, 'next')}
            `;
        }

        // Page 1, and there are NO other pages
        return '';
    };

    _generateMarkupButton(curPage, type) {
        return `
                <button data-goto="${type === 'prev' ? curPage - 1 : curPage + 1}" class="btn--inline pagination__btn--${type}">
                    <span>Page ${type === 'prev' ? curPage - 1 : curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>
            `;
    };

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;

            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    };
};

export default new PaginationView();