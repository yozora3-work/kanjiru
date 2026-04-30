import { useSelector } from "react-redux";
import store from "../../store";
import { answerCard } from "../../features/cards/cardSlice";
import checkAnswer from "../../services/checkAnswer";
import { useState } from "react";

function NewKanji({ word }) {
  const isAnswered = useSelector((state) => state.card.isAnswered);
  const [answer, setAnswer] = useState("");

  return (
    <div className="card">
      <h1>{word.cardType === "reading" && word.kanji}</h1>
      <h1>{word.cardType === "writing" && word.kanji_translation}</h1>
      <p>{word.cardType.charAt(0).toUpperCase() + word.cardType.slice(1)}</p>
      {isAnswered ? (
        <>
          {answer && word.cardType === "reading" && (
            <p
              className={
                checkAnswer(answer, word.kanji_translation) === "correct"
                  ? "answer-correct"
                  : "answer-wrong"
              }
            >
              {answer}
            </p>
          )}
          {answer && word.cardType === "writing" && (
            <p
              className={
                checkAnswer(answer, word.kanji) === "correct"
                  ? "answer-correct"
                  : "answer-wrong"
              }
            >
              {answer}
            </p>
          )}
          {word.cardType === "reading" && (
            <p>
              <strong>Meaning: </strong>
              {word.kanji_translation}
            </p>
          )}
          {word.cardType === "writing" && (
            <p>
              <strong>Kanji: </strong>
              {word.kanji}
            </p>
          )}
          <p>
            <strong>On'yomi: </strong>
            {word.kanji_readingOn} <strong>Kun'yomi: </strong>
            {word.kanji_readingKun}
          </p>

          <p>
            <strong>Radicals:</strong>
            {`${word.radicals} (${word.radicals_memo})`}
          </p>
          <small>
            <p>
              <strong>Meaning Mnemonic:</strong>
            </p>
            <p>{word.radicals_icon}</p>
            <p>{word.meaning_mnemonic}</p>
            <p>
              <i>{word.meaning_info}</i>
            </p>
            <p>
              <strong>Reading Mnemonic:</strong>
            </p>
            <p>{word.reading_mnemonic}</p>
            <p>
              <i>{word.reading_info}</i>
            </p>
          </small>
        </>
      ) : (
        <div>
          <h2>{word.type}</h2>
          <input
            placeholder="Answer"
            type="text"
            value={answer}
            onChange={(e) => {
              console.log(e.target.value);
              setAnswer(e.target.value);
            }}
          ></input>
          <button
            className="button-ui-action"
            onClick={() => store.dispatch(answerCard())}
          >
            Answer
          </button>
        </div>
      )}
    </div>
  );
}

export default NewKanji;
