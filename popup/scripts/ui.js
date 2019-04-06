// Define DOM elements
const $main = document.getElementById("main");
const $button = {
  primary: document.getElementById("primary"),
  secondary: document.getElementById("secondary")
};

// UI = f(state)
const ui = {
  loading: state => {
    $main.innerHTML = `Loading ...`;
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
    $button.primary.classList.remove("book");
    $button.primary.classList.add("generate");
    $button.primary.innerText = "Generate";

    // For testing purposes
    $main.innerHTML = state.text;
  },
  book: state => {
    $button.primary.classList.remove("hidden");
    $button.primary.classList.remove("generate");
    $button.primary.classList.add("book");
    $button.primary.innerText = "Book";

    $button.secondary.classList.remove("hidden");
    $button.secondary.classList.add("share");
    $button.secondary.innerText = "Share";

    // For testing purposes
    $main.innerHTML = state.text;
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
