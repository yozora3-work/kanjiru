import Container from "../components/Container";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";

function Homepage() {
  return (
    <>
      <Header />
      <Container>
        <h1>
          Прекрасное время, чтобы начать изучать кандзи и японский язык!
          <br />
          <br /> Ты так не думаешь?
        </h1>
      </Container>
      <Footer />
    </>
  );
}

export default Homepage;
