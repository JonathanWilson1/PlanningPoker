import { FC, useContext } from "react";

import UserProfileContext from "../contexts/profile/UserProfileContext";
import SocketContext from "../contexts/socket/SocketContext";
import { Card, Button, Row, Col } from "antd";

export const ActiveCardsList: FC = () => {
  const profile = useContext(UserProfileContext);
  const socket = useContext(SocketContext);
  const styleUser = { background: 'red', margin: '5px 5px', height: 200, width: '100%', fontSize: 60 };
  const style = { background: '#0092ff', margin: '5px 5px', height: 200, width: '100%', fontSize: 60 };

  return (
    <section>
      <div className="cardz-list">
      {
        Object.values(socket.roomCards)
        .sort(function(a, b) {
          if (a.userName < b.userName)
            return -1;
          if (a.userName > b.userName)
            return 1;
          return 0;
        })
        .map(function(user) {
          return <div className="cardz">
            <div class="cardz_image">
              <img src="https://images.pexels.com/photos/1819650/pexels-photo-1819650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
            </div>
            <div class="cardz_title title-white">
              <p>{user.userName}</p>
            </div>
            <div class="cardz_main_title title-white">
            <p>{user.card}</p>
            </div>
          </div>
        })
      }
      </div>
    </section>
  );
};
