const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app     = express();
const PORT    = process.env.PORT || 3000;

app.use(cors());  // Mengizinkan akses CORS
app.use(express.json());  // Parsing JSON untuk request body

// Tampilkan gambar dari folder "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

// Endpoint untuk URL utama "/"
app.get('/', (req, res) => {
  res.send('<h2>Welcome to the Coffee API!</h2><p>Click <a href="/coffee">here</a> to view the coffee list.</p>');
});

// Endpoint untuk membaca data CSV dan mengirim dalam format JSON
app.get('/coffee', (req, res) => {
  const csvPath = path.join(__dirname, 'coffee_list_data.csv');

  fs.readFile(csvPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading CSV file', error: err });
    }

    const rows = data.split('\n').filter(line => line);
    const headers = rows[0].split(';');

    const jsonData = rows.slice(1).map(row => {
      const values = row.split(';');
      const coffee = {};

      headers.forEach((header, index) => {
        coffee[header.trim()] = values[index].trim();
      });

      // URL gambar ditambahkan ke objek JSON
      coffee.thumbnail_url = `${req.protocol}://${req.get('host')}/images/${coffee.coffee_thumbnails}`;
      coffee.poster_url = `${req.protocol}://${req.get('host')}/images/${coffee.coffee_poster}`;

      return coffee;
    });

    res.json(jsonData); // Mengirim data sebagai JSON
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
