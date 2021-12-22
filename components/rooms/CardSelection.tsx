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

  const style = { background: '#0092ff', margin: '5px 5px', height: 200, width: '100%', fontSize: 60 };

  return (
    <section>
      <div className="cardz-selection-list">
      {[0,1,2,3,5, 8, 13, 21, 34, 55, 89].map(function(object, i){
      return <div className="cardz-selection" onClick={() => selectNumber(object)}>
        <div class="cardz_image">
          <img src="https://images.pexels.com/photos/1819650/pexels-photo-1819650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
        </div>
        <div class="cardz_title title-white">
          <p></p>
        </div>
        <div class="cardz_main_title title-white">
        <p>{object}</p>
        </div>
      </div>
       })}
      </div>
    </section>
  );
};
