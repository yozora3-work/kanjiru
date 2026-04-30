import { useSelector } from "react-redux";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import ReadingBox from "../layouts/ReadingBox";
import ReadingForm from "../layouts/ReadingForm";
import Container from "../components/Container";

function ReadingPage() {
  const isFormed = useSelector((state) => state.card.isFormed);

  return (
    <>
      <Header />
      <Container>{isFormed ? <ReadingBox /> : <ReadingForm />}</Container>
      <Footer />
    </>
  );
}

export default ReadingPage;
