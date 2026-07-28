import { useSelector } from "react-redux";
import store from "../../store";
import { answerCard } from "../../features/cards/cardSlice";
import checkAnswer from "../../services/checkAnswer";

function NewKanji({ word }) {
  const isAnswered = useSelector((state) => state.card.isAnswered);
  const answer = useSelector((state) => state.card.userAnswer);

  return (
    <div className="card">
      {word.cardType === "reading" && (
        <>
          <h1>{word.kanji}</h1>
          <p>{"Meaning"}</p>
        </>
      )}
      {word.cardType === "writing" && (
        <>
          <h1>{word.kanji_translation}</h1>
          <p>{"Writing"}</p>
        </>
      )}

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
            <strong>On-reading: </strong>
            {word.kanji_readingOn} <strong>Kun-reading: </strong>
            {word.kanji_readingKun}
          </p>

          <p>
            <strong>Radicals:</strong>
            {`${word.radicals} (${word.radicals_memo})`}
          </p>
          <small>
            <p>
              <strong>Meaning mnemonic:</strong>
            </p>
            <p>{word.radicals_icon}</p>
            <p>{word.meaning_mnemonic}</p>
            <p>
              <i>{word.meaning_info}</i>
            </p>
            <p>
              <strong>Reading mnemonic:</strong>
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
              // setAnswer(e.target.value);
              store.dispatch({
                type: "card/setAnswer",
                payload: e.target.value,
              });
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
