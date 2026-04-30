import Container from "../components/Container";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";

function Homepage() {
  return (
    <>
      <Header />
      <Container>
        <h1>
          It's a perfect time to start learning,
          <br /> don't you think? 🎓
        </h1>
      </Container>
      <Footer />
    </>
  );
}

export default Homepage;
