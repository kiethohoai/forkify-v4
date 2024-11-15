import View from './mainView.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Handler click on button pagination
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      // get value from the dom attributes
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    const curPage = this._data.page;

    // page 1 & other pages
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="src/img/icons.svg#icon-arrow-right"></use>
          </svg>
        </button> 
      `;
    }

    // last page
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="src/img/icons.svg#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;
    }

    // other pages
    if (curPage > 1 && curPage < numPages) {
      return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="src/img/icons.svg#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="src/img/icons.svg#icon-arrow-right"></use>
          </svg>
        </button> 
      `;
    }

    // page 1, no other page
    return ``;
  }
}

export default new PaginationView();
