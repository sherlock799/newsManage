import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from '../home/Home'
import RightList from '../right-manage/RightList'
import RoleList from '../role-manage/RoleList'
import UserList from '../user-manage/UserList'
import NoPermission from '../nopermission/NoPermission'
import NewsAdd from '../news/NewsAdd'
import NewsDraft from '../news/NewsDraft'
import NewsCategory from '../news/NewsCategory'
import AuditList from '../audit/AuditList'
import Audit from '../audit/Audit'
import Unpublished from '../publish/Unpublished'
import Published from '../publish/Published'
import Sunset from '../publish/Sunset'
import axios from 'axios'
import NewsPreview from '../news/NewsPreview'
import NewsUpdate from '../news/NewsUpdate'
import { Spin } from 'antd'
import { connect } from 'react-redux'


const LocalRouterMap = {
  "/home":Home,
  "/user-manage/list":UserList,
  "/right-manage/role/list":RoleList,
  "/right-manage/right/list":RightList,
  "/news-manage/add":NewsAdd,
  "/news-manage/draft":NewsDraft,
  "/news-manage/category":NewsCategory,
  "/news-manage/preview/:id":NewsPreview,
  "/news-manage/update/:id":NewsUpdate,
  "/audit-manage/audit":Audit,
  "/audit-manage/list":AuditList,
  "/publish-manage/unpublished":Unpublished,
  "/publish-manage/published":Published,
  "/publish-manage/sunset":Sunset
}

function NewsRouter(props) {

  const [routeList, setrouteList] = useState([])

  const checkRoute=(item)=>{
    return LocalRouterMap[item.key] && (item.pagepermisson||item.routepermisson)
  }
  const checkUser=()=>{
    return true
  }
  useEffect(() => {
    Promise.all([
      axios.get("/rights"),
      axios.get("/children"),
    ]).then(res=>{
      setrouteList([...res[0].data,...res[1].data])
    })
  }, [])
  
  return (
    <Spin tip="Loading..." size="large" spinning={props.isLoading}>
      <Switch>
        {
          routeList.map(item=>{
            if (checkRoute(item) && checkUser(item)) {
              return(
                <Route
                  exact 
                  key={item.key} 
                  path={item.key} 
                  component={LocalRouterMap[item.key]} 
                />)
            }
            return null
          })
        }
        <Redirect from='/' to='/home' exact />
        { routeList.length>0 && <Route path='*' component={NoPermission} />}
      </Switch>
    </Spin>
  )
}

const mapStateToProps=({LoadingReducer})=>{
  return {
    isLoading:LoadingReducer.isLoading
  }
}
const mapDispatchToProps={
  changeCollapsed(){
    return{
      type:'change_loading'
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(NewsRouter)


