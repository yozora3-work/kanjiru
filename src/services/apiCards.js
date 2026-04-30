//Get Data
export async function getCards(options) {
  const url = `http://127.0.0.1:5173/api/cards`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    });
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
  }
}
