import { Server, Socket } from "socket.io";
import { UserProfileIface } from "../shared/UserProfileIface";
import { getRoomName } from "./getRoomName";
import { isRoomName } from "./isRoomName";
import Database from "./database";
import { TextIface } from "../shared/TextIface";

export async function createSocketHandler(server: Server) {
  let database = await Database();

  return function socketHandler(socket: Socket) {
    /**
     * somebody is leaving the session
     */
    function onDisconnecting() {
      // broadcast "bye" message in rooms of which s/he is a member
      Object.keys(socket.rooms)
        .filter(isRoomName)
        .forEach((roomName) => {
          onBye(roomName)
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
      socket.join(roomName, () => {
        onCard(roomId, profile, "")
      });

      console.log(
        "somebody joined this session and sent card update",
        roomId,
        profile,
        "sent from",
        socket.id
      );
    }

    /**
     * somebody is leaving the room
     * @param roomId - room id
     */
    async function onBye(roomId: string) {
      socket.leave(getRoomName(roomId));
      database.removeCard(roomId, socket.id);

      const roomName = getRoomName(roomId);
      const roomsCards = await database.allCardsInRoom(roomName);
      socket.in(getRoomName(roomId)).emit("card-update", roomsCards);
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
    async function onCard(roomId: string, profile: UserProfileIface, card: string) {
      const roomName = getRoomName(roomId);
      database.addCard(roomName, socket.id, profile.name, card);

      const roomsCards = await database.allCardsInRoom(roomName);
      socket.in(getRoomName(roomId)).emit("card-update", roomsCards);

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
    socket.on("hello", onHello);
    socket.on("bye", onBye);
    socket.on("card", onCard);
  };
}
