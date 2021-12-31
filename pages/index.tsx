import { NextPage } from "next";
import Link from "next/link";
import { Rooms } from "../components/index/Rooms";
import { useRef, useCallback } from "react";
import { Refreshable } from "../components/Refreshable";
import { Button, Row, Col } from "antd";
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
// import "antd/dist/antd.css";
import { v4 as uuidv4 } from "uuid";

const page: NextPage = () => {
  const ref = useRef<Refreshable>();
  const uuid = uuidv4();

  const handleRefresh = useCallback(
    () => ref.current && ref.current.refresh(),
    [ref.current]
  );

  return (
    <Layout>
      <Link href={"/rooms/" + uuid}>
        <Button type="primary" style={{ marginLeft: 8 }}>
              New Game
        </Button>
      </Link>
    </Layout>
  );
};

export default page;
