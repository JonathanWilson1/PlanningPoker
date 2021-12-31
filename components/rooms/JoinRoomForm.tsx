import { FC, useContext, useCallback, ChangeEvent, FormEvent } from "react";

import UserProfileContext from "../contexts/profile/UserProfileContext";
import SocketContext from "../contexts/socket/SocketContext";
import { useRoomState } from "../contexts/socket/useRoomState";

interface IProps {
  roomId: string;
}

export const JoinRoomForm: FC<IProps> = ({ roomId }) => {
  const profile = useContext(UserProfileContext);
  const socket = useContext(SocketContext);
  const { joinable, joined } = useRoomState();

  /**
   * join the room with the specified name
   */
  const handleJoin = useCallback(() => {
    if (!joinable) {
      return;
    }
    socket.join(roomId);
  }, [joinable, socket, roomId]);

  /**
   * leave the current room
   */
  const handleLeave = useCallback(() => {
    socket.leave();
  }, [socket]);

  /**
   * update user name
   */
  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      profile.name = e.target.value;
    },
    [profile]
  );

  /**
   * handle form submission (call join)
   */
  const handleSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      handleJoin();
    },
    [handleJoin]
  );

  return (
    <section>
      {joined ? (
        <section>
          <button onClick={handleLeave}>Leave</button>
        </section>
      ) : (
        <section className="center-container center-text" style={{height: 700}}>
          <form onSubmit={handleSubmit} className="center">
              <h1>Join Planning Poker Room</h1>
              <code>{roomId}</code>
              <p>Enter your name and hit button to join this room</p>

              <input
                type="text"
                value={profile?.name || ""}
                onChange={handleNameChange}
                placeholder="Name"
              />
              <button onClick={handleJoin} disabled={!joinable}>
                Join
              </button>
          </form>
        </section>

      )}
    </section>
  );
};
