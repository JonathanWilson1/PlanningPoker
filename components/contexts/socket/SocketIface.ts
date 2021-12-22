import { Socket } from "socket.io-client";

import { RoomMembersIface } from "./RoomMembersIface";
import { UserProfileIface } from "../../../shared/UserProfileIface";
import { CardInfoIface } from "../../../shared/CardInfoIface";

export interface SocketIface {
  readonly socket: typeof Socket;
  readonly roomId: string;
  readonly roomCards: CardInfoIface[];
  join(roomId: string): void;
  leave(): void;
  card(profile: UserProfileIface, card: string): void;
}
