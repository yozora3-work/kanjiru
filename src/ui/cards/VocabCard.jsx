import { useSelector } from "react-redux";
import store from "../../store";
import { answerCard } from "../../features/cards/cardSlice";

function VocabCard({ word }) {
  const isAnswered = useSelector((state) => state.card.isAnswered);

  return (
    <div className="card">
      <h1>{word.cardType === "reading" && word.vocab}</h1>
      <h1>{word.cardType === "writing" && word.vocab_meaning}</h1>
      <p>{word.cardType.charAt(0).toUpperCase() + word.cardType.slice(1)}</p>
      {isAnswered ? (
        <>
          {word.cardType === "reading" && <h2>{word.vocab_meaning}</h2>}
          {word.cardType === "writing" && <h2>{word.vocab}</h2>}
          <p>
            <strong>Type: </strong>
            {word.vocab_type}{" "}
          </p>
          <p>
            <strong>Kanji: </strong>
            {`${word.vocab_kanji} (${word.vocab_kanji_name})`}
          </p>

          <small>
            <p>
              <strong>Meaning Explanation</strong>
            </p>
            <p>{word.vocab_meaning_exp}</p>
            <p>
              <strong>Reading Mnemonic:</strong>
            </p>
            <p>{word.vocab_reading_exp}</p>
            <p>{`${word.vocab_context_jp_1} (${word.vocab_context_en_1})`}</p>
            <p>{`${word.vocab_context_jp_2} (${word.vocab_context_en_2})`}</p>
            <p>{`${word.vocab_context_jp_3} (${word.vocab_context_en_3})`}</p>
          </small>
        </>
      ) : (
        <div>
          <h2>{word.type}</h2>
          <input placeholder="Answer" type="text"></input>
          <button
            className="button-ui-action"
            onClick={() => store.dispatch(answerCard(true))}
          >
            Answer
          </button>
        </div>
      )}
    </div>
  );
}

export default VocabCard;
