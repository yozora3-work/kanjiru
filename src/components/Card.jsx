import "./Card.css";
import NewKanji from "../ui/cards/NewKanji";
import VocabCard from "../ui/cards/VocabCard";
import { useSelector } from "react-redux";
import store from "../store";
import { nextCard } from "../features/cards/cardSlice";
import Button from "./Button";

function Card() {
  const formData = useSelector((state) => state.card.formData);
  const isFinished = useSelector((state) => state.card.isFinished);
  const isAnswered = useSelector((state) => state.card.isAnswered);
  const currentElement = useSelector((state) => state.card.currentElement);

  let currentKanji = 0;
  if (formData) currentKanji = formData[currentElement];

  function handleAnswer(difficulty) {
    store.dispatch(nextCard({ answerType: difficulty, currentKanji }));
  }

  return (
    <>
      {isFinished ? (
        <h1>Завершено!</h1>
      ) : (
        <div className="card-container">
          {currentKanji.kanji && <NewKanji word={currentKanji} />}
          {currentKanji.vocab && <VocabCard word={currentKanji} />}
          {isAnswered && (
            <div className="card-answer-container">
              <Button
                text="Снова"
                className="button-ui-danger"
                onClick={() => handleAnswer("again")}
              />
              <Button
                text="Легко"
                className="button-ui-action"
                onClick={() => handleAnswer("easy")}
              />
              {/* <button>Hard</button> */}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Card;
