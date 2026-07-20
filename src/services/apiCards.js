//Get Data
export async function getCards(options) {
  const url = `${import.meta.env.VITE_API_URL}/api/cards`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });

  if (!res.ok) throw new Error(`Error while fetching data: ${res.status}`);

  const data = await res.json();
  return data.data;
}

export async function createCard(options) {
  const url = `${import.meta.env.VITE_API_URL}/api/cards`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });

  if (!res.ok) throw new Error(`Error while fetching data: ${res.status}`);

  const data = await res.json();
  return data.data;
}

export async function updateCard(id, options) {
  const url = `${import.meta.env.VITE_API_URL}/api/cards/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });

  if (!res.ok) throw new Error(`Error while fetching data: ${res.status}`);

  const data = await res.json();
  return data.data;
}

export async function removeCard(id) {
  const url = `${import.meta.env.VITE_API_URL}/api/cards/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`Error while fetching data: ${res.status}`);

  const data = await res.json();
  return data.data;
}
