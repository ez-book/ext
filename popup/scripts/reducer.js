// Typical Redux-like reducer here ...
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
