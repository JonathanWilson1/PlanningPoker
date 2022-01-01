import { FC, useContext } from "react";

import UserProfileContext from "../contexts/profile/UserProfileContext";
import SocketContext from "../contexts/socket/SocketContext";
import TextTransition, { presets } from "react-text-transition";
import { CardStatus } from "../../shared/CardStatusEnum";

export const ActiveCardsList: FC = () => {
  const profile = useContext(UserProfileContext);
  const socket = useContext(SocketContext);

  const renderSwitch = (cardInfo) => {
    console.log("Card", cardInfo.cardStatus)
    switch(cardInfo.cardStatus) {
      case CardStatus.Waiting:
        return CardStatus.Waiting;
      case CardStatus.Selected:
        return CardStatus.Selected;
      case CardStatus.Revealed:
        return <TextTransition
          text={cardInfo.card}
          springConfig={ presets.gentle }
        />;
      default:
        return CardStatus.Error;
    }
  };

  const sortedRoomCardInfos = () => {
    return Object.values(socket.roomCardInfos)
    .sort(function(a, b) {
      if (a.userName < b.userName)
        return -1;
      if (a.userName > b.userName)
        return 1;
      return 0;
    })
  };

  const handleReveal = () => {
    socket.reveal();
  };

  const handleReset = () => {
    socket.reset();
  };

  return (
    <section id="active-cardz-section">
      <div className="cardz-list border-radius">
      {
        sortedRoomCardInfos().map(function(cardInfo) {
          return <div key={cardInfo.socketId} className="cardz theme-border center-container border-radius">
            <div className="cardz-main-title center">
              {renderSwitch(cardInfo)}
            </div>
            <div className="cardz-name-center">
              {cardInfo.userName}
            </div>
          </div>
        })
      }
      </div>
      <div className="center-container-row">
        <button onClick={handleReveal} id="reveal-button">Reveal Cards</button>
        <button onClick={handleReset} id="reset-button">Reset Cards</button>
      </div>
    </section>
  );
};
