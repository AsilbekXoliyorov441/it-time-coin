import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const FIVE_MINUTES = 5 * 60 * 1000; // 5 daqiqa millisekundlarda

const GiftCard = ({ name, coin, images, id, active }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    quantity: 1,
    description: "",
  });

  const [captchaValue, setCaptchaValue] = useState(null);

  const [clientIP, setClientIP] = useState("Noma'lum");
  const userAgent = navigator.userAgent;

  // Rasmlar yuklanganligini saqlash uchun state
  const [imagesLoaded, setImagesLoaded] = useState(
    images ? new Array(images.length).fill(false) : []
  );

  useEffect(() => {
    fetch("https://api.ipify.org/?format=json")
      .then((res) => res.json())
      .then((data) => setClientIP(data.ip))
      .catch(() => setClientIP("Noma'lum"));
  }, []);

  const handleImageLoad = (index) => {
    setImagesLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const lastSent = localStorage.getItem("lastMessageTime");
    const now = Date.now();

    if (lastSent && now - lastSent < FIVE_MINUTES) {
      const waitTimeMs = FIVE_MINUTES - (now - lastSent);
      const minutes = Math.floor(waitTimeMs / 60000);
      const seconds = Math.floor((waitTimeMs % 60000) / 1000);
      alert(
        `Siz allaqachon xabar yuborgansiz. Iltimos, ${minutes} daqiqa va ${seconds} soniyadan keyin qayta urinib ko'ring.`
      );
      return;
    }

    const token = "7871290399:AAEdnRJa1KkFpPDJCAnbofaYaHfBKWIY8sw"; // Bot tokeningiz
    const chatId = "6713537237"; // Chat ID

    const giftUrl = `https://www.eventsgo.uz/?id=${id}`;
    const currentTime = new Date().toLocaleString();

    const message =
      `🎁 Sovg'a: ${name}\n` +
      `💰 Coin: ${coin}\n` +
      `🆔 ID: ${id}\n` +
      `🌐 Link: ${giftUrl}\n\n` +
      `👤 To'liq ism: ${formData.fullName}\n` +
      `📞 Telefon: ${formData.phone}\n` +
      `📦 Nechta: ${formData.quantity}\n` +
      `📝 Izoh: ${formData.description || "Yo'q"}\n\n` +
      `🌍 IP manzili: ${clientIP}\n` +
      `🖥 User-Agent: ${userAgent}\n` +
      `🕒 Vaqt: ${currentTime}\n\n` +
      `@Xoliyorov_AsiIbek`;

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        }
      );

      if (res.ok) {
        alert("Xabaringiz yuborildi! Tez orada sizga bog'lanamiz.");
        localStorage.setItem("lastMessageTime", now.toString());
        setIsModalOpen(false);
        setFormData({
          fullName: "",
          phone: "",
          quantity: 1,
          description: "",
        });
        setCaptchaValue(null);
      } else {
        alert(
          "Xabar yuborishda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring."
        );
      }
    } catch (error) {
      alert("Xabar yuborishda xatolik yuz berdi.");
      console.error(error);
    }
  };

  return (
    <>
      <div
        className={`w-full max-w-sm mx-auto bg-gradient-to-br from-blue-100 to-white shadow-lg rounded-2xl p-4 flex flex-col justify-between transition-transform duration-300
          ${
            active
              ? "border-4 border-yellow-500 shadow-yellow-400 scale-105 animate-pulse"
              : "border border-transparent"
          }
        `}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            {name}
          </h2>
          <span className="flex items-center text-[18px] sm:text-[20px] text-yellow-400 font-bold">
            <img className="w-6 sm:w-[30px]" src="/coin.png" alt="coin" />{" "}
            {coin}
          </span>
        </div>

        <div className="relative bg-gray-100 w-full rounded-lg mt-2 flex items-center justify-center overflow-hidden h-60 sm:h-72">
          {images && images.length > 0 ? (
            <>
              <button
                ref={prevRef}
                className="cursor-pointer absolute left-1 top-1/2 -translate-y-1/2 bg-white text-gray-600 hover:text-blue-500 p-1 rounded-full shadow text-xs z-10"
              >
                ◀
              </button>
              <button
                ref={nextRef}
                className="cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 bg-white text-gray-600 hover:text-blue-500 p-1 rounded-full shadow text-xs z-10"
              >
                ▶
              </button>

              <Swiper
                loop
                modules={[Navigation]}
                onInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={`${name}-${idx}`}
                      onLoad={() => handleImageLoad(idx)}
                      className="w-full h-60 sm:h-72 object-contain object-center transition-all duration-700"
                      style={{
                        filter: imagesLoaded[idx]
                          ? "none"
                          : "blur(20px) grayscale(80%)",
                        transition: "filter 0.7s ease",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <span className="text-gray-400 text-sm">Image/Icon</span>
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white py-2 rounded-lg shadow-md text-sm sm:text-base"
        >
          Sotib olish
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 px-4 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-[36px] mr-[10px] cursor-pointer"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">
              Buyurtma berish
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="fullName"
                >
                  To'liq ism
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="phone"
                >
                  Telefon
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="quantity"
                >
                  Nechta
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="description"
                >
                  Izoh (ixtiyoriy)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                ></textarea>
              </div>


              <button
                type="submit"
                className="w-full mt-4 cursor-pointer bg-blue-500 hover:bg-blue-600  text-white py-2 rounded-md font-semibold"
              >
                Xabar yuborish
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GiftCard;
