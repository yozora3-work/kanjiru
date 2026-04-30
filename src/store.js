import { configureStore } from "@reduxjs/toolkit";

import cardReducer from "./features/cards/cardSlice";

const store = configureStore({
  reducer: {
    card: cardReducer,
  },
});

export default store;
