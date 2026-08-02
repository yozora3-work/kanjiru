import { useEffect, useState } from "react";
import Container from "../components/Container";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { getCards } from "../services/apiCards";
import "./Vocabulary.css";
import toast from "react-hot-toast";
import usePagination from "../hooks/usePagination";

function Vocabulary() {
  const [vocabData, setVocabData] = useState([]);
  const [searchField, setSearchField] = useState("");

  async function searchData() {
    await getCards({
      customStudyLevels: "all",
      customStudyKanji: true,
      customStudyReading: true,
      kanji: searchField,
    }).then((data) => {
      if (!searchField) {
        setVocabData(data.kanjiData.reading);
      } else setVocabData(data);
      goToPage(1);
    });
  }

  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(vocabData, 50);

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
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            placeholder="Search"
          />
          <button className="search-btn" onClick={() => searchData()}>
            Search
          </button>
        </div>
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
            {paginatedData &&
              paginatedData.map((card, i) => (
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
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => prevPage()}
        >
          Previous
        </button>
        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => {
            nextPage();
          }}
        >
          Next
        </button>
      </Container>
      <Footer />
    </>
  );
}

export default Vocabulary;
