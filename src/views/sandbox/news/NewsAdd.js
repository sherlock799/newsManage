import style from './News.module.css'
import NewsEditor from '../../../components/NewsEditor'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from "react-router-dom";
import axios from 'axios'
import { Button, Form, Input, message, notification, PageHeader, Select, Steps } from 'antd'
const { Step } = Steps
const { Option } = Select

export default function NewsAdd() {

  
  const [current, setcurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')
  const NewsForm = useRef(null)
  const User = JSON.parse(localStorage.getItem('token'))
  const history = useHistory()

  const handleNext = () => {
    if (current===0) {
      NewsForm.current.validateFields()
      .then(res=>{
        setFormInfo(res);
        setcurrent(current + 1) 
      }).catch(err=>{
        console.log(err);
      })
    }else if(content.length<10){
      message.error('新闻内容过少');
    }else{
      setcurrent(current + 1) 
    }
  }

  const handleSave = (auditState) => {
    axios.post('/news',{
      ...formInfo,
      "content": content,
      "region": User.region?User.region:'全球',
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
    }).then((res)=>{
      history.push(auditState?'/audit-manage/list':'/news-manage/draft')
      notification.open({
        message: '通知',
        description: `您可以到${auditState?'审核列表':'草稿箱'}中查看您的新闻`,
        placement:'bottomRight'
      });
    })
  }

  useEffect(() => {
    axios.get('/categories')
    .then(res=>{
      setCategoryList(res.data)
    })
  }, [])
  
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="撰写新闻"
        subTitle=""
      />
      <div style={{margin:'0 20px'}}>
        <Steps current={current}>
          <Step title="基本信息" description="新闻标题，新闻分类" />
          <Step title="新闻内容" description="新闻主体内容" />
          <Step title="新闻提交" description="保存草稿或者提交审核" />
        </Steps>
      </div>
      <div style={{ margin: '30px 0' }}>
        <div className={current === 0 ? "" : style.hidden}>
          <Form
            name="basic"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 12 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select>{
                  categoryList.map(item=>
                    <Option key={item.id} value={item.id}>{item.title}</Option>
                  )
              }</Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.hidden}>
          <NewsEditor getContent={(value)=>{
            setContent(value);
          }}/>
        </div>
        <div className={current === 2 ? "" : style.hidden}>
        </div>
      </div>
      <div style={{ marginLeft: "20px" }}>
        {current === 2 && 
          <span>
            <Button type="primary" onClick={()=>handleSave(0)}>保存到草稿箱</Button>
            <Button danger onClick={()=>handleSave(1)}>提交审核</Button>
          </span>
        }
        {current < 2 && 
          <Button type="primary" onClick={()=>handleNext()}>
            下一步
          </Button>
        }
        {current > 0 && <Button onClick={() => { setcurrent(current - 1) }} >上一步</Button>}
      </div>
    </div>
  )
}
