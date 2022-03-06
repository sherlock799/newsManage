import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Button, } from 'antd';


export default function Audit() {

  const [newsList, setNewsList] = useState([])
  const [flag, setflag] = useState(false)
  const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))

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
      title: '操作',
      render: (item) => {
          return(
            <div size="middle">
              <Button type='primary' onClick={()=>auditM(item,2,1)}>通过</Button>
              <Button danger onClick={()=>auditM(item,3,0)}>驳回</Button>
            </div>
          )
        }
    }
  ]

  const auditM=(item,auditState,publishState)=>{
    axios.patch(`/news/${item.id}`,{
      auditState,
      publishState
    }).then(()=>setflag(!flag))
  }

  useEffect(() => {
    axios.get("/news?auditState=1&_expand=category")
      .then(res => {
        if (roleId === 1) {
          setNewsList(res.data)
        } else {
          setNewsList([
            ...res.data.filter(item => item.author === username),
            ...res.data.filter(item => item.region === region && item.roleId === 3),
          ])
        }
      })
  }, [flag, roleId, region, username])

  return (
    <div>
      <Table
        pagination={{ pageSize: 5 }}
        columns={columns}
        dataSource={newsList}
        rowKey={(item) => item.id}
        locale={{emptyText: ' ' }}
      />
    </div>
  )
}
