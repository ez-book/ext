// Barebones Redux architecture implementation
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
  type: "GET",
  resource: "/itinerary"
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
    const state = store.getState();
    window.open(
      `http://localhost:1234/?places=${state.data.places.join(",")}`,
      "_blank"
    );
  }

  // Share an itinerary
  if (e.target && e.target.classList.contains("share")) {
    console.log("share");
    const state = store.getState();
    copyTextToClipboard(
      `http://localhost:1234/?places=${state.data.places.join(",")}`
    );
  }
});

// from https://stackoverflow.com/a/30810322
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a
  // flash, so some of these are just precautions. However in
  // Internet Explorer the element is visible whilst the popup
  // box asking the user for permission for the web page to
  // copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = "2em";
  textArea.style.height = "2em";

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = "transparent";

  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Copying text command was " + msg);
  } catch (err) {
    console.log("Oops, unable to copy");
  }

  document.body.removeChild(textArea);
}
