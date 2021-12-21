import {
  FC,
  useContext,
  useCallback,
  ChangeEvent,
  useState,
  FormEvent,
} from "react";

import UserProfileContext from "../contexts/profile/UserProfileContext";
import SocketContext from "../contexts/socket/SocketContext";
import { Card, Button, Row, Col } from "antd";

export const SendTextForm: FC = () => {
  const socket = useContext(SocketContext);
  const profile = useContext(UserProfileContext);

  const selectNumber = (test) => {
    if (!socket || test.length <= 0) { return; }
    socket.card(profile, test);
  }

  const style = { background: '#0092ff', margin: '5px 5px', height: 200, width: '100%', fontSize: 60 };

  return (
    <Row>
      {[0,1,2,3,5, 8, 13, 21, 34, 55, 89].map(function(object, i){
      return <Col>
                <Button style={style} onClick={() => selectNumber(object)}>
                      {object}
                </Button>
              </Col>
       })}
    </Row>

  );
};
