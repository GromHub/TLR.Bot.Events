import express from 'express';

export function initApp() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.get('/', (_req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
