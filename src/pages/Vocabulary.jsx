import { useEffect, useState } from "react";
import Container from "../components/Container";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { getCards } from "../services/apiCards";
import "./Vocabulary.css";

function Vocabulary() {
  const [vocabData, setVocabData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCards({
        customStudyLevels: 0,
        customStudyKanji: true,
        customStudyReading: true,
      });
      setVocabData(data.kanjiData.reading);
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Kanji</th>
              <th>On Reading</th>
              <th>Kun Reading</th>
              <th>Translation</th>
            </tr>
          </thead>
          <tbody>
            {vocabData &&
              vocabData.map((card, i) => (
                <tr key={i}>
                  <th>{card.level}</th>
                  <th>{card.kanji}</th>
                  <th>{card.kanji_readingOn}</th>
                  <th>{card.kanji_readingKun}</th>
                  <th>{card.kanji_translation}</th>
                </tr>
              ))}
          </tbody>
        </table>
      </Container>
      <Footer />
    </>
  );
}

export default Vocabulary;
