import { NextPage } from "next";
import Link from "next/link";
import Image from 'next/image'
import { Rooms } from "../components/index/Rooms";
import { useRef, useCallback } from "react";
import { Refreshable } from "../components/Refreshable";
import { Row, Col } from "antd";
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
// import "antd/dist/antd.css";
import { v4 as uuidv4 } from "uuid";
import image from '../public/Team work-bro.png';

const page: NextPage = () => {
  const ref = useRef<Refreshable>();
  const uuid = uuidv4();

  const handleRefresh = useCallback(
    () => ref.current && ref.current.refresh(),
    [ref.current]
  );

  return (
<Layout>

<div className="center-container" style={{height: "100vh"}}>
<div className="center text">
<Row>
<Col className="center-container" xs={24} sm={24} md={24} lg={12}>
<h1>Planning Poker for agile teams</h1>
<ul>
<li>Free to use with no sign up</li>
<li>Unlimited users and rooms</li>
<li>Simple and fast</li>
<li>Open source</li>
</ul>
<Link href={"/rooms/" + uuid}>
  <button id="create-button">Create New Room</button>
</Link>
</Col>
<Col className="center-container" xs={24} sm={24} md={24} lg={12}>
<Image id="index-banner-image" src={image} alt="People illustrations by Storyset" width={400} height={400}/>
<a href="https://storyset.com/people">Image by Storyset</a>
  </Col>

</Row>

</div>
</div>
</Layout>
  );
};

export default page;
