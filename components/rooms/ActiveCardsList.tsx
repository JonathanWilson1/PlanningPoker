import { FC, useContext } from "react";

import UserProfileContext from "../contexts/profile/UserProfileContext";
import SocketContext from "../contexts/socket/SocketContext";
import TextTransition, { presets } from "react-text-transition";

export const ActiveCardsList: FC = () => {
  const profile = useContext(UserProfileContext);
  const socket = useContext(SocketContext);

  return (
    <section id="active-cardz-section">
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
            <div className="cardz-main-title center">
              <TextTransition
                text={user.card}
                springConfig={ presets.wobbly }
              />
            </div>
            <div className="cardz-name-center">
              {user.userName}
            </div>
          </div>
        })
      }
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
            <div className="cardz-main-title center">
              <TextTransition
                text={user.card}
                springConfig={ presets.wobbly }
              />
            </div>
            <div className="cardz-name-center">
              {user.userName}
            </div>
          </div>
        })
      }      {
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
                  <div className="cardz-main-title center">
                    <TextTransition
                      text={user.card}
                      springConfig={ presets.wobbly }
                    />
                  </div>
                  <div className="cardz-name-center">
                    {user.userName}
                  </div>
                </div>
              })
            }      {
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
                        <div className="cardz-main-title center">
                          <TextTransition
                            text={user.card}
                            springConfig={ presets.wobbly }
                          />
                        </div>
                        <div className="cardz-name-center">
                          {user.userName}
                        </div>
                      </div>
                    })
                  }
      </div>
      <div className="center-container-row">
        <button id="reveal-button">Reveal Cards</button>
        <button id="reset-button">Reset Cards</button>
      </div>
    </section>
  );
};
