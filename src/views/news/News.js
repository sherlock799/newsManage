import React, { useEffect, useState } from 'react'
import { Card, Col, List, PageHeader, Row } from 'antd';
import axios from 'axios'
import _ from 'lodash'
export default function News() {

  const [list, setlist] = useState([])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category')
      .then(res => {
        setlist(Object.entries(_.groupBy(res.data, i => i.category.title)));
      })
  }, [])

  return (
    <div style={{ width: "95%", margin: '0 auto' }}>
      <PageHeader
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看新闻"
      />
      <Row gutter={[16, 16]}>
        {
          list.map(item =>
            <Col span={8} key={item[0]}>
              <Card title={item[0]} bordered={true} hoverable={true} size='small'>
                <List
                  pagination={{ pageSize: 3 }}
                  dataSource={item[1]}
                  renderItem={data => <List.Item>
                    <a href={`#/detail/${data.id}`} >{data.title}</a>
                  </List.Item>}
                />
              </Card>
            </Col>
          )
        }
      </Row>
    </div>
  )
}
