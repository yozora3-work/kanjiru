import { setFormData } from "../features/cards/cardSlice";
import { getCards } from "../services/apiCards";
import Button from "../components/Button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import InputLevels from "../components/InputLevels";

async function formCardsData(formOptions) {
  const formData = await getCards(formOptions);
  return formData;
}

function ReadingForm() {
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    //Collecting form data
    const customStudyLevels = formData.get("custom-study-levels");

    //Processing form data, checking for bad input
    if (!customStudyLevels) {
      toast.error("Please select levels");
      return;
    }

    //Populating data
    await formCardsData({
      customStudyLevels,
      customStudyVocab: true,
      customStudyReading: true,
    })
      .then((data) => {
        dispatch(setFormData(data));
      })
      .catch((error) => {
        console.log(error);
        toast.error("No cards with selected options were found");
      });
  };

  return (
    <>
      <h1>Select kanji level</h1>
      <form id="reading-form" onSubmit={(e) => handleSubmit(e)}>
        <InputLevels id="custom-study-levels" />
        <div className="box-small">
          <Button type="submit" text="Learn" className="button-ui-action" />
        </div>
      </form>
    </>
  );
}

export default ReadingForm;
