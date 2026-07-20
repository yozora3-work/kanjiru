const fetchAll = async (db, query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

function queryFormer(options, cardType, property) {
  const allowedProperties = ["id", "level"];
  if (!allowedProperties.includes(property)) {
    throw new Error(
      `Invalid property: ${property}. Allowed properties are: ${allowedProperties.join(", ")}`,
    );
  }

  // Handle id query
  if (property === "id") {
    return {
      query: `SELECT * FROM ${cardType} WHERE sort_id = ?`,
      params: [options.id],
    };
  }

  // Handle level query
  if (property === "level") {
    const levels = options.customStudyLevels;

    // Handle "all" levels
    if (levels === "all") {
      return {
        query: `SELECT * FROM ${cardType}`,
        params: [],
      };
    }

    // Single number
    if (!isNaN(levels)) {
      return {
        query: `SELECT * FROM ${cardType} WHERE level = ?`,
        params: [parseInt(levels)],
      };
    }

    // Handle comma-separated levels
    if (typeof levels === "string" && levels.includes(",")) {
      const numArr = levels
        .split(",")
        .map((el) => parseInt(el.trim()))
        .filter((el) => !isNaN(el));

      if (numArr.length > 0) {
        const placeholders = numArr.map(() => "?").join(", ");
        return {
          query: `SELECT * FROM ${cardType} WHERE level IN (${placeholders})`,
          params: numArr,
        };
      }
    }
  }
}

export async function getData(db, options) {
  const kanjiData = {};
  const vocabData = {};

  // Handle ID query
  if (options.id) {
    const kanjiQueryObj = queryFormer(options, "kanjiData", "id");
    const vocabQueryObj = queryFormer(options, "vocabData", "id");

    const kanjiQuery = await fetchAll(
      db,
      kanjiQueryObj.query,
      kanjiQueryObj.params,
    );
    const vocabQuery = await fetchAll(
      db,
      vocabQueryObj.query,
      vocabQueryObj.params,
    );

    if (kanjiQuery.length > 0) return kanjiQuery;
    if (vocabQuery.length > 0) return vocabQuery;

    throw new Error(
      "No cards with the specified ID were found. Please check the ID and try again.",
    );
  }

  // Handle level query for kanji
  if (options.customStudyKanji) {
    const kanjiQueryObj = queryFormer(options, "kanjiData", "level");
    const kanjiQuery = await fetchAll(
      db,
      kanjiQueryObj.query,
      kanjiQueryObj.params,
    );

    if (kanjiQuery.length > 0) {
      if (options.customStudyReading) {
        kanjiData.reading = kanjiQuery.map((card) => ({
          ...card,
          cardType: "reading",
        }));
      }
      if (options.customStudyWriting) {
        kanjiData.writing = kanjiQuery.map((card) => ({
          ...card,
          cardType: "writing",
        }));
      }
    }
  }

  // Handle level query for vocab
  if (options.customStudyVocab) {
    const vocabQueryObj = queryFormer(options, "vocabData", "level");
    const vocabQuery = await fetchAll(
      db,
      vocabQueryObj.query,
      vocabQueryObj.params,
    );

    if (vocabQuery.length > 0) {
      if (options.customStudyReading) {
        vocabData.reading = vocabQuery.map((card) => ({
          ...card,
          cardType: "reading",
        }));
      }
      if (options.customStudyWriting) {
        vocabData.writing = vocabQuery.map((card) => ({
          ...card,
          cardType: "writing",
        }));
      }
    }
  }

  const dataObj = { kanjiData, vocabData };

  // Check if any cards were found
  const hasKanji = Object.keys(kanjiData).length > 0;
  const hasVocab = Object.keys(vocabData).length > 0;

  if (!hasKanji && !hasVocab) {
    throw new Error("No cards matched your selection. Try different options.");
  }

  return dataObj;
}

export async function updateData(db, id, updates) {
  const keys = Object.keys(updates);
  const values = Object.values(updates);

  if (keys.length === 0) {
    throw new Error("No updates provided.");
  }

  //check if the card exists in either kanjiData or vocabData
  const kanjiRows = await new Promise((resolve, reject) => {
    db.all(`SELECT * FROM kanjiData WHERE sort_id = ?`, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  // Determine which table to update based on the existence of the card
  const cardType = kanjiRows.length === 1 ? "kanjiData" : "vocabData";

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const query = `UPDATE ${cardType} SET ${setClause} WHERE sort_id = ?`;

  // Execute the update query
  return new Promise((resolve, reject) => {
    db.run(query, [...values, id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

export async function deleteData(db, id) {
  //check if the card exists in either kanjiData or vocabData
  const kanjiRows = await new Promise((resolve, reject) => {
    db.all(`SELECT * FROM kanjiData WHERE sort_id = ?`, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  // Determine which table to update based on the existence of the card
  const cardType = kanjiRows.length === 1 ? "kanjiData" : "vocabData";

  const query = `DELETE FROM ${cardType} WHERE sort_id = ?`;

  // Execute the update query
  return new Promise((resolve, reject) => {
    db.run(query, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

export async function createData(db, cardData) {
  const keys = Object.keys(cardData);
  const values = Object.values(cardData);

  const placeholders = values.map(() => "?").join(", ");

  const cardType = keys.includes("kanji") ? "kanjiData" : "vocabData";
  const query = `INSERT INTO ${cardType} (${keys.join(", ")}) VALUES (${placeholders})`;

  return new Promise((resolve, reject) => {
    db.run(query, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}
