import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Tag, Space, Button,Modal,Switch,Tooltip } from 'antd';
import { 
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal;

export default function RightList() {

  const [rightlist, setrightlist] = useState([])
  const [flag, setflag] = useState(false)

  const confilmM=(item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        deleteM(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const deleteM=(item)=>{
    if (item.grade===1) {
      axios.delete(`/rights/${item.id}`)
      .then(()=>{setflag(!flag)})
    }else{
      axios.delete(`/children/${item.id}`)
      .then(()=>{setflag(!flag)})
    }
  }
  const switchM=(item)=>{
    let switchFlag = item.pagepermisson===1?0:1
    if (item.grade===1) {
      axios.patch(`/rights/${item.id}`,{pagepermisson:switchFlag})
      .then(()=>{setflag(!flag)})
    }else{
      axios.patch(`/children/${item.id}`,{pagepermisson:switchFlag})
      .then(()=>{setflag(!flag)})
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => <a>{text}</a>,
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'address',
      render: (address)=>{
        return <Tag color="gold">{address}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => (
        <Space size="middle">
          <Tooltip title="配置">
            <Switch 
              checked={item.pagepermisson} 
              disabled={item.pagepermisson===undefined} 
              onChange={()=>switchM(item)}/>
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              danger 
              shape="circle" 
              icon={<DeleteOutlined/>} 
              onClick={()=>confilmM(item)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axios.get("/rights?_embed=children")
    .then(res=>{
      let list = res.data
      list.forEach(item => {
        if(item.children.length===0){
          item.children=null
        }
      });
      setrightlist(list)
    })
  }, [flag])
  
  return (
    <div>
      <Table 
        pagination={{pageSize:5}} 
        columns={columns} 
        dataSource={rightlist} 
        rowKey={(item)=>item.id}
        locale={{emptyText: ' ' }}
      />
    </div>
  )
}
