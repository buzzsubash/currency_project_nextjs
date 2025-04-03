// lib/db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Function to open database connection
export async function openDb() {
  return open({
    filename: './currency_data.db', // Path to your SQLite database
    driver: sqlite3.Database
  });
}

// Function to get all currencies
export async function getAllCurrencies() {
  const db = await openDb();
  return db.all('SELECT * FROM currencies ORDER BY name');
}

// Function to get a specific currency by code
export async function getCurrencyByCode(code) {
  const db = await openDb();
  return db.get('SELECT * FROM currencies WHERE code = ?', [code]);
}

// Function to calculate conversion rate between two currencies
export async function getConversionRate(fromCode, toCode) {
  const db = await openDb();
  const fromCurrency = await db.get('SELECT rate FROM currencies WHERE code = ?', [fromCode]);
  const toCurrency = await db.get('SELECT rate FROM currencies WHERE code = ?', [toCode]);

  if (!fromCurrency || !toCurrency) {
    throw new Error('One or both currencies not found');
  }

  // Calculate conversion rate using USD as intermediary
  return toCurrency.rate / fromCurrency.rate;
}