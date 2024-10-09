const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const app = express();

let airports = [];

// Carregar o arquivo CSV de aeroportos
fs.createReadStream('airports.csv')  // Certifique-se de que o arquivo CSV está no mesmo diretório
  .pipe(csvParser())
  .on('data', (row) => {
    airports.push(row); // Adiciona cada linha do CSV ao array de aeroportos
  })
  .on('end', () => {
    console.log('Arquivo CSV carregado com sucesso.');
  });

// Rota para buscar aeroportos por nome ou código IATA
app.get('/api/aeroportos', (req, res) => {
  const searchTerm = req.query.q ? req.query.q.toLowerCase() : '';
  
  // Filtra os aeroportos com base no termo de pesquisa (nome ou código IATA)
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