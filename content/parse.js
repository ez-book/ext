const content = (document.querySelector("main") || document.body).innerHTML;
const text =
  new DOMParser().parseFromString(content, "text/html").body.textContent || "";
console.log('parse');
console.log({ text });

browser.runtime.onMessage.addListener(message => {
  console.log({ message });
  if ((message.type = "generate")) {
    const places = nlp(text)
      .places()
      .out("topk")
      .map(place => place.normal);
    console.log({ places });

    // Send a request to save the itinerary
    browser.runtime.sendMessage({
      type: "POST",
      resource: "/itinerary",
      places: JSON.stringify(places.slice(0, 5)),
    });
  }
});
