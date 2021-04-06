import React from "react";
import { Row, Col, Layout } from "antd";
import "antd/dist/antd.css";
import TreeMenu from "./TreeMenu";
import GPUView from "./GPU_view";
// import TestWebsocket from './test'
import ThirdLayout from './ThireLayout';
import ParameterSet from "./ParaSet";
// import Testpost from "./testpost";




const { Content } = Layout;
class ContentMain extends React.Component {
  render() {
    return (
      <Layout key="mainLayout">
        <Content key="mainContent">
          <Row key="mainRow">
            <Col key={"colTreeMenu"} xs={0} sm={0} lg={4} xl={4} xxl={4}>
              <TreeMenu  key='treeMenu'/>
            </Col>
            <Col key={"colparameterSet"} xs={24} sm={14} lg={10} xl={10} xxl={10} >
              <ParameterSet  key={'parameterSet'} />
              {/*<Testpost key={'test'}/>*/}
            </Col>
            <Col key={"colGpuView"} xs={0} sm={10} lg={10} xl={10} xxl={10} >
              <ThirdLayout key={'thirdLayout'}/>
              {/* {Test} */}
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

export default ContentMain;
