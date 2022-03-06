import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { Table,Tag, Button,notification } from 'antd';

export default function AuditList(props) {

  const [newsList, setNewsList] = useState([])
  const [flag, setflag] = useState(false)
  const {username} = JSON.parse(localStorage.getItem('token'))
  const colorList = ["","orange","green","red"]
  const auditList = ["","审核中","已通过","未通过"]

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title,item) => 
        <a href={`#/news-manage/preview/${item.id}`}>{title}</a>,
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: category=> <div>{category.title}</div>
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState)=> 
        <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
    },
    {
      title: '操作',
      render: (item) => {
        if(item.auditState===1){
          return(
            <div size="middle">
              <Button onClick={()=>revertM(item)}>撤销</Button>
            </div>
          )
        }
        if(item.auditState===2){
          return(
            <div size="middle">
              <Button danger onClick={()=>publishM(item)}>发布</Button>
            </div>
          )
        }
        if(item.auditState===3){
          return(
            <div size="middle">
              <Button type='primary' onClick={()=>updateM(item)}>修改</Button>
            </div>
          )
        }
      }
    },
  ];

  const revertM=(item)=>{
    axios.patch(`/news/${item.id}`,{
      auditState:0
    }).then(res=>{
      setflag(!flag)
      notification.open({
        message: '通知',
        description:`您可以在草稿箱中查看刚刚撤销的新闻`,
        placement: 'bottomRight'
      })
    })
  }

  const updateM=(item)=>{
    props.history.push(`/news-manage/update/${item.id}`)
  }

  const publishM=(item)=>{
    axios.patch(`/news/${item.id}`,{
      publishState:2,
      publishTime:Date.now()
    }).then(()=>{
      setTimeout(() => {
        setflag(!flag)
      props.history.push(`/publish-manage/published`)
      }, 0);
    })
  }

  useEffect(() => {
    axios.get(`/news?author=${username}`
              +`&auditState_ne=0&publishState_lte=1&_expand=category`)
    .then(res=>{
      setNewsList(res.data);
    })
  }, [username,flag])
  
  return (
    <div>
      <Table 
        pagination={{pageSize:5}} 
        columns={columns} 
        dataSource={newsList} 
        rowKey={(item)=>item.id}
        locale={{emptyText: ' ' }}
      />
    </div>
  )
}

