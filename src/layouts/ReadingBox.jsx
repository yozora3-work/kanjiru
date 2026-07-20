import { useState } from "react";
import { useSelector } from "react-redux";

function Kurigana({ text }) {
  const [showWord, setShowWord] = useState(false);
  return (
    <div className="word-container">
      {showWord && (
        <div className="highlighted-word">{text["vocab_reading"]}</div>
      )}
      <div onClick={() => setShowWord(!showWord)} className="regular-word">
        {text[`vocab`]}
      </div>
    </div>
  );
}

function ReadingBoxField({ text, number }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const regex = new RegExp(`(${text["vocab"]})`, "gi");
  const tesx = text[`vocab_context_jp_${number}`].split(regex);
  console.log(tesx);

  return (
    <div>
      {/* <span onClick={() => setShowTranslation(!showTranslation)}>
        {tesx.join(`${text["vocab"]}`)}
      </span> */}
      <p>
        {tesx.map((el, i) =>
          el === text["vocab"] ? (
            <Kurigana text={text} key={i} />
          ) : (
            // <span key={i}>1</span>
            <span onClick={() => setShowTranslation(!showTranslation)} key={i}>
              {el}
            </span>
          ),
        )}
        {showTranslation && (
          <span className="pop-fade-element">
            {text[`vocab_context_en_${number}`]}
          </span>
        )}
      </p>
    </div>
  );
}

function ReadingBox() {
  const formData = useSelector(
    (state) => state.card.formData.vocabData.reading,
  );

  return (
    <div>
      {formData.map((text, i) => (
        <div style={{ margin: "2rem 0" }} key={i}>
          <ReadingBoxField text={text} number={1} />
          <ReadingBoxField text={text} number={2} />
          <ReadingBoxField text={text} number={3} />
        </div>
      ))}
    </div>
  );
}

export default ReadingBox;
