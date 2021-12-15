import { Server, Socket } from "socket.io";
import { UserProfileIface } from "../shared/UserProfileIface";
import { getRoomName } from "./getRoomName";
import { isRoomName } from "./isRoomName";
import { getCardKey } from "./getCardKey";
import { TextIface } from "../shared/TextIface";

export function createSocketHandler(server: Server) {
  let cards: { [key: string]: {[key: string]: string} } = {};

  return function socketHandler(socket: Socket) {

    /**
     * somebody is leaving the session
     */
    function onDisconnecting() {
      // broadcast "bye" message in rooms of which s/he is a member
      Object.keys(socket.rooms)
        .filter(isRoomName)
        .forEach((roomName) => {
          socket.to(roomName).emit("bye", socket.id);
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
    function onHello(roomId: string, profile: UserProfileIface) {
      const roomName = getRoomName(roomId);

      // request to send text logs
      const room = server.sockets.adapter.rooms[roomName];
      if (room) {
        const users = Object.keys(room.sockets);
        if (users.length > 0) {
          server.to(users[0]).emit("logs", socket.id);
        }
      }

      socket.join(roomName, () => {
        // broadcast "hello" message to room members
        socket.to(roomName).emit("hello", profile, socket.id);
      });

      console.log(
        "somebody joined this session and said hello",
        roomId,
        profile,
        "sent from",
        socket.id
      );
    }

    /**
     * somebody responded to one's greeting
     * @param roomId - room id
     * @param profile - user profile
     */
    function onHelloAck(roomId: string, profile: UserProfileIface) {
      // broadcast "hello-ack" message to room members
      socket.to(getRoomName(roomId)).emit("hello-ack", profile, socket.id);
      console.log(
        "somebody responded to one's greeting",
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
    function onBye(roomId: string) {
      socket.to(getRoomName(roomId)).emit("bye", socket.id);
      socket.leave(getRoomName(roomId));
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
    function onCard(roomId: string, profile: UserProfileIface, card: string) {
  
      cards[getRoomName(roomId)][profile.id] = card;
      socket.to(getRoomName(roomId)).emit("card-update", profile, card);
      console.log(
        "somebody updated a card",
        roomId,
        profile,
        card,
        "Cards: ",
        cards
      );
    }

    socket.on("disconnecting", onDisconnecting);
    socket.on("hello", onHello);
    socket.on("hello-ack", onHelloAck);
    socket.on("bye", onBye);
    socket.on("card", onCard);
  };
}
