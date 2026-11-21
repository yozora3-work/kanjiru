import "./PageCounter.css";
import Button from "./Button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

function PageCounter({ nextPage, prevPage, currentPage, totalPages }) {
  return (
    <div className="pagination">
      <Button
        icon={<ArrowLeftIcon />}
        type="button"
        className="button-ui-action"
        disabled={currentPage === 1}
        onClick={() => prevPage()}
      />
      <div>
        {currentPage} of {totalPages}
      </div>
      <Button
        icon={<ArrowRightIcon />}
        type="button"
        className="button-ui-action"
        disabled={currentPage === totalPages}
        onClick={() => {
          nextPage();
        }}
      />
    </div>
  );
}
export default PageCounter;
