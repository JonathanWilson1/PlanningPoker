import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

async function Database () {
  let db = await open('./Database.db');
  init();

  function init() {
    db.exec('CREATE TABLE IF NOT EXISTS cards ( socketId TEXT NOT NULL, roomId TEXT NOT NULL, userName TEXT NOT NULL, card TEXT NOT NULL, PRIMARY KEY (`socketId`, `roomId`))');
    console.log('DB: Table Created');
  }

  async function addCard(roomId: string, socketId: string, userName: string, card: string) {
    await db.run('REPLACE INTO cards VALUES (?, ?, ?, ?)', socketId, roomId, userName, card);
    console.log('DB: Added/Updated Card');
  }

  async function removeCard(roomId: string, socketId: string) {
    await db.run('DELETE FROM cards WHERE socketId = ? AND roomId = ?', socketId, roomId);
    console.log('DB: Removed Card', roomId, socketId);
  }

  async function allCardsInRoom(roomId: string) {
    const result = await db.all('SELECT * FROM cards WHERE roomId = ?', roomId);
    return result;
  }

  return Object.freeze({
    addCard,
    removeCard,
    allCardsInRoom
  });
}

export default Database;
