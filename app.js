const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const cors = require('cors'); // Importa o módulo cors

const app = express();

app.use(cors()); // Habilita CORS para todas as rotas

let airports = [];

// Carregar o arquivo CSV de aeroportos
fs.createReadStream('airports.csv')
  .pipe(csvParser())
  .on('data', (row) => {
    airports.push(row);
  })
  .on('end', () => {
    console.log('Arquivo CSV carregado com sucesso.');
  });

// Rota para buscar aeroportos por nome ou código IATA
app.get('/api/aeroportos', (req, res) => {
  const searchTerm = req.query.q ? req.query.q.toLowerCase() : '';
  
  const results = airports.filter(airport => 
    airport.name.toLowerCase().includes(searchTerm) || 
    airport.iata_code.toLowerCase().includes(searchTerm)
  );

  res.json(results);
});

// Rodar o servidor na porta especificada
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});