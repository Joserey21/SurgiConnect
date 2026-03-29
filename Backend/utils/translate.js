async function translateText(text, targetLanguage) {
  if (!text || !targetLanguage) return text;

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        format: "text",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Translation failed: ${errorText}`);
  }

  const data = await response.json();
  return data.data.translations[0].translatedText;
}

module.exports = translateText;