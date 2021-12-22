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
      <Row>
      <div class="cards-list">

<div class="cardz">
  <div class="card_image"> <img src="https://i.redd.it/b3esnz5ra34y.jpg" /> </div>
  <div class="card_title title-white">
    <p>Card Title</p>
  </div>
</div>

  <div class="card 2">
  <div class="card_image">
    <img src="https://cdn.blackmilkclothing.com/media/wysiwyg/Wallpapers/PhoneWallpapers_FloralCoral.jpg" />
    </div>
  <div class="card_title title-white">
    <p>Card Title</p>
  </div>
</div>

<div class="card 3">
  <div class="card_image">
    <img src="https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif" />
  </div>
  <div class="card_title">
    <p>Card Title</p>
  </div>
</div>

  <div class="card 4">
  <div class="card_image">
    <img src="https://media.giphy.com/media/LwIyvaNcnzsD6/giphy.gif" />
    </div>
  <div class="card_title title-black">
    <p>Card Title</p>
  </div>
  </div>

</div>
        {
          Object.values(socket.roomCards).map(function(user) {
            return <Col><Card style={style}>{user.userName}-{user.card}</Card></Col>
          })
        }
      </Row>
    </section>
  );
};
