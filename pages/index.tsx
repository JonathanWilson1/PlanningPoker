import { NextPage } from "next";
import Link from "next/link";
import { Rooms } from "../components/index/Rooms";
import { useRef, useCallback } from "react";
import { Refreshable } from "../components/Refreshable";
import { Button, Row, Col } from "antd";
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import "antd/dist/antd.css";

const page: NextPage = () => {
  const ref = useRef<Refreshable>();

  const handleRefresh = useCallback(
    () => ref.current && ref.current.refresh(),
    [ref.current]
  );

  return (
    <Layout>
      <Row type="flex" align="middle">
        <Col>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}>
            <Link href="/new">
              <Button type="primary" style={{ marginLeft: 8 }}>
                    New Game
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default page;
