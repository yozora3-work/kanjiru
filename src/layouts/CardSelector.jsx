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
      toast.error(
        "Пожалуйста, выберите тип карточек: Кандзи или Составные слова",
      );
      return;
    }
    if (!customStudyReading && !customStudyWriting) {
      toast.error("Пожалуйста, выберите тип карточек: Чтение или Написание");
      return;
    }
    if (!customStudyLevels) {
      toast.error("Пожалуйста, выберите уровни");
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
        toast.error("Карточки с выбранными параметрами не найдены");
      });
  };

  return (
    <>
      <h1>Какие карточки вы хотите изучить?</h1>
      <form onSubmit={(e) => handleSubmit(e)} className="custom-study-box">
        <div className="box-medium border-bottom">
          <p>Изучение новых слов, или повторение уже изученных.</p>
          <div className="box-small">
            <CheckboxItem
              id="custom-study-kanji"
              name="custom-study-kanji"
              text="Кандзи"
            />
            <CheckboxItem
              id="custom-study-vocab"
              name="custom-study-vocab"
              text="Составные слова"
            />
          </div>
        </div>
        <div className="box-medium border-bottom">
          <p>Изучение чтения или письма (перевернутая карточка)</p>
          <div className="box-small">
            <CheckboxItem
              id="custom-study-reading"
              name="custom-study-reading"
              text="Чтение"
            />
            <CheckboxItem
              id="custom-study-writing"
              name="custom-study-writing"
              text="Написание"
            />
          </div>
        </div>
        <div className="box-medium border-bottom">
          <p>Выберите уровни</p>
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
          <Button text="Начать" type="submit" className="button-ui-action" />
        </div>
      </form>
    </>
  );
}

export default CardSelector;
