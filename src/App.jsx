import { useState, useEffect } from "react";
import { gifts } from "./data/coins";
import GiftCard from "./components";

const App = () => {
  const [activeId, setActiveId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [maxCoin, setMaxCoin] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setActiveId(id);
    }
  }, []);

  const filteredGifts = gifts.filter((gift) => {
    const matchesName = gift.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCoin = maxCoin === "" || gift.coin <= parseInt(maxCoin);
    return matchesName && matchesCoin;
  });

  // active sovg'ani topib, uni ro'yxat boshiga olib kelamiz
  const activeGiftIndex = filteredGifts.findIndex(
    (gift) => gift.id.toString() === activeId
  );

  let sortedGifts = filteredGifts;
  if (activeGiftIndex !== -1) {
    const [activeGift] = filteredGifts.splice(activeGiftIndex, 1);
    sortedGifts = [activeGift, ...filteredGifts];
  }

  return (
    <div className="min-h-screen bg-white container mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
        🎁 IT Time Academy Sovg'alar Do‘koni
      </h1>

      {/* Qidiruv va filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
        <input
          type="text"
          placeholder="🔍 Sovg‘a nomi bo‘yicha qidirish..."
          className="border px-4 py-2 rounded-lg shadow w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          min="0"
          placeholder="🎯 Coin bo‘yicha filter (masalan: 500)"
          className="border px-4 py-2 rounded-lg shadow w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={maxCoin}
          onChange={(e) => setMaxCoin(e.target.value)}
        />
      </div>

      {/* Kartalar */}
      {sortedGifts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
          {sortedGifts.map((gift, index) => (
            <GiftCard
              key={index}
              name={gift.name}
              coin={gift.coin}
              images={gift.images}
              id={gift.id}
              active={gift.id.toString() === activeId}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          😔 Hech qanday mos sovg‘a topilmadi.
        </p>
      )}
    </div>
  );
};

export default App;
