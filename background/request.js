console.log("request");

const host = "http://127.0.0.1:5000";

function getEndpointFromResource(resource, params) {
  const queryString = params
    ? `?${params.map(p => `${p.key}=${p.value}`)}`
    : "";

  let endpoint = "";
  switch (resource) {
    case "/itinerary":
      endpoint = "/itenary";
      break;
    default:
      endpoint = "/";
      break;
  }

  return host + endpoint + queryString;
}

browser.tabs
  .query({ currentWindow: true, active: true })
  .then(tabs => {
    const { url } = tabs[0];

    // Make a request to the backend to fetch the itinerary if it has
    // already been parsed previously
    browser.runtime.onMessage.addListener(message => {
      if (message.type === "GET") {
        fetch(
          getEndpointFromResource(message.resource, [
            { key: "url", value: encodeURIComponent(url) }
          ]),
          { method: "GET" }
        )
          .then(res => res.json())
          .then(data => {
            if (!data.id) {
              throw new Error("404 - Not Found");
            }
            browser.runtime.sendMessage({
              type: "SUCCESS",
              payload: {
                text: "All good! Please book!", // TODO
                data,
                generate: false,
                book: true
              }
            });
          })
          .catch(error => {
            browser.runtime.sendMessage({
              type: "SUCCESS",
              payload: {
                text:
                  "Generate an itinerary that follows the blog you are reading!",
                generate: true,
                book: false
              }
            });
          });
      } else if (message.type === "POST") {
        fetch(getEndpointFromResource(message.resource), {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ url, places: JSON.parse(message.places) })
        })
          .then(res => res.json())
          .then(data => {
            browser.runtime.sendMessage({
              type: "SUCCESS",
              payload: {
                text: `Hello from the other side!`,
                data,
                generate: false,
                book: true
              }
            });
          })
          .catch(error => {
            console.log({ error });
            browser.runtime.sendMessage({
              type: "SUCCESS",
              payload: {
                text:
                  "Oops ... an error occured, please try again!",
                generate: true,
                book: false
              }
            });
          });
      }
    });
  })
  .catch(error => {
    console.log({ error });
  });
