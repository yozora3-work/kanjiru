function queryFormer(options, cardType) {
  const levels = options.customStudyLevels;
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
    if (numArr.length > 0) levelString += "OR ";
    levelString += `level BETWEEN ${rangeArr[0]} AND ${rangeArr[1]}`;
  }
  return levelString;
}

export default queryFormer;
