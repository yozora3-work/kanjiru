import { useQuery } from "@tanstack/react-query";
import { getCards } from "../services/apiCards";

export function useKanji(filter) {
  const { isLoading, data: kanji } = useQuery({
    queryKey: ["kanji"],
    queryFn: getCards(filter),
  });
  return { isLoading, kanji };
}
