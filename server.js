import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CleanURI
app.post('/api/shorten', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL not provided' })
  }

  try {
    const response = await axios.post('https://cleanuri.com/api/v1/shorten', new URLSearchParams({
      url: url
    }))

    res.json({ shortUrl: response.data.result_url });
  } catch (error) {
    res.status(500).json({ error: 'Error shortening URL' });
  }
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});