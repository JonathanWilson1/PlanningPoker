import { FC, useState, useEffect, useCallback, useContext } from "react";
import SocketIO, { Socket } from "socket.io-client";

import UserProfileContext from "../profile/UserProfileContext";
import { UserProfileIface } from "../../../shared/UserProfileIface";
import { CardInfoIface } from "../../../shared/CardInfoIface";
import { CardStatus } from "../../../shared/CardStatusEnum";

import SocketContext from "./SocketContext";
import { SocketIface } from "./SocketIface";
import { RoomMembersIface } from "./RoomMembersIface";

const SocketProvider: FC = ({ children }) => {
  const [socket, setSocket] = useState<typeof Socket>(null);
  const [roomId, setRoomId] = useState<string>(null);
  const myProfile = useContext(UserProfileContext);
  const [roomCardInfos, setRoomCardInfos] = useState<Array<CardInfoIface>>([]);

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
        setRoomCardInfos([]);
        join(roomId);
      });
    }

    /**
     * A card has been updated
     * @param socketId somebody's socket id
     */
    function cardUpdate(cardInfos: Array<CardInfoIface>) {
      console.log(
        "[received] cardupdate ",
        "cards:",
        cardInfos
      );

      setRoomCardInfos(cardInfos);
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
  }, [socket, myProfile, roomId, roomCardInfos]);

  const join = useCallback(
    (roomId: string) => {
      if (!roomId || !myProfile) {
        return;
      }
      setRoomId(roomId);
      setRoomCardInfos([]);
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
    setRoomCardInfos([]);
    setRoomId(null);
  }, [socket, roomId]);

  const card = useCallback(
    (profile: UserProfileIface, card: string) => {
      if (!socket || !roomId) {
        return;
      }
      socket.emit("card", roomId, myProfile, card, CardStatus.Selected);
      console.log("[sent] card", profile, card);
    },
    [socket, roomId]
  );

  const reveal = useCallback(() => {
      if (!socket || !roomId) {
        return;
      }
      socket.emit("reveal", roomId);
      console.log("[sent] reveal", roomId);
    },
    [socket, roomId]
  );

  const reset = useCallback(() => {
      if (!socket || !roomId) {
        return;
      }
      socket.emit("reset", roomId);
      console.log("[sent] reset", roomId);
    },
    [socket, roomId]
  );

  const data: SocketIface = Object.freeze({
    roomId,
    socket,
    roomCardInfos,
    join,
    leave,
    card,
    reveal,
    reset,
  });

  return (
    <SocketContext.Provider value={data}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
