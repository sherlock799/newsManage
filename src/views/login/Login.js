import React from 'react'
import axios from 'axios'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'
import ParticlesBg from 'particles-bg'
import { useHistory } from 'react-router-dom';


export default function Login() {

  const history = useHistory()

  const onFinish = (value) => {
    axios.get(`/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`).then((res) => {
      if(res.data.length!==0){
        localStorage.setItem("token",JSON.stringify(res.data[0]))
        history.push("/")
      }else{
        message.error("用户名或密码错误")
      }
    })
  }

  return (
    <div>
      <ParticlesBg type="square" bg={true} />
      <div className='formContainer'>
        <div className='logintitle'>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
