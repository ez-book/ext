const content = (document.querySelector("main") || document.body).innerHTML;
const text =
  new DOMParser().parseFromString(content, "text/html").body.textContent || "";
console.log({ text });

browser.runtime.onMessage.addListener(message => {
  console.log({ message });
  if ((message.type = "generate")) {
    const places = nlp(text)
      .places()
      .data();
    // .out("topk");
    console.log({ places });

    // Send a request to save the itinerary
    // TODO

    // Send a message back to the popup with the itinerary link
    browser.runtime.sendMessage({
      type: "SUCCESS",
      payload: {
        generate: false,
        book: true,
        itineraryURL: "" // TODO
      }
    });
  }
});
