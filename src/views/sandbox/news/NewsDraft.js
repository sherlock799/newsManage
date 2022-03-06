import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Space, Button,Modal,Tooltip, notification } from 'antd';
import { 
  DeleteOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  EditOutlined
} from '@ant-design/icons';
const { confirm } = Modal;

export default function NewsDraft(props) {

  const [draftlist, setdraftlist] = useState([])
  const [flag, setflag] = useState(false)
  const {username} = JSON.parse(localStorage.getItem('token'))

  const confilmM=(item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        deleteM(item.id)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const deleteM=(id)=>{
      axios.delete(`/news/${id}`)
      .then(()=>{setflag(!flag)})
  }

  const publishM=(id)=>{
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then((res) => {
      props.history.push('/audit-manage/list')
      notification.open({
        message: '通知',
        description:`新闻已提交审核`,
        placement: 'bottomRight'
      });
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => <b>{text}</b>,
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title,item)=> <a href={`#news-manage/preview/${item.id}`}>{title}</a>
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category)=>category.title
    },
    {
      title: '操作',
      render: (item) => (
        <Space size="middle">
          <Tooltip title=" 编辑">
            <Button shape="circle" icon={<EditOutlined />} 
              onClick={()=>{
                props.history.push(`/news-manage/update/${item.id}`)
              }}
            />
          </Tooltip>
          <Tooltip title="提交审核">
            <Button 
              type='primary' 
              shape="circle" 
              icon={<UploadOutlined/>} 
              onClick={()=>publishM(item.id)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>confilmM(item)}/>
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`)
    .then(res=>{
      let list = res.data
      setdraftlist(list)
    })
  }, [username,flag])
  
  return (
    <div>
      <Table 
        pagination={{pageSize:5}} 
        columns={columns} 
        dataSource={draftlist} 
        rowKey={(item)=>item.id}
        locale={{emptyText: ' ' }}
      />
    </div>
  )
}
