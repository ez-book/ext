const content = (document.querySelector("main") || document.body).innerHTML;
const text =
  new DOMParser().parseFromString(content, "text/html").body.textContent || "";

const h1 = [...document.querySelectorAll("h1")].map(h1 => h1.textContent);
const h2 = [...document.querySelectorAll("h2")].map(h2 => h2.textContent);
const h3 = [...document.querySelectorAll("h3")].map(h3 => h3.textContent);

browser.runtime.onMessage.addListener(message => {
  console.log({ message });
  if ((message.type = "generate")) {
    const textPlaces = nlp(text)
      .places()
      .out("topk")
      .map(place => ({ ...place, weight: place.count * 1 }));
    const h1Places = nlp(h1)
      .places()
      .out("topk")
      .map(place => ({ ...place, weight: place.count * 21 }));
    const h2Places = nlp(h2)
      .places()
      .out("topk")
      .map(place => ({ ...place, weight: place.count * 13 }));
    const h3Places = nlp(h3)
      .places()
      .out("topk")
      .map(place => ({ ...place, weight: place.count * 8 }));

    const places = [...textPlaces, ...h1Places, ...h2Places, ...h3Places]
      .reduce((a, c) => {
        if (a.find(p => p.normal === c.normal)) {
          const i = a.findIndex(p => p.normal === c.normal);
          a[i].weight += c.weight;
        } else {
          a.push(c);
        }
        return a;
      }, [])
      .sort((a, b) => a.weight < b.weight ? 1 : a.weight > b.weight ? -1 : 0)
      .map(place => place.normal.replace(/(^|\s)\S/g, l => l.toUpperCase()));

    console.log({ places });

    // Send a request to save the itinerary
    browser.runtime.sendMessage({
      type: "POST",
      resource: "/itinerary",
      places: JSON.stringify(places.slice(0, 5))
    });
  }
});
