import React from "react";
import { Layout } from "antd";
// import ContentMain from "./Content_main";
import ContentMain from './Main_content'

const { Content } = Layout;
class Home extends React.Component {
  render() {
    return (
      <Layout
        className="Home"
        style={{ minHeight: "100vh" }}
        key="layoutContents"
      >
        <Content>
          <ContentMain />
        </Content>
      </Layout>
    );
  }
}
export default Home;
