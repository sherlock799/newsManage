import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Space, Button,Modal,Tooltip,Tree } from 'antd';
import { 
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
const { confirm } = Modal;

export default function RoleList() {

  const [rightlist, setrightlist] = useState([])
  const [currentrights, setcurrentrights] = useState([])
  const [currentid, setcurrentid] = useState(0)
  const [rolelist, setrolelist] = useState([])
  const [flag, setflag] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const confilmM=(item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        deleteM(item)
      },
      onCancel() {
      },
    });
  }

  const deleteM=(item)=>{
    axios.delete(`/roles/${item.id}`)
    .then(()=>{setflag(!flag)})
  }

  const onCheck = (checkedKeys) => {
    setcurrentrights(checkedKeys.checked)
  };

  const handleOk = ()=>{
    setIsModalVisible(false)
    // setrolelist(rolelist.map(
    //   item=>{
    //     if(item.id===currentid){
    //       return {
    //         ...item,
    //         rights:currentrights
    //       }
    //     }
    //     return item
    //   }
    // ))
    axios.patch(`/roles/${currentid}`,{
      rights:currentrights
    })
    .then(()=>{setflag(!flag)})
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => <a>{text}</a>,
    },
    {
      title: '用户名',
      dataIndex: 'roleName',
      key: 'title',
    },
    {
      title: '操作',
      render: (item) => (
        <Space size="middle">
          <Tooltip title="查看权限">
            <Button shape="circle" icon={<EditOutlined />} onClick={()=>{
              setIsModalVisible(true)
              setcurrentrights(item.rights)
              setcurrentid(item.id)
            }}/>
          </Tooltip>
          <Tooltip title="删除">
            <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>confilmM(item)}/>
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axios.get("/roles")
    .then(res=>{
      setrolelist(res.data)
    })
  }, [flag])

  useEffect(() => {
    axios.get("/rights?_embed=children")
    .then(res=>{
      setrightlist(res.data)
    })
  }, [])
  
  return (
    <div>
      <Table 
        pagination={{pageSize:5}} 
        columns={columns} 
        dataSource={rolelist} 
        rowKey={(item)=>item.id} 
        locale={{emptyText: ' ' }}
      />
      <Modal title="Basic Modal" visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={()=>{setIsModalVisible(false)}}>
        <Tree
          checkStrictly
          checkable
          checkedKeys={currentrights}
          treeData={rightlist}
          onCheck={onCheck}
        />
      </Modal>
    </div>
  )
}
