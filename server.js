const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.redirect('https://thredd.io');
});

app.get('/popup.html', (req, res) => {
  const thredd_search_url = req.query.override_url;
  res.status(200).sendFile('/popup.html').end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
