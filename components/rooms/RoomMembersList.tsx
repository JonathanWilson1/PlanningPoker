import { FC, useContext } from "react";

import UserProfileContext from "../contexts/profile/UserProfileContext";
import SocketContext from "../contexts/socket/SocketContext";
import { Card, Button, Row, Col } from "antd";

export const RoomMembersList: FC = () => {
  const profile = useContext(UserProfileContext);
  const socket = useContext(SocketContext);
  const styleUser = { background: 'red', margin: '5px 5px', height: 200, width: '100%', fontSize: 60 };
  const style = { background: '#0092ff', margin: '5px 5px', height: 200, width: '100%', fontSize: 60 };


  return (
    <section>
      <Row>
        <Col><Card style={styleUser}>{profile.name}</Card></Col>
        {
          Object.values(socket.roomMembers).map(function(user) {
            return <Col><Card style={style}>{user.profile.name}</Card></Col>
          })
        }
      </Row>
    </section>
  );
};
