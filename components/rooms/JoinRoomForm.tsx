import { FC, useContext, useCallback, useState, ChangeEvent, FormEvent } from "react";

import UserProfileContext from "../contexts/profile/UserProfileContext";
import SocketContext from "../contexts/socket/SocketContext";
import { useRoomState } from "../contexts/socket/useRoomState";
import { Modal } from "antd";

interface IProps {
  roomId: string;
}

export const JoinRoomForm: FC<IProps> = ({ roomId }) => {
  const profile = useContext(UserProfileContext);
  const socket = useContext(SocketContext);
  const { joinable, joined } = useRoomState();
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const showModal = () => {
   setIsModalVisible(true);
 };

 const handleOk = () => {
   setIsModalVisible(false);
 };

 const handleCancel = () => {
   setIsModalVisible(false);
 };

 const handleFocus = (event) => {
   event.target.select();
 };

  return (
    <section>
      {joined ? (
        <section>
          <button onClick={handleLeave} id="leave-button">Leave</button>
          <button onClick={showModal} id="invite-button">Invite Players</button>
          <Modal title="Invite players" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
            footer={[
              <button key="back" onClick={() => {navigator.clipboard.writeText(window.location.href)}}>
                Copy invitation link
              </button>,
            ]}>
            <code onFocus={handleFocus}>{window.location.href}</code>
          </Modal>
        </section>
      ) : (
        <section className="center-container center-text" style={{height: 700}}>
          <form onSubmit={handleSubmit} className="center">
              <h1>Join Planning Poker Room</h1>
              <code>{roomId}</code>
              <br/>
              <p>Enter your name and hit the button to join this room</p>

              <input
                type="text"
                value={profile?.name || ""}
                onChange={handleNameChange}
                placeholder="Name"
                id="join-input"
              />
              <button onClick={handleJoin} disabled={!joinable} id="join-button">
                Join
              </button>
          </form>
        </section>

      )}
    </section>
  );
};
