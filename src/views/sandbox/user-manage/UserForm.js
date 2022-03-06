import React, { forwardRef, useEffect, useState } from 'react'
import { Form,Input, Select } from 'antd';
const { Option } = Select;

function UserForm(props,ref) {

  const [isdisable, setisdisable] = useState(false)
  const {roleId,region} = JSON.parse(localStorage.getItem("token"))

  const checkRegionM=(item)=>{
    if (props.isUpdate) {
      if (roleId===1) {
        return false
      } else {
        return true
      }
    }else{
      if (roleId===1) {
        return false
      } else {
        return item.value!==region
      }
    }
  }

  const checkRoleM=(item)=>{
    if (props.isUpdate) {
      if (roleId===1) {
        return false
      } else {
        return true
      }
    }else{
      if (roleId===1) {
        return false
      } else {
        return item.id!==3
      }
    }
  }

  useEffect(() => {
    setisdisable(props.isEditDisabled)
  }, [props.isEditDisabled])
  
  return (
    <div>
      <Form layout='vertical' ref={ref}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={isdisable?[]:[{ required: true, message: '请输入区域' }]}
        >
          <Select disabled={isdisable}>
            {
              props.regionlist.map(item=>
                <Option 
                  key={item.id} 
                  value={item.value}
                  disabled={checkRegionM(item)}
                >
                  {item.title}
                </Option>
              )
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[{ required: true, message: '请输入角色' }]}
        >
          <Select onChange={(value)=>{
            console.log(value);
            if (value===1) {
              setisdisable(true)
              ref.current.setFieldsValue({
                region:''
              })
            }else{
              setisdisable(false)
            }
          }}>
            {
              props.rolelist.map(item=>
                <Option 
                  key={item.id} 
                  value={item.id}
                  disabled={checkRoleM(item)}
                >
                  {item.roleName}
                </Option>
              )
            }
          </Select>
        </Form.Item>
      </Form>
    </div>
  )
}

export default forwardRef(UserForm)