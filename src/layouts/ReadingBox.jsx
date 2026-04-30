import { useSelector } from "react-redux";

function ReadingBox() {
  const formData = useSelector(
    (state) => state.card.formData.vocabData.reading,
  );

  return (
    <div>
      {formData.map((text, i) => (
        <div style={{ margin: "2rem 0" }} key={i}>
          <p>
            {text.vocab_context_jp_1} {text.vocab_context_en_1}
          </p>
          <p>
            {text.vocab_context_jp_2} {text.vocab_context_en_2}
          </p>
          <p>
            {text.vocab_context_jp_3} {text.vocab_context_en_3}
          </p>
        </div>
      ))}
      <button>Regenerate</button>
    </div>
  );
}

export default ReadingBox;
