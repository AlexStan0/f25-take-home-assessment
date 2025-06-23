"use client";
import { useState } from "react";

function renderWeatherInfo(data: any) {

    // Ensure data is valid and has the expected structure
    if (!data || !data.weather || !data.weather.current) return null;

    // Destructure the necessary properties from the data
    const { location, notes, weather } = data;
    const current = weather?.current || {};

    // Check if the required properties are present
    if (!location || !current) return null;
    if (!current.weather_descriptions || !current.temperature || !current.humidity || !current.wind_speed) {
        return <div className="text-red-400">Incomplete weather data</div>;
    }

    // Render the weather information
    return (
        <div className="flex justify-center w-full">
        <div
            className="relative bg-[#10182a] rounded-2xl shadow-xl p-8 w-full max-w-md text-left border border-[#2563eb] mx-auto"
            style={{
            boxShadow: "0 0 24px 2px #2563eb, 0 2px 16px #232c47",
            }}
        >
            <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent"
            style={{
                boxShadow: "0 0 32px 4px #2563eb88",
            }}
            />
            <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-[#b5cdfa]">{location}</h3>
            {notes && (
                <div className="mt-1 text-base text-[#8fb4ff] italic">{notes}</div>
            )}
            </div>
            <div>
            <ul className="text-base space-y-2">
                {current.weather_descriptions && (
                <li>
                    <span className="font-medium text-[#8fb4ff]">Weather:</span>{" "}
                    <span className="text-white">{current.weather_descriptions.join(", ")}</span>
                </li>
                )}
                {current.temperature !== undefined && (
                <li>
                    <span className="font-medium text-[#8fb4ff]">Temperature:</span>{" "}
                    <span className="text-white">{current.temperature}°C</span>
                </li>
                )}
                {current.humidity !== undefined && (
                <li>
                    <span className="font-medium text-[#8fb4ff]">Humidity:</span>{" "}
                    <span className="text-white">{current.humidity}%</span>
                </li>
                )}
                {current.wind_speed !== undefined && (
                <li>
                    <span className="font-medium text-[#8fb4ff]">Wind Speed:</span>{" "}
                    <span className="text-white">{current.wind_speed} km/h</span>
                </li>
                )}
            </ul>
            </div>
        </div>
        </div>
    );
}

export function WeatherLookup() {
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const [weather, setWeather] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLookup = async () => {
        setLoading(true);
        setError(null);
        setWeather(null);
        try {
            const res = await fetch(`http://localhost:8000/weather/${id}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Not found");
            }
            const data = await res.json();
            setWeather(data);
        } catch (err: any) {
            setError(err.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex gap-2 mb-4 w-full max-w-md">
                <input
                    className="border border-[#232c47] bg-[#10182a] text-white rounded px-3 py-2 flex-1 placeholder-[#8fa2c7] focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter Weather Data ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleLookup(); }}
                />
                <button
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded disabled:opacity-50 transition-colors font-semibold"
                    onClick={handleLookup}
                    disabled={loading || !id}
                >
                    {loading ? "Loading..." : "Lookup"}
                </button>
            </div>

            {error && (<div className="text-red-400 mb-2">{error}</div>)}
            {weather && renderWeatherInfo(weather)}
        </div>
    );
}
