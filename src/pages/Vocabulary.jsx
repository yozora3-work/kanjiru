import { useEffect, useState } from "react";
import Container from "../components/Container";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { getCards } from "../services/apiCards";
import "./Vocabulary.css";
import toast from "react-hot-toast";
import usePagination from "../hooks/usePagination";
import PageCounter from "../components/PageCounter";
import SearchBar from "../components/SearchBar";

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
          toast.error("Error while fetching data");
        });
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <SearchBar
          searchField={searchField}
          setSearchField={setSearchField}
          searchData={searchData}
        />
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Kanji</th>
              <th>On-Reading</th>
              <th>Kun-Reading</th>
              <th>Translation</th>
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
        <PageCounter
          currentPage={currentPage}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      </Container>
      <Footer />
    </>
  );
}

export default Vocabulary;
