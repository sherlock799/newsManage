import React,{useEffect, useState} from 'react'
import { PageHeader, Descriptions } from 'antd';
import { HeartTwoTone } from '@ant-design/icons'
import axios from 'axios';
import moment from 'moment'

export default function Detail(props) {

  const [newsInfo, setNewsInfo] = useState(null)
  
  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
    .then(res=>{
      console.log(res.data);
      setNewsInfo({
        ...res.data,
        view:res.data.view+1
      })
      return res.data
    }).then(res=>{
      axios.patch(`/news/${props.match.params.id}`,{
        view:res.view+1
      })
    })
  }, [props.match.params.id])

  const starM = ()=>{
    setNewsInfo({
      ...newsInfo,
      star:newsInfo.star+1
    })
    axios.patch(`/news/${props.match.params.id}`,{
      star:newsInfo.star+1
    })
  }
  
  return (
    <div className="site-page-header-ghost-wrapper">
      {
        newsInfo && <div>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={<div>
              {newsInfo.category.title}
              <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>starM()}/>
            </div>}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {newsInfo.publishTime?
                  moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):'-'}
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                {newsInfo.region}
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">
                <span style={{color:'green'}}>{newsInfo.view}</span>
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
              <span style={{color:'green'}}>{newsInfo.star}</span>
              </Descriptions.Item>
              <Descriptions.Item label="评论数量">
              <span style={{color:'green'}}>0</span>
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div dangerouslySetInnerHTML={{
            __html:newsInfo.content
          }} style={{
            margin:'0 24px'
          }}/>
        </div>
      }
    </div>
  )
}