import { useState } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();

    if (city.trim() === "") return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&units=metric&appid=${API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
        console.log(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  // Weather icon based on condition
  function getWeatherIcon(condition) {
    const icons = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
      Haze: "🌫️",
      Fog: "🌫️",
    };

    return icons[condition] || "🌤️";
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-300 via-blue-100 to-sky-200 px-5 py-12">
      {/* Background Decorations */}
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/30 blur-3xl"></div>

      <div className="absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl"></div>

      <div className="absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-white/40 blur-3xl"></div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        {/* Header */}
        <header className="mb-10 flex flex-col items-center text-center sm:flex-row sm:justify-center sm:gap-5">
          <div className="mb-3 text-6xl sm:mb-0 sm:text-7xl">🌤️</div>

          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">
              Weather Watch
            </h1>
            <p className="mt-2 text-sm font-medium text-blue-800 sm:text-base">
              Check the weather anywhere, anytime!
            </p>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-blue-500"></div>
          </div>
        </header>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col gap-3 sm:flex-row"
        >
          <div className="flex flex-1 items-center rounded-2xl border border-white/70 bg-white/70 px-5 shadow-lg shadow-blue-900/10 backdrop-blur-md transition focus-within:border-blue-400">
            <span className="mr-3 text-3xl text-blue-600">⌕</span>

            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Search city..."
              className="w-full bg-transparent py-4 text-lg text-blue-950 outline-none placeholder:text-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition duration-300 hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Searching..." : "⌕ Search"}
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div className="mb-6 flex items-center justify-center gap-3 text-lg font-semibold text-blue-700">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

            <p>Fetching weather...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-100/80 px-5 py-4 text-center font-medium text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* Weather Card */}
        {weather && (
          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-2xl shadow-blue-900/10 backdrop-blur-xl transition duration-300 hover:shadow-blue-900/20 sm:p-9">
            {/* City Information */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">📍</span>

                <div>
                  <h2 className="text-2xl font-bold text-blue-950 sm:text-3xl">
                    {weather.name}
                  </h2>

                  <p className="text-sm capitalize text-blue-700 sm:text-base">
                    {weather.weather[0].description}
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-white bg-white/60 px-4 py-2 text-sm font-medium text-blue-800 shadow-sm">
                📅{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </div>

            {/* Temperature */}
            <div className="flex items-center justify-around gap-3 py-10">
              <div className="text-7xl drop-shadow-lg sm:text-9xl">
                {getWeatherIcon(weather.weather[0].main)}
              </div>

              <div className="text-center">
                <h1 className="text-7xl font-extrabold tracking-tighter text-blue-600 sm:text-9xl">
                  {Math.round(weather.main.temp)}°
                  <span className="text-4xl sm:text-5xl">C</span>
                </h1>

                <p className="mt-3 text-sm font-medium text-blue-700 sm:text-base">
                  Feels like {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mb-6 h-px w-full bg-blue-300/50"></div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-5">
              {/* Humidity */}
              <div className="flex items-center justify-center gap-3">
                <div className="text-4xl sm:text-5xl">💧</div>

                <div>
                  <p className="text-sm font-medium text-blue-700 sm:text-base">
                    Humidity
                  </p>

                  <h3 className="text-xl font-bold text-blue-950 sm:text-2xl">
                    {weather.main.humidity}%
                  </h3>
                </div>
              </div>

              {/* Wind */}
              <div className="flex items-center justify-center gap-3 border-l border-blue-300/60">
                <div className="text-4xl sm:text-5xl">💨</div>

                <div>
                  <p className="text-sm font-medium text-blue-700 sm:text-base">
                    Wind Speed
                  </p>

                  <h3 className="text-xl font-bold text-blue-950 sm:text-2xl">
                    {Math.round(weather.wind.speed * 3.6)} km/h
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!weather && !loading && !error && (
          <div className="py-12 text-center">
            <div className="mb-5 text-7xl">🌍</div>

            <h2 className="text-2xl font-bold text-blue-950">
              Discover Your Weather
            </h2>

            <p className="mt-2 text-blue-700">
              Enter a city name to see its current weather.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 w-full text-center text-sm text-blue-800/70">
        Made with ☀️ Weather Watch
      </footer>
    </div>
  );
}
