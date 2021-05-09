export const elements = {
    searchResForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
    searchResPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}


export const elementstrings = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
    <div class = "${elementstrings.loader}">
        <svg>
            <use href = "img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementstrings.loader}`);

    if (loader) loader.parentElement.removeChild(loader);
}













