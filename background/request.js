console.log("request");
browser.tabs
  .query({ currentWindow: true, active: true })
  .then(tabs => {
    const { url, id } = tabs[0];
    console.log({ url });
    // Make a request to the backend to fetch the itinerary if it has
    // already been parsed previously

    // TODO
    browser.runtime.onMessage.addListener(message => {
      if (message.type === "request") {
        setTimeout(() => {
          browser.runtime.sendMessage({
            type: "SUCCESS",
            payload: {
              text: "Hello from the other side!",
              generate: true,
              book: false,
            }
          });
        }, 1000);
      }
    });
  })
  .catch(error => {
    console.log({ error });
  });
