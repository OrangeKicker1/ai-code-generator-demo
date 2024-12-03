const express = require('express');
const bodyParser = require('body-parser');
const { Transformers } = require('@xenova/transformers');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const transformers = new Transformers({
  model: 'Salesforce/codegen-350M-multi',
});

app.post('/generate-code', async (req, res) => {
  const { prompt } = req.body;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const response = await transformers.generate(prompt, {
      onToken: (token) => {
        res.write(`data: ${token}\n\n`);
      },
    });
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const listener = app.listen(port, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
