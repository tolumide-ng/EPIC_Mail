import '@babel/polyfill';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { create } from 'domain';
import db from './index';
import queries from './queries';

const { createTable, dropTable } = queries;
dotenv.config();

const theDatabaseUrl = process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: theDatabaseUrl,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

// CREATE THE TABLE
const createTheTables = async () => {
  try {
    await db.query(createTable.usersTable);
    await db.query(createTable.contactsTable);
    await db.query(createTable.messagesTable);
    await db.query(createTable.alterMessagesTable);
    await db.query(createTable.groupTable);
    await db.query(createTable.groupMembersTable);
  } catch (err) {
    console.log(`${err.name}, ${err.message}`);
  }
};

const dropTheTables = async () => {
  try {
    await db.query(dropTable.usersTable);
    await db.query(dropTable.contactsTable);
    await db.query(dropTable.messagesTable);
    await db.query(dropTable.groupTable);
    await db.query(dropTable.groupMembersTable);
  } catch (err) {
    console.log(`${err.name}, ${err.message}`);
  }
};

module.exports = {
  createTheTables,
  dropTheTables,
};

require('make-runnable');
