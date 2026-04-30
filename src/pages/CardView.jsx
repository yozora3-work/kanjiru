import CardSelector from "../layouts/CardSelector";
import Header from "../layouts/Header";

import { useSelector } from "react-redux";
import Footer from "../layouts/Footer";
import Container from "../components/Container";
import Card from "../components/Card";

function CardView({ actionType }) {
  const isFormed = useSelector((state) => state.card.isFormed);

  return (
    <>
      <Header />
      <Container>
        {!isFormed ? <CardSelector actionType={actionType} /> : <Card />}
      </Container>
      <Footer />
    </>
  );
}

export default CardView;
