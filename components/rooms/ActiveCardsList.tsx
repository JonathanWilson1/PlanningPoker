import { FC, useContext } from "react";

import UserProfileContext from "../contexts/profile/UserProfileContext";
import SocketContext from "../contexts/socket/SocketContext";
import TextTransition, { presets } from "react-text-transition";
import { CardStatus } from "../../shared/CardStatusEnum";

export const ActiveCardsList: FC = () => {
  const profile = useContext(UserProfileContext);
  const socket = useContext(SocketContext);

  const renderSwitch = (cardInfo) => {
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

  const onlyNumbers = () => {
    return sortedRoomCardInfos().filter((cardInfo) => {
      return !(isNaN(parseInt(cardInfo.card))) && cardInfo.cardStatus == CardStatus.Revealed
    }).map((cardInfo) => {
      return parseInt(cardInfo.card)
    });
  }

  const average = () => {
    console.log("Average")
    if (onlyNumbers().length == 0) { return }
    console.log("Not empty - " + onlyNumbers().length)
    onlyNumbers().forEach((element) => {
        console.log("Element - " +element)
    })

    return <div> Average - { Math.round(onlyNumbers().reduce((prev, current) => { return prev + current; }, 0) / onlyNumbers().length)} </div>
  };

  const median = () => {
    if (onlyNumbers().length == 0) { return }
    const sorted = onlyNumbers().slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return <div>Median - { Math.round((sorted[middle - 1] + sorted[middle]) / 2)}</div>
    }

    return <div>Median - { Math.round(sorted[middle]) }</div>
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
      <div className="center-container-row">
        <dl>
          <dt>{CardStatus.Waiting} - Waiting for a selection</dt>
          <dt>{CardStatus.Selected} - Value has been selected</dt>
          <dt>{CardStatus.Error} - There has been an error</dt>
        </dl>
      </div>
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

      <br></br>
      <div className="center-container-row">
        <dl>
          <dt>{average()}</dt>
          <dt>{median()}</dt>
        </dl>
      </div>

    </section>
  );
};
