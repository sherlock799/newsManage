import { notification } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom'

function usePublish(type) {

  const [dataSouce, setDataSouce] = useState([])
  const history = useHistory()
  const {username} = JSON.parse(localStorage.getItem('token'))

  const publishM=(item)=>{
    axios.patch(`/news/${item.id}`,{
      publishState:2,
      publishTime:Date.now()
    }).then(()=>{
      history.push(`/publish-manage/published`)
      notification.open({
        message: '通知',
        description:`您的新闻<${item.title}>已发布`,
        placement: 'bottomRight'
      })
    })
  }
  const sunsetM=(item)=>{
    axios.patch(`/news/${item.id}`,{
      publishState:3,
    }).then(()=>{
      history.push(`/publish-manage/sunset`)
      notification.open({
        message: '通知',
        description:`您的新闻<${item.title}>已下线`,
        placement: 'bottomRight'
      })
    })
  }

  const deleteM=(item)=>{
    setDataSouce(dataSouce.filter(i=>i.id!==item.id))
    axios.delete(`/news/${item.id}`)
    .then(()=>{
      notification.open({
      message: '通知',
      description:`您的新闻<${item.title}>已删除`,
      placement: 'bottomRight'
      })
    })
  }

  useEffect(() => {
    axios.get(`/news?author=${username}&publishState=${type}&_expand=category`)
    .then(res=>{
      setDataSouce(res.data);
    })
  }, [username,type])
  
  return {dataSouce,publishM,sunsetM,deleteM}
}
export default usePublish