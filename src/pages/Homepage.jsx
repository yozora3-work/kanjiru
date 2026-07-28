import Container from "../components/Container";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";

function Homepage() {
  return (
    <>
      <Header />
      <Container>
        <h1>
          It's a great moment to start learning Japanese!
          <br />
          <br /> Don't you think so?
        </h1>
      </Container>
      <Footer />
    </>
  );
}

export default Homepage;
