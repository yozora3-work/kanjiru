import { setFormData } from "../features/cards/cardSlice";
import { getCards } from "../services/apiCards";
import store from "../store";
import Button from "../components/Button";
import toast from "react-hot-toast";

async function formCardsData(formOptions) {
  const data = await getCards(formOptions);
  return data;
}

function ReadingForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Collecting form data
    const customStudyLevels = e.target["custom-study-levels"].value;

    //Processing form data, checking for bad input
    if (!customStudyLevels) {
      toast.error("Please select levels");
      return;
    }

    const formData = {
      customStudyLevels,
      customStudyVocab: true,
      customStudyReading: true,
    };

    //Populating data
    const cardsFormData = await formCardsData(formData);

    store.dispatch(setFormData(cardsFormData));
  };

  return (
    <>
      <h1>Select the kanji levels</h1>
      <form id="reading-form" onSubmit={(e) => handleSubmit(e)}>
        <input id="custom-study-levels" />
        <div className="box-small">
          <Button type="submit" text="Learn" className="button-ui-action" />
        </div>
      </form>
    </>
  );
}

export default ReadingForm;
