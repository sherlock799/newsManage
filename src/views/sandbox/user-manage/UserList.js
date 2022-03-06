import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Table, Space, Button,Modal, Switch} from 'antd';
import { 
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import UserForm from './UserForm';
const { confirm } = Modal;


export default function UserList(props) {

  const [userlist, setuserlist] = useState([])
  const [rolelist, setrolelist] = useState([])
  const [regionlist, setregionlist] = useState([])
  const [flag, setflag] = useState(false)
  const [isAddVisible, setisAddVisible] = useState(false)
  const [isEditVisible, setisEditVisible] = useState(false)
  const [isEditDisabled, setisEditDisabled] = useState(false)
  const [currentEdit, setcurrentEdit] = useState(null)
  const addForm = useRef(null)
  const editForm = useRef(null)
  const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))

  const confilmM=(item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '',
      onOk() {deleteM(item)},
      onCancel() {},
    });
  }
  const deleteM=(item)=>{
    axios.delete(`/users/${item.id}`)
    .then(()=>{setflag(!flag)})
  }
  const addUserM=()=>{
    addForm.current.validateFields().then(value=>{
      setisAddVisible(false)
      addForm.current.resetFields()
      axios.post("/users",{
        ...value,
        "roleState": true,
        "default": false,
      }).then(()=>{setflag(!flag)})
    })
  }
  const editUserM=()=>{
    editForm.current.validateFields().then(value=>{
      setisEditVisible(false)
      setisEditDisabled(!isEditDisabled)
      editForm.current.resetFields()
      console.log(currentEdit.id);
      axios.patch(`/users/${currentEdit.id}`,value)
      .then(()=>{setflag(!flag)})
    })
  }
  const changeRoleStateM=(item)=>{
    axios.patch(`/users/${item.id}`,{
      roleState:!item.roleState
    }).then(()=>{setflag(!flag)})
  }
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionlist.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
          text:"全球",
          value:"全球"
        }
      ],
      onFilter:(value,item)=>{
        if(value==="全球"){
          return item.region===''
        }
        return item.region===value
      },
      render: region => <b>{region===''?'全球':region}</b>,
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: role => role.roleName 
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState,item)=>(
        <Switch 
          disabled={item.default} 
          checked={roleState}
          onChange={()=>changeRoleStateM(item)}
        />
      ),
    },
    {
      title: '操作',
      render: (item) => (
        <Space size="middle">
            <Button 
              disabled={item.default} 
              shape="circle" 
              icon={<EditOutlined/>}
              onClick={()=>{
                setcurrentEdit(item)
                if (item.roleId===1) {
                  setisEditDisabled(true)
                }else{
                  setisEditDisabled(false)
                }
                setTimeout(() => {
                  setisEditVisible(true)
                  editForm.current.setFieldsValue(item)
                }, 0);
              }}
            />
            <Button 
              danger
              disabled={item.default}  
              shape="circle" icon={<DeleteOutlined/>} 
              onClick={()=>confilmM(item)}
            />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axios.get("/users?_expand=role")
    .then(res=>{
      if(roleId===1){
        setuserlist(res.data)
      }else{
        setuserlist([
        ...res.data.filter(item=>item.username===username),
        ...res.data.filter(item=>item.region===region&&item.roleId===3),
      ])
      }
    })
  }, [flag,roleId,region,username])
  useEffect(() => {
    axios.get("/regions")
    .then(res=>{
      setregionlist(res.data)
    })
    axios.get("/roles")
    .then(res=>{
      setrolelist(res.data)
    })
  }, [])
  
  return (
    <div>
      <Button 
        type='primary' 
        onClick={()=>{setisAddVisible(true)}}
      >
        添加用户
      </Button>
      <Table 
        pagination={{pageSize:5}} 
        columns={columns} 
        dataSource={userlist} 
        rowKey={(item)=>item.id}
        locale={{emptyText: ' ' }}
      />
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={()=>{
          setisAddVisible(false)
        }}
        onOk={() => addUserM()}
      >
        <UserForm 
          ref={addForm} 
          regionlist={regionlist} 
          rolelist={rolelist} 
        />
      </Modal>

      <Modal
        visible={isEditVisible}
        title="修改用户"
        okText="确定"
        cancelText="取消"
        onCancel={()=>{
          setisEditVisible(false)
          setisEditDisabled(!isEditDisabled)
        }}
        onOk={() => editUserM()}
      >
        <UserForm 
          ref={editForm} 
          regionlist={regionlist} 
          rolelist={rolelist} 
          isEditDisabled={isEditDisabled}
          isUpdate={true}
        />
      </Modal>
    </div>
  )
}
