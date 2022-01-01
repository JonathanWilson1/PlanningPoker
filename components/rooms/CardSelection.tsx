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

export const CardSelection: FC = () => {
  const socket = useContext(SocketContext);
  const profile = useContext(UserProfileContext);

  const selectNumber = (test) => {
    if (!socket || test.length <= 0) { return; }
    socket.card(profile, test);
  }

  return (
      <div className="cardz-selection-list">
      {[0,1,2,3,5, 8, 13, 21, 34, 55, 89, 100, 2001].map(function(object, i){
      return <div key={i} className="cardz cardz-hover theme-border center-container border-radius" onClick={() => selectNumber(object)}>
          <div className="cardz-main-title center">
            {object}
          </div>
        </div>
       })}
      </div>
  );
};
