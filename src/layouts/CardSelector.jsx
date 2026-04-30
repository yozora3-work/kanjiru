import CheckboxItem from "../components/CheckboxItem";
import { getCards } from "../services/apiCards";
import { setFormData } from "../features/cards/cardSlice";
import store from "../store";
import Button from "../components/Button";
import "./CardSelector.css";
import toast from "react-hot-toast";

async function formCardsData(formOptions) {
  const dataObject = await getCards(formOptions);
  console.log(dataObject);

  //Create card array for reviewing
  const kanjiData = Object.values(dataObject.kanjiData).flat();
  const vocabData = Object.values(dataObject.vocabData).flat();

  const formData = kanjiData.concat(vocabData);
  //TODO Shuffle data
  return formData;
}

function CardSelector() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Collecting form data
    const customStudyLevels = e.target["custom-study-levels"].value;
    const customStudyKanji = e.target["custom-study-kanji"].checked;
    const customStudyVocab = e.target["custom-study-vocab"].checked;
    const customStudyReading = e.target["custom-study-reading"].checked;
    const customStudyWriting = e.target["custom-study-writing"].checked;

    //Processing form data, checking for bad input
    if (!customStudyKanji && !customStudyVocab) {
      toast.error("Please select Kanji or Vocabulary Card type");
      return;
    }
    if (!customStudyReading && !customStudyWriting) {
      toast.error("Please select Reading or Writing Card type");
      return;
    }
    if (!customStudyLevels) {
      toast.error("Please select Levels");
      return;
    }

    const formData = {
      customStudyLevels,
      customStudyKanji,
      customStudyVocab,
      customStudyReading,
      customStudyWriting,
    };

    //Populating data
    const cardsFormData = await formCardsData(formData);

    store.dispatch(setFormData(cardsFormData));
  };

  return (
    <>
      <h1>Which types of cards would you like to learn?</h1>
      <form onSubmit={(e) => handleSubmit(e)} className="custom-study-box">
        <div className="box-medium border-bottom">
          <p>Study new words, or repeat already learnt.</p>
          <div className="box-small">
            <CheckboxItem id="custom-study-kanji" text="Kanji Cards" />
            <CheckboxItem id="custom-study-vocab" text="Vocabulary Cards" />
          </div>
        </div>
        <div className="box-medium border-bottom">
          <p>Study Kanji Reading or Writing (reverse card)</p>
          <div className="box-small">
            <CheckboxItem id="custom-study-reading" text="Reading" />
            <CheckboxItem id="custom-study-writing" text="Writing" />
          </div>
        </div>
        <div className="box-medium border-bottom">
          <p>Select Levels</p>
          {/* //TODO Show current progress level 
            <p>
              Your current level is: <strong>10</strong>!
            </p>*/}
          <div className="box-small">
            <input
              min={1}
              max={60}
              placeholder="1,2,3...60"
              name="custom-study-levels"
            />
          </div>
        </div>
        <div className="box-small">
          <Button text="Start" type="submit" className="button-ui-action" />
        </div>
      </form>
    </>
  );
}

export default CardSelector;
