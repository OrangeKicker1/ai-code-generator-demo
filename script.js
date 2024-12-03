const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-code', async (req, res) => {
  const { prompt } = req.body;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    // Simulate code generation (replace this with actual code generation logic)
    const code = `
      // Simulated code generation based on prompt
      function startStopwatch() {
        let startTime, endTime, running, duration = 0;

        function start() {
          startTime = new Date();
          running = true;
        }

        function stop() {
          endTime = new Date();
          running = false;
          const delta = endTime - startTime;
          duration += delta;
        }

        function reset() {
          startTime = new Date();
          endTime = new Date();
          running = false;
          duration = 0;
        }

        function getTime() {
          return duration;
        }

        return {
          start,
          stop,
          reset,
          getTime
        };
      }

      const stopwatch = startStopwatch();
      stopwatch.start();
      setTimeout(() => {
        stopwatch.stop();
        console.log('Time:', stopwatch.getTime());
      }, 5000);
    `;

    res.write(`data: ${code}\n\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const listener = app.listen(port, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
