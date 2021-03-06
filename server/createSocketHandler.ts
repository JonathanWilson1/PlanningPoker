import { Server, Socket } from "socket.io";
import { UserProfileIface } from "../shared/UserProfileIface";
import { getRoomName } from "./getRoomName";
import { isRoomName } from "./isRoomName";
import Database from "./database";
import { CardInfoIface } from "../shared/CardInfoIface";
import { CardStatus } from "../shared/CardStatusEnum";

export async function createSocketHandler(server: Server) {
  let database = await Database();

  return function socketHandler(socket: Socket) {
    /**
     * somebody is leaving the session
     */
    function onDisconnecting() {
      // broadcast "bye" message in rooms of which s/he is a member
      Array.from(socket.rooms.values())
        .filter(isRoomName)
        .forEach(async (roomName) => {
          await onBye(roomName);
          console.log(
            "[disconnecting] somebody is leaving the room",
            roomName,
            "sent from",
            socket.id
          );
        });
    }

    /**
     * somebody joined this session and said hello
     * @param roomId - room id
     * @param profile - user profile
     */
    async function onHello(roomId: string, profile: UserProfileIface) {
      const roomName = getRoomName(roomId);
      socket.join(roomName);
      await onCard(roomId, profile, CardStatus.Waiting, CardStatus.Waiting);

      console.log(
        "somebody joined this session and sent card update",
        roomId,
        profile,
        "sent from",
        socket.id
      );
    }

    /**
     * somebody joined this session and said hello
     * @param roomId - room id
     * @param profile - user profile
     */
    async function onReveal(roomId: string) {
      const roomName = getRoomName(roomId);
      await database.revealAllCardsInRoom(roomName);
      const roomsCards = await database.allCardsInRoom(roomName);
      server.in(getRoomName(roomId)).emit("card-update", roomsCards);
      console.log(
        "Revealed all cards",
        roomId
      );
    }

    /**
     * somebody joined this session and said hello
     * @param roomId - room id
     * @param profile - user profile
     */
    async function onReset(roomId: string) {
      const roomName = getRoomName(roomId);
      await database.resetAllCardsInRoom(roomName);
      const roomsCards = await database.allCardsInRoom(roomName);
      server.in(getRoomName(roomId)).emit("card-update", roomsCards);
      console.log(
        "Reset all cards",
        roomId
      );
    }

    /**
     * somebody is leaving the room
     * @param roomId - room id
     */
    async function onBye(roomId: string) {
      //garbage to get to UI ;)
      var roomName = ""
      if (isRoomName(roomId)) {
        roomName = roomId;
      } else {
        roomName = getRoomName(roomId);
      }


      await database.removeCard(roomName, socket.id);
      const roomsCards = await database.allCardsInRoom(roomName);
      server.in(roomName).emit("card-update", roomsCards);
      //socket.leave(getRoomName(roomId));

      console.log(
        "somebody is leaving the room",
        roomId,
        "sent from",
        socket.id
      );
    }

    /**
     * somebody sent card
     */
    async function onCard(roomId: string, profile: UserProfileIface, card: string, cardStatus: CardStatus) {
      const roomName = getRoomName(roomId);
      await database.replaceCard(roomName, socket.id, profile.name, card, cardStatus);

      const roomsCards = await database.allCardsInRoom(roomName);
      server.in(getRoomName(roomId)).emit("card-update", roomsCards);

      console.log(
        "somebody updated a card",
        roomId,
        profile,
        "Card: ",
        card,
        "Rooms Cards",
        roomsCards
      );
    }

    socket.on("disconnecting", onDisconnecting);
    socket.on("reveal", onReveal);
    socket.on("reset", onReset);
    socket.on("hello", onHello);
    socket.on("bye", onBye);
    socket.on("card", onCard);
  };
}
