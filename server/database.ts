import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { CardInfoIface } from "../shared/CardInfoIface";

async function Database () {
  let db = await open({
      filename: './Database.db',
      driver: sqlite3.Database
    });
  init();

  function init() {
    db.exec('CREATE TABLE IF NOT EXISTS cards ( socketId TEXT NOT NULL, roomName TEXT NOT NULL, userName TEXT NOT NULL, card TEXT NOT NULL, PRIMARY KEY (`socketId`, `roomName`))');
    console.log('DB: Table Created');
  }

  async function addCard(roomName: string, socketId: string, userName: string, card: string) {
    await db.run('REPLACE INTO cards VALUES (?, ?, ?, ?)', socketId, roomName, userName, card);
    console.log('DB: Added/Updated Card');
  }

  async function removeCard(roomName: string, socketId: string) {
    await db.run('DELETE FROM cards WHERE socketId = ? AND roomName = ?', socketId, roomName);
    console.log('DB: Removed Card', roomName, socketId);
  }

  async function allCardsInRoom(roomName: string): Promise<Array<CardInfoIface>> {
    const result = await db.all('SELECT * FROM cards WHERE roomName = ?', roomName);
    return result;
  }

  return Object.freeze({
    addCard,
    removeCard,
    allCardsInRoom
  });
}

export default Database;
