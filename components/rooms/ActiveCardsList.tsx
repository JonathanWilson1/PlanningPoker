import { FC, useContext } from "react";

import UserProfileContext from "../contexts/profile/UserProfileContext";
import SocketContext from "../contexts/socket/SocketContext";
import { Card, Button, Row, Col } from "antd";

export const ActiveCardsList: FC = () => {
  const profile = useContext(UserProfileContext);
  const socket = useContext(SocketContext);

  return (
    <section>
      <div className="cardz-list border-radius">
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
          return <div className="cardz theme-border center-container border-radius">
            <div className="cardz_main_title center">
              {user.card}
            </div>
            <div className="cardz-name-center">
              {user.userName}
            </div>
          </div>

        })
      }
      </div>
    </section>
  );
};
