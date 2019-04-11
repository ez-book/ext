// Define DOM elements
const $main = document.querySelector("main");
const $loading = document.querySelector(".loading");
const $text = document.querySelector(".text");
const $list = document.querySelector(".list");
const $button = {
  primary: document.querySelector("#primary"),
  secondary: document.querySelector("#secondary")
};

// UI = f(state)
const ui = {
  loading: _ => {
    $loading.classList.remove("hidden");
    $text.innerText = "";
    $list.innerHTML = "";
    $button.primary.classList.add("hidden");
    $button.secondary.classList.add("hidden");
  },
  error: ({ text }) => {
    $loading.classList.add("hidden");
    $text.innerText = text;
    $list.innerHTML = "";
    $button.primary.classList.add("hidden");
    $button.secondary.classList.add("hidden");
  },
  generate: ({ text }) => {
    $loading.classList.add("hidden");
    $text.innerText = text;
    $list.innerHTML = "";
    $button.primary.classList.remove("hidden");
    $button.primary.innerHTML = `
      <span class='generate'>
        Generate
      </span>
    `;
  },
  book: ({ text, data }) => {
    $loading.classList.add("hidden");
    $text.innerText = text;
    $list.innerHTML = data.places
      .map(place => `
        <li class="place">
          <span class="place-name">${place}<span>
        </li>
      `)
      .join("");
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

    // Make the list sortable
    const sortable = new Sortable.default($list, {
      draggable: ".place"
    });

    sortable.on("sortable:start", () => console.log("sortable:start"));
    sortable.on("sortable:sort", () => console.log("sortable:sort"));
    sortable.on("sortable:sorted", () => console.log("sortable:sorted"));
    sortable.on("sortable:stop", () => console.log("sortable:stop"));
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
