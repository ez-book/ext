const updatePopup = state => {
  const $main = document.getElementById("main");
  const $button = {
    primary: document.getElementById("primary"),
    secondary: document.getElementById("secondary")
  };

  if (state.loading) {
    $main.innerHTML = `Loading ...`;
    $button.primary.classList.add("hidden");
    $button.secondary.classList.add("hidden");

    return;
  }
  if (state.error) {
    $main.innerHTML = `Error!`;
    $button.primary.classList.add("hidden");
    $button.secondary.classList.add("hidden");

    return;
  }
  // For testing purposes
  $main.innerHTML = state.text;

  if (state.generate) {
    $button.primary.classList.remove("hidden");
    $button.primary.classList.remove("book");
    $button.primary.classList.add("generate");
    $button.primary.innerText = "Generate";

    return;
  }

  if (state.book) {
    $button.primary.classList.remove("hidden");
    $button.primary.classList.remove("generate");
    $button.primary.classList.add("book");
    $button.primary.innerText = "Book";

    $button.secondary.classList.remove("hidden");
    $button.secondary.classList.add("share");
    $button.secondary.innerText = "Share";

    return;
  }
};

class EventEmitter {
  constructor() {
    this.events = Object.create(null);
  }
  on(eventName, callback) {
    if (!this.events[eventName]) this.events[eventName] = [];
    const idx = this.events[eventName].push(callback);
    return {
      off: () => {
        this.events[eventName][idx] = () => {};
      }
    };
  }
  trigger(eventName, ...parameters) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(...parameters));
    }
  }
}

const eventEmitter = new EventEmitter();
eventEmitter.on("update", updatePopup);

const createStore = (initialState = {}, reducer) => {
  let state = initialState;
  return {
    dispatch: action => {
      state = reducer(action, state);
      eventEmitter.trigger("update", state);
    },
    getState: _ => state
  };
};

const reducer = (action, state) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        ...action.payload,
        loading: true,
        error: false,
        generate: false,
        book: false
      };
    case "SUCCESS":
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: false
      };
    case "ERROR":
      return {
        ...state,
        loading: false,
        error: true,
        generate: false,
        book: false
      };
    default:
      return state;
  }
};

const store = createStore(
  { loading: false, error: false, generate: false, book: false },
  reducer
);
store.dispatch({ type: "LOADING" });
browser.runtime.sendMessage({
  type: "request",
  method: "GET",
  ressource: "/itinerary/url"
});

browser.runtime.onMessage.addListener(message => {
  store.dispatch({ ...message });
});

document.addEventListener("click", e => {
  // Generate an itinerary
  if (e.target && e.target.classList.contains("generate")) {
    console.log("generate");
    browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
      browser.tabs.sendMessage(tabs[0].id, {
        type: "generate"
      });
      store.dispatch({ type: "LOADING" });
    });
  }

  // Book an itinerary
  if (e.target && e.target.classList.contains("book")) {
    console.log("book");
  }

  // Share an itinerary
  if (e.target && e.target.classList.contains("share")) {
    console.log("share");
  }
});
