import style from './News.module.css'
import NewsEditor from '../../../components/NewsEditor'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Form, Input, message, notification, 
        PageHeader, Select, Steps } from 'antd'
const { Step } = Steps
const { Option } = Select

export default function NewsUpdate(props) {

  const [current, setcurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')
  const NewsForm = useRef(null)
  const id = props.match.params.id

  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields()
        .then(res => {
          setFormInfo(res);
          setcurrent(current + 1)
        }).catch(err => {
          console.log(err);
        })
    } else if (content.length < 10) {
      message.error('新闻内容过少');
    } else {
      console.log(formInfo, content);
      setcurrent(current + 1)
    }
  }

  const handleSave = (auditState) => {
    axios.patch(`/news/${id}`, {
      ...formInfo,
      "content": content,
      "auditState": auditState,
    }).then((res) => {
      props.history.push(
        auditState ? '/audit-manage/list' : '/news-manage/draft')
      notification.open({
        message: '通知',
        description:
          `${auditState ? '新闻正在审核' : '已返回草稿箱'}`,
        placement: 'bottomRight'
      });
    })
  }

  useEffect(() => {
    axios.get('/categories')
      .then(res => {
        setCategoryList(res.data)
      })
  }, [])

  useEffect(() => {
    axios.get(`/news/${id}?_expand=category&_expand=role`)
    .then(res => {
      let {title,categoryId,content} = res.data
      setContent(content)
      NewsForm.current.setFieldsValue({
        title,
        categoryId
      })
    })
  }, [id])

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="修改新闻"
        onBack={() => props.history.goBack()}
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
                categoryList.map(item =>
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                )
              }</Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.hidden}>
          <NewsEditor content={content} getContent={(value) => {
            setContent(value);
          }} />
        </div>
        <div className={current === 2 ? "" : style.hidden}/>
      </div>
      <div style={{ marginLeft: "20px" }}>
        {current === 2 &&
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存修改
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        }
        {current < 2 &&
          <Button type="primary" onClick={() => handleNext()}>
            下一步
          </Button>
        }
        {current > 0 &&
          <Button onClick={() => { setcurrent(current - 1) }}>
            上一步
          </Button>}
      </div>
    </div>
  )
}