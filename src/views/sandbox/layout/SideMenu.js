import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import {
  KeyOutlined,
  HomeOutlined,
  ExportOutlined,
  FileTextOutlined,
  FormOutlined,
  TeamOutlined
} from '@ant-design/icons';
import './layout.css'
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
const { Sider } = Layout;
const { SubMenu } = Menu

const iconList = {
  "/home":<HomeOutlined />,
  "/user-manage":<TeamOutlined />,
  "/right-manage":<KeyOutlined />,
  "/news-manage":<FileTextOutlined />,
  "/audit-manage":<FormOutlined />,
  "/publish-manage":<ExportOutlined />,
}

function SideMenu(props) {

  const [list, setList] = useState([])
  const selectKeys = [ props.location.pathname ]
  const openKeys = [ "/" + props.location.pathname.split("/")[1]]
  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    axios.get("/rights?_embed=children")
    .then(res=>{
      setList(res.data)
    })
  }, [])
  
  const renderMenu=(list)=>{
    return list.map(item=>{
      if (item.pagepermisson===undefined || item.pagepermisson===0) {
        return null
      } 
      if(rights.includes(item.key)){
        if(item.children?.length>0){
          return  <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                    {renderMenu(item.children)}
                  </SubMenu>
        }
        return  <Menu.Item 
                  key={item.key} 
                  icon={iconList[item.key]} 
                  onClick={()=>{props.history.push(item.key)}}>
                  {item.title}
                </Menu.Item>
      }
      return null
    })
  }

  return (
      <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
        <div style={{display:"flex",height:"100%",flexDirection:"column"}}>
          <div className='logo'>全球新闻管理系统</div>
          <div style={{flex:1,overflow:"auto"}}>
            <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
              { renderMenu(list) }
            </Menu>
          </div>
        </div>
      </Sider>
  )
}

const mapStateToProps=({CollapsedReducer})=>{
  return {
    isCollapsed:CollapsedReducer.isCollapsed
  }
}
export default connect(mapStateToProps)(withRouter(SideMenu))