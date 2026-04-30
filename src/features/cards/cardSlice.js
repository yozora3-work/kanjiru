import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
  isFormed: false,
  isAnswered: false,
  isFinished: false,
  userAnswer: "",
  currentPage: 0,
  currentElement: 0,
  formData: {},
  hardFormData: [],
  cardTypes: {},
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setAnswer(state, action) {
      state.userAnswer = action.payload;
    },
    answerCard(state) {
      state.isAnswered = true;
    },
    setFormData(state, action) {
      state.formData = action.payload;
      state.isFormed = true;
      state.isFinished = false;
    },
    nextCard(state, action) {
      state.isAnswered = false;
      state.userAnswer = "";

      if (action.payload.answerType === "again") {
        state.hardFormData = [
          ...state.hardFormData,
          action.payload.currentKanji,
        ];
      }

      if (state.currentElement + 1 < state.formData.length) {
        state.currentElement += 1;
      } else {
        if (state.hardFormData.length > 0) {
          state.currentElement = 0;
          state.formData = state.hardFormData;
          state.hardFormData = [];
          return;
        }
        if (action.payload.answerType !== "again") {
          state.isFinished = true;
          state.isFinished = false;
        }
      }
    },
    nextPage(state, action) {
      if (state.currentPage < action.payload.maxPage) {
        state.currentPage++;
      }
    },
    previousPage(state) {
      if (state.currentPage > 0) {
        state.currentPage--;
      }
    },
  },
});

export const { setAnswer, answerCard, setFormData, nextCard } =
  cardSlice.actions;

export default cardSlice.reducer;
