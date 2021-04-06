import { Tree, Row } from "antd";
import React from "react";
import { DownOutlined } from "@ant-design/icons";
import "./TreeMenu.css";
import emitter from "./util/events";

class TreeMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      treeMenu: [],
      searchValue: "",
      autoExpandParent: true,
      parentTask: "",
      solutionName: "",
    };
  }
  componentDidMount() {
    //组件渲染后创建
    this.timer = setInterval(() => {
      fetch("http://localhost:8000/direction/")
        .then((res) => res.json())
        .then((res) => {
          // console.log('>>>>>res',res);
          this.setState({ treeMenu: res });
        })
        .catch((e) => {
          console.error(e);
        });
    }, 1000);
  }

  componentWillUnmount() {
    //组件销毁前移除
    clearInterval(this.timer);
  }

  onSelect = (selectedKeys, info) => {
    if (info.node.props.eventKey.split(",")[0] === "solution") {
      emitter.emit(
        "changeconfigName",
        info.node.props.eventKey.split(",")[1] +
          " / " +
          info.node.props.eventKey.split(",")[2]
      );
    }
  };

  getTreeMenu = (data) =>
    data.map((item) => {
      const title = <span>{item.name}</span>;
      if (item.children) {
        return {
          title,
          key: `${item.property},` + `${item.name}`,
          children: this.getTreeMenu(item.children),
        };
      }
      if (item.property === "solution") {
        return {
          title,
          key: `${item.property},` + `${item.parent_task},` + `${item.name}`,
        };
      } 
      else {
        return {
          title,
          key: `${item.property},` + `${item.name}`,
        };
      }
    });
  
  render() {
    return [
      <Row className='outline-tree-menu'>
        <Tree
          className="treeMenu"
          showLine
          switcherIcon={<DownOutlined />}
          onSelect={this.onSelect}
          treeData={this.getTreeMenu(this.state.treeMenu)}
          defaultExpandAll
        />
      </Row>,
    ];
  }
}

export default TreeMenu;
