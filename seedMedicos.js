/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');

// Configuração do banco de dados
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '150149',   
  database: 'hospital' 
});

function generateMedicamento() {
    return {
      Nome: faker.commerce.productName().substring(0, 30),
      Lote: faker.string.alphanumeric(10),
      Frabricante: faker.company.name().substring(0, 255),
      DataValidade: faker.date.future()
    };
  }
  
  async function seedMedicamentos(total, batchSize) {
    let inserted = 0;
  
    while (inserted < total) {
      const values = [];
  
      for (let i = 0; i < batchSize; i++) {
        if (inserted >= total) break;
        const medicamento = generateMedicamento();
        values.push([
          medicamento.Nome,
          medicamento.Lote,
          medicamento.Frabricante,
          medicamento.DataValidade
        ]);
        inserted++;
      }
  
      const query = `
        INSERT INTO medicamentos (Nome, Lote, Frabricante, DataValidade)
        VALUES ?
      `;
  
      try {
        await new Promise((resolve, reject) => {
          connection.query(query, [values], (err) => {
            if (err) reject(err);
            resolve();
          });
        });
        console.log(`${inserted} registros inseridos...`);
      } catch (err) {
        console.error('Erro ao inserir registros:', err);
        break;
      }
    }
  
    console.log('Todos os registros foram inseridos com sucesso!');
    connection.end();
  }
  
  seedMedicamentos(1000000, 10000);
