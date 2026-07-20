import { useEffect, useState } from "react";
import Container from "../components/Container";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { getCards } from "../services/apiCards";
import "./Vocabulary.css";
import toast from "react-hot-toast";

function Vocabulary() {
  const [vocabData, setVocabData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await getCards({
        customStudyLevels: "all",
        customStudyKanji: true,
        customStudyReading: true,
      })
        .then((data) => {
          setVocabData(data.kanjiData.reading);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Ошибка при получении данных");
        });
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
              <th>Кандзи</th>
              <th>Онное чтение</th>
              <th>Кунное чтение</th>
              <th>Перевод</th>
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
