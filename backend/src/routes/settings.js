const express = require('express');
const router = express.Router();

// Компании
const companies = [
  { id: 1, name: 'Qaaba Travel', inn: '1234567890', active: true },
  { id: 2, name: 'Tour Express', inn: '0987654321', active: true },
];

// Валюты
const currencies = [
  { id: 1, code: 'KZT', name: 'Казахстанский тенге', symbol: '₸', rate: 1 },
  { id: 2, code: 'USD', name: 'Доллар США', symbol: '$', rate: 450 },
  { id: 3, code: 'EUR', name: 'Евро', symbol: '€', rate: 490 },
  { id: 4, code: 'RUB', name: 'Российский рубль', symbol: '₽', rate: 5 },
];

// Интеграции
const integrations = [
  { id: 1, name: 'Amadeus', type: 'GDS', active: true },
  { id: 2, name: 'Sabre', type: 'GDS', active: false },
  { id: 3, name: '1C', type: 'ERP', active: true },
];

// СУД (Система управления документами)
const sud = [
  { id: 1, name: 'Договор', code: 'CONTRACT', active: true },
  { id: 2, name: 'Счёт', code: 'INVOICE', active: true },
  { id: 3, name: 'Акт', code: 'ACT', active: true },
];

// GET /api/settings/companies
router.get('/companies', (req, res) => {
  res.json({ data: companies, total: companies.length });
});

// GET /api/settings/currencies
router.get('/currencies', (req, res) => {
  res.json({ data: currencies, total: currencies.length });
});

// GET /api/settings/integrations
router.get('/integrations', (req, res) => {
  res.json({ data: integrations, total: integrations.length });
});

// GET /api/settings/sud
router.get('/sud', (req, res) => {
  res.json({ data: sud, total: sud.length });
});

module.exports = router;

