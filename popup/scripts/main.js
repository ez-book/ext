// Barebones redux architecture implementation
const createStore = (initialState = {}, reducer) => {
  let state = initialState;
  return {
    dispatch: action => {
      state = reducer(action, state);
      updateUI(state); // Let's just make our lives simple here!
    },
    getState: _ => state
  };
};

// Initialising the store
const store = createStore(
  { loading: false, error: false, generate: false, book: false },
  reducer
);

// Initial state when opening the popup
store.dispatch({ type: "LOADING" });
browser.runtime.sendMessage({
  type: "request",
  method: "GET",
  ressource: "/itinerary/url"
});

// Attaching event listener for messages between 
// popup, content and background scripts
browser.runtime.onMessage.addListener(message => {
  store.dispatch({ ...message });
});

// Event delegation for DOM events in the popup
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
