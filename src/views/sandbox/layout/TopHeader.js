import React from 'react'
import { Layout,Menu,Dropdown, Avatar } from 'antd';
import {
  RightOutlined,
  LeftOutlined,
  UserOutlined ,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
const { Header } = Layout;

function TopHeader(props) {

  const history = useHistory()
  const {username,role:{roleName}} = JSON.parse(localStorage.getItem("token"))

  const menu = (
    <Menu>
      <Menu.Item key='1'>
        {roleName}
      </Menu.Item>
      <Menu.Item key='2' danger onClick={()=>{
        localStorage.removeItem("token")
        history.push('/login')
      }}>
        退出
      </Menu.Item>
    </Menu>
  )

  const collapsedM=()=>{
    props.changeCollapsed()
  }
  return (
      <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {props.isCollapsed ? 
              <RightOutlined onClick={collapsedM}/> : 
              <LeftOutlined  onClick={collapsedM}/>}
            <div style={{float:'right'}}>
              欢迎<b style={{color:"#1890ff"}}>{username}</b>回来
              <Dropdown overlay={menu}>
                <a  className="ant-dropdown-link">
                  <Avatar size={36} icon={<UserOutlined />}>
                  </Avatar>
                </a>
              </Dropdown>
            </div>
      </Header>
  )
}

const mapStateToProps=({CollapsedReducer})=>{
  return {
    isCollapsed:CollapsedReducer.isCollapsed
  }
}
const mapDispatchToProps={
  changeCollapsed(){
    return{
      type:'change_collapsed'
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(TopHeader)