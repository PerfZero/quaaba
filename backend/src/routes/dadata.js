const express = require("express");

const router = express.Router();

const DADATA_URL =
  "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const DEFAULT_COUNTRIES = (process.env.DADATA_DEFAULT_COUNTRIES || "RU,KZ")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const normalizeCountries = (countries) => {
  if (!countries) {
    return DEFAULT_COUNTRIES;
  }
  if (typeof countries === "string") {
    const trimmed = countries.trim().toLowerCase();
    if (trimmed === "all") {
      return DEFAULT_COUNTRIES;
    }
    return countries
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (Array.isArray(countries)) {
    return countries.map((item) => String(item).trim()).filter(Boolean);
  }
  return DEFAULT_COUNTRIES;
};

const getDadataHeaders = () => {
  const apiKey = process.env.DADATA_API_KEY;
  const secret = process.env.DADATA_SECRET;

  if (!apiKey || !secret) {
    return null;
  }

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Token ${apiKey}`,
    "X-Secret": secret,
  };
};

// POST /api/dadata/cities - Подсказки по городам
router.post("/cities", async (req, res) => {
  try {
    const { query, countries } = req.body || {};
    const trimmedQuery = typeof query === "string" ? query.trim() : "";

    if (trimmedQuery.length < 2) {
      return res.json({ data: [] });
    }

    const headers = getDadataHeaders();
    if (!headers) {
      return res.status(500).json({ message: "Dadata не настроена" });
    }

    const countriesList = normalizeCountries(countries);

    const fetchSuggestions = async (countryIso) => {
      const response = await fetch(DADATA_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: trimmedQuery,
          count: 10,
          from_bound: { value: "city" },
          to_bound: { value: "settlement" },
          locations: countryIso
            ? [{ country_iso_code: countryIso }]
            : undefined,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      return Array.isArray(result.suggestions) ? result.suggestions : [];
    };

    const suggestionsByCountry = await Promise.all(
      countriesList.map((countryIso) => fetchSuggestions(countryIso)),
    );
    const suggestions = suggestionsByCountry.flat();

    const normalizedSuggestions = [];
    const seen = new Set();

    for (const suggestion of suggestions) {
      const data = suggestion.data || {};
      if (
        data.street ||
        data.street_with_type ||
        data.house ||
        data.house_fias_id
      ) {
        continue;
      }
      const cityValue =
        data.city ||
        data.settlement ||
        data.settlement_with_type ||
        suggestion.value;
      if (!cityValue) {
        continue;
      }
      const countryCode = data.country_iso_code || "";
      const dedupeKey = `${cityValue}::${countryCode}`;
      if (!seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        normalizedSuggestions.push({ value: cityValue, data });
      }
    }

    res.json({
      data: normalizedSuggestions,
    });
  } catch (error) {
    console.error("Error fetching dadata cities:", error);
    res.status(500).json({ message: "Ошибка Dadata", error: error.message });
  }
});

module.exports = router;
