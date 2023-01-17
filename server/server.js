import path from 'path'
import url from 'url'
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
const PORT = process.env.PORT || 3500;

dotenv.config();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
}

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`${prompt}`,
            temperature:0,
            max_tokens: 3000,
            top_p:1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        })

        res.status(200).send({
            bot: response.data.choices[0].text
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error || 'Something went Wrong')
    }
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));