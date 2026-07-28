import CheckboxItem from "../components/CheckboxItem";
import { getCards } from "../services/apiCards";
import { setFormData } from "../features/cards/cardSlice";
import store from "../store";
import Button from "../components/Button";
import "./CardSelector.css";
import toast from "react-hot-toast";
import InputLevels from "../components/InputLevels";

async function formCardsData(formOptions) {
  const dataObject = await getCards(formOptions);

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

    const formData = new FormData(e.target);

    //Collecting form data
    const customStudyLevels = formData.get("custom-study-levels");
    const customStudyKanji = formData.get("custom-study-kanji") === "on";
    const customStudyVocab = formData.get("custom-study-vocab") === "on";
    const customStudyReading = formData.get("custom-study-reading") === "on";
    const customStudyWriting = formData.get("custom-study-writing") === "on";
    console.log(
      customStudyLevels,
      customStudyKanji,
      customStudyVocab,
      customStudyReading,
      customStudyWriting,
    );

    //Processing form data, checking for bad input
    if (!customStudyKanji && !customStudyVocab) {
      toast.error("Please select the card type: Kanji or Vocabulary");
      return;
    }
    if (!customStudyReading && !customStudyWriting) {
      toast.error("Please select the card type: Meaning or Writing");
      return;
    }
    if (!customStudyLevels) {
      toast.error("Please select levels");
      return;
    }

    //Populating data
    await formCardsData({
      customStudyLevels,
      customStudyKanji,
      customStudyVocab,
      customStudyReading,
      customStudyWriting,
    })
      .then((data) => {
        store.dispatch(setFormData(data));
      })
      .catch((error) => {
        console.log(error);
        toast.error("No cards were found with selected options");
      });
  };

  return (
    <>
      <h1>What type of cards do you want to learn?</h1>
      <form onSubmit={(e) => handleSubmit(e)} className="custom-study-box">
        <div className="box-medium border-bottom">
          <p>Learning Kanji or Vocabulary</p>
          <div className="box-small">
            <CheckboxItem
              id="custom-study-kanji"
              name="custom-study-kanji"
              text="Kanji"
            />
            <CheckboxItem
              id="custom-study-vocab"
              name="custom-study-vocab"
              text="Vocabulary"
            />
          </div>
        </div>
        <div className="box-medium border-bottom">
          <p>Leaning Meaning or Writing (reverse card)</p>
          <div className="box-small">
            <CheckboxItem
              id="custom-study-reading"
              name="custom-study-reading"
              text="Meaning"
            />
            <CheckboxItem
              id="custom-study-writing"
              name="custom-study-writing"
              text="Writing"
            />
          </div>
        </div>
        <div className="box-medium border-bottom">
          <p>Select Levels</p>
          {/* //TODO Show current progress level 
            <p>
              Your current level is: <strong>10</strong>!
            </p>*/}
          <div className="box-small">
            {/* //TODO Handle multi input, show error for bad input */}
            <InputLevels id="custom-study-levels" />
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
