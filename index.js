import express from 'express';
import cors from 'cors';
import { pipeline } from '@xenova/transformers';

const app = express();
app.use(cors());
app.use(express.json());

let enToAr, arToEn;

// Load models
(async () => {
  enToAr = await pipeline('translation', 'Helsinki-NLP/opus-mt-en-ar');
  arToEn = await pipeline('translation', 'Helsinki-NLP/opus-mt-ar-en');
})();

app.post('/translate', async (req, res) => {
  const { text, from, to } = req.body;

  try {
    let translation;
    if (from === 'en' && to === 'ar') {
      translation = await enToAr(text);
    } else if (from === 'ar' && to === 'en') {
      translation = await arToEn(text);
    } else {
      return res.status(400).json({ error: 'Unsupported language pair' });
    }

    res.json({ translation: translation[0].translation_text });
  } catch (err) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Translation API listening on port ${PORT}`));
