const fetchAll = async (db, query) => {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

function queryFormer(options, cardType) {
  const levels = options.customStudyLevels;
  if (levels === 0) return `SELECT * FROM ${cardType}`;
  let levelString = `SELECT * FROM ${cardType} WHERE level`;
  //Level query
  if (!isNaN(levels)) return `${levelString} == ${levels}`;

  //Handle multi input
  const numArr = [];
  const rangeArr = [];
  if (levels.includes(";") || levels.includes("-")) {
    levels.split(";").forEach((el) => {
      if (!isNaN(el)) {
        numArr.push(el);
      }
      if (el.includes("-")) {
        const elements = el.split("-");
        rangeArr.push(elements[0], elements[1]);
      }
    });
  }
  //Construct final levelString
  if (numArr.length > 0) {
    numArr.forEach((el, i) => {
      levelString += `${i > 0 ? "OR level " : " "}IS ${el} `;
    });
  }
  if (rangeArr.length > 0) {
    levelString += `BETWEEN ${rangeArr[0]} AND ${rangeArr[1]}`;
  }
  return levelString;
}

export async function getReadingData(db, options) {
  const readingData = await fetchAll(db, queryFormer(options, "vocabData"));
  return readingData;
}

export async function getAll(db) {
  const data = await fetchAll(db, "SELECT * FROM vocab");
  return data;
}

export async function getData(db, options) {
  const kanjiData = {};
  const vocabData = {};

  // "SELECT * FROM kanjiData WHERE level == 1"
  if (options.customStudyKanji) {
    if (options.customStudyReading) {
      const data = await fetchAll(db, queryFormer(options, "kanjiData"));
      kanjiData.reading = data.map((card) =>
        Object.assign(card, { cardType: "reading" }),
      );
    }
    if (options.customStudyWriting) {
      const data = await fetchAll(db, queryFormer(options, "kanjiData"));
      kanjiData.writing = data.map((card) =>
        Object.assign(card, { cardType: "writing" }),
      );
    }
  }
  if (options.customStudyVocab) {
    if (options.customStudyReading) {
      const data = await fetchAll(db, queryFormer(options, "vocabData"));
      vocabData.reading = data.map((card) =>
        Object.assign(card, { cardType: "reading" }),
      );
    }
    if (options.customStudyWriting) {
      const data = await fetchAll(db, queryFormer(options, "vocabData"));
      vocabData.writing = data.map((card) =>
        Object.assign(card, { cardType: "writing" }),
      );
    }
  }
  const dataObj = { kanjiData, vocabData };
  return dataObj;
}
