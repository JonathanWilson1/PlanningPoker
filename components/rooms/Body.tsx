import { FC } from "react";

import { useRoomState } from "../contexts/socket/useRoomState";
import { JoinRoomForm } from "./JoinRoomForm";
import { ActiveCardsList } from "./ActiveCardsList";
import { CardSelection } from "./CardSelection";

interface IProps {
  roomId: string;
}

export const Body: FC<IProps> = ({ roomId }) => {
  const { joined } = useRoomState();
  return (
    <div>
      <JoinRoomForm roomId={roomId} />
      {joined && (
        <>
          <ActiveCardsList />
          <CardSelection />
        </>
      )}
    </div>
  );
};
