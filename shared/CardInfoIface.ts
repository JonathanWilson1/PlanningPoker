import { CardStatus } from "./CardStatusEnum";

export interface CardInfoIface {
  socketId: string;
  roomName: string;
  userName: string;
  card: string;
  cardStatus: CardStatus;
}
