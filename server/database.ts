import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { CardInfoIface } from "../shared/CardInfoIface";
import { CardStatus } from "../shared/CardStatusEnum";

async function Database () {
  let db = await open({
      filename: './Database.db',
      driver: sqlite3.Database
    });
  init();

  function init() {
    db.exec('CREATE TABLE IF NOT EXISTS cards ( socketId TEXT NOT NULL, roomName TEXT NOT NULL, userName TEXT NOT NULL, card TEXT NOT NULL, cardStatus TEXT NOT NULL, PRIMARY KEY (`socketId`, `roomName`))');
    console.log('DB: Table Created');
  }

  async function replaceCard(roomName: string, socketId: string, userName: string, card: string, cardStatus: CardStatus) {
    await db.run('REPLACE INTO cards VALUES (?, ?, ?, ?, ?)', socketId, roomName, userName, card, cardStatus);
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

  async function resetAllCardsInRoom(roomName: string){
    await db.run('UPDATE cards SET cardStatus = ?, card = ? WHERE roomName = ?', CardStatus.Waiting, CardStatus.Waiting, roomName);
    console.log('DB: UPDATE Card to waiting', CardStatus.Waiting);
  }

  async function revealAllCardsInRoom(roomName: string){
    await db.run('UPDATE cards SET cardStatus = ? WHERE roomName = ?', CardStatus.Revealed, roomName);
    console.log('DB: UPDATE Card to revealed', CardStatus.Revealed);
  }

  return Object.freeze({
    replaceCard,
    removeCard,
    allCardsInRoom,
    resetAllCardsInRoom,
    revealAllCardsInRoom
  });
}

export default Database;
