function checkAnswer(userAnswer, correctAnswer) {
  if (!userAnswer) return "blank";
  
  const answerArr = userAnswer.replaceAll(",", "").split(" ");
  const correctArr = correctAnswer.replaceAll(",", "").split(" ");
  if (answerArr.some((el) => correctArr.includes(el))) return "correct";
  return "wrong";
}

export default checkAnswer;
