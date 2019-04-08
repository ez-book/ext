// Define DOM elements
const $main = document.getElementById("main");
const $button = {
  primary: document.getElementById("primary"),
  secondary: document.getElementById("secondary")
};

// UI = f(state)
const ui = {
  loading: state => {
    $main.innerHTML = `
      <div class='loading'>
        <div id="loading-pin"></div>
        <div id="loading-shadow"></div>
      </div>
    `;
    $button.primary.classList.add("hidden");
    $button.secondary.classList.add("hidden");
  },
  error: state => {
    $main.innerHTML = `Error!`;
    $button.primary.classList.add("hidden");
    $button.secondary.classList.add("hidden");
  },
  generate: state => {
    $button.primary.classList.remove("hidden");
    $button.primary.innerHTML = `
      <span class='generate'>
        Generate
      </span>
    `;

    // For testing purposes
    $main.innerHTML = `<p>${state.text}</p>`;
  },
  book: state => {
    $button.primary.classList.remove("hidden");
    $button.primary.innerHTML = `
      <span class='book'>
        Search
      </span>
    `;

    $button.secondary.classList.remove("hidden");
    $button.secondary.innerHTML = `
      <span class='share'>
        Share
      </span>
    `;

    // For testing purposes
    $main.innerHTML = `<p>${state.text}</p>`;
  }
};

const updateUI = state => {
  if (state.loading) {
    ui.loading(state);
  } else if (state.error) {
    ui.error(state);
  } else if (state.generate) {
    ui.generate(state);
  } else if (state.book) {
    ui.book(state);
  }
};
