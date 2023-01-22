require('dotenv').config({path: './.env'});
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: process.env.ORG,
    apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())

const port = 3080;

app.get('/models', async (req, res) => {
    const response = await openai.listEngines();
    console.log(response.data)
    res.json({
      data: response.data
      })
})

app.post('/', async (req, res) => {
    const { message, currentModel } = req.body;
    console.log('message', message)
    const response = await openai.createCompletion({
        model: `${currentModel}`,
        prompt: `${message}`,
        max_tokens: 100,
        temperature: 0.5,
      });
      console.log(response.data);
      if (response.data.choices) {
        res.json({
          message: response.data.choices[0].text
        })
      } else {
        res.json({
          message: "No response"
        })
      }
})

app.listen(port, () => {
    console.log(`example app listening at http://localhost:${port}`)
})