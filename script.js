const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pipeline } = require('@xenova/transformers');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialize the code generation pipeline
const generate = pipeline('text-generation', 'Salesforce/codegen-350M-multi');

app.post('/generate-code', async (req, res) => {
  const { prompt } = req.body;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const response = await generate(prompt, {
      max_length: 256,
      num_return_sequences: 1,
    });

    const generatedCode = response[0].generated_text;
    res.write(`data: ${generatedCode}\n\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const listener = app.listen(port, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
