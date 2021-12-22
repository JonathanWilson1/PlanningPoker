import { FC, useState, useEffect, useCallback, useContext } from "react";
import SocketIO, { Socket } from "socket.io-client";

import UserProfileContext from "../profile/UserProfileContext";
import { UserProfileIface } from "../../../shared/UserProfileIface";
import { CardInfoIface } from "../../../shared/CardInfoIface";

import SocketContext from "./SocketContext";
import { SocketIface } from "./SocketIface";
import { RoomMembersIface } from "./RoomMembersIface";

const SocketProvider: FC = ({ children }) => {
  const [socket, setSocket] = useState<typeof Socket>(null);
  const [roomId, setRoomId] = useState<string>(null);
  const myProfile = useContext(UserProfileContext);
  const [roomCards, setRoomCards] = useState<Array<CardInfoIface>>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    console.log("[mounted]");

    // connect to Socket.io server
    const s = SocketIO();
    setSocket(s);

    return () => {
      console.log("[unmounted]");
      if (socket && socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket || !myProfile) return;

    /**
     * connection lost
     */
    function disconnect() {
      console.log("[received] disconnect");
      setSocket(null);

      socket.once("reconnect", () => {
        console.log("[reconnected]");
        setSocket(socket);
        setRoomCards([]);
        join(roomId);
      });
    }

    // /**
    //  * somebody joined this session and said hello
    //  * @param profile
    //  * @param socketId
    //  */
    // function hello(profile: UserProfileIface, socketId: string) {
    //   console.log("[received] hello", profile, "from", socketId);
    //   const cs = Object.assign({}, roomMembers);
    //   cs[socketId] = {
    //     profile,
    //   };
    //   setRoomMembers(cs);
    //   socket.emit("hello-ack", roomId, myProfile);
    // }
    //
    // /**
    //  * somebody is leaving this session
    //  * @param socketId somebody's socket id
    //  */
    // function bye(socketId: string) {
    //   console.log(
    //     "[received] bye from",
    //     socketId,
    //     "exists?",
    //     !!roomMembers[socketId]
    //   );
    //   if (roomMembers[socketId]) {
    //     const cs = Object.assign({}, roomMembers);
    //     delete cs[socketId];
    //     setRoomMembers(cs);
    //   }
    // }

    /**
     * A card has been updated
     * @param socketId somebody's socket id
     */
    function cardUpdate(cards: Array<CardInfoIface>) {
      console.log(
        "[received] cardupdate ",
        "cards:",
        cards
      );

      setRoomCards(cards);
      // if (roomMembers[socketId]) {
      //   const cs = Object.assign({}, roomMembers);
      //   delete cs[socketId];
      //   setRoomMembers(cs);
      // }
    }

    socket.on("disconnect", disconnect);
    // socket.on("hello", hello);
    // socket.on("bye", bye);
    socket.on("card-update", cardUpdate);

    return () => {
      socket.off("disconnect", disconnect);
      // socket.off("hello", hello);
      // socket.off("bye", bye);
      socket.off("card-update", cardUpdate);
    };
  }, [socket, myProfile, roomId, roomCards]);

  const join = useCallback(
    (roomId: string) => {
      if (!roomId || !myProfile) {
        return;
      }
      setRoomId(roomId);
      setRoomCards([]);
      socket.emit("hello", roomId, myProfile);
      console.log("[sent] hello in", roomId);
    },
    [myProfile, socket]
  );

  const leave = useCallback(() => {
    if (socket && roomId) {
      socket.emit("bye", roomId);
      console.log("[sent] bye in", roomId);
    }
    setRoomCards([]);
    setRoomId(null);
  }, [socket, roomId]);

  const card = useCallback(
    (profile: UserProfileIface, card: string) => {
      if (!socket || !roomId) {
        return;
      }
      socket.emit("card", roomId, myProfile, card);
      console.log("[sent] card", profile, card);
    },
    [socket, roomId]
  );

  const data: SocketIface = Object.freeze({
    roomId,
    socket,
    roomCards,
    join,
    leave,
    card,
  });

  return (
    <SocketContext.Provider value={data}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
