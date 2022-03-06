import { useRef } from 'react'
import axios from 'axios'
import * as echarts from 'echarts';
import { Card, Col, List, Row, Avatar, Drawer } from 'antd';
import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import _ from 'lodash'
const { Meta } = Card;

export default function Home() {

  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  const [allList, setallList] = useState([])
  const [visible, setVisible] = useState(false);
  const [piachart, setpiachart] = useState(null)
  const [barchart, setbarchart] = useState(null)
  const barRef = useRef()
  const piaRef = useRef()
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=5')
      .then(res => {
        setviewList(res.data);
      })
  }, [])
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=5')
      .then(res => {
        setstarList(res.data);
      })
  }, [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category')
      .then(res => {
        renderbar(_.groupBy(res.data, item => item.category.title))
        setallList(res.data)
      })
    return () => { window.onresize = null }
  }, [])

  const renderbar = (data) => {

    var myChart
    if (!barchart) {
      myChart = echarts.init(barRef.current)
      setbarchart(myChart)
    }else{
      myChart = barchart
    }

    myChart.setOption({
      title: {
        text: '新闻分类展示'
      },
      tooltip: {},
      xAxis: {
        data: Object.keys(data),
        axisLabel: {
          interval: 0
        }
      },
      yAxis: { minInterval: 1 },
      series: [
        {
          name: '销量',
          type: 'bar',
          data: Object.values(data).map(item => item.length)
        }
      ]
    })
    window.onresize = () => {
      myChart.resize()
    }
  }

  const renderpia = () => {

    var newsList = allList.filter(i=>i.author===username)
    var data = _.groupBy(newsList,i=>i.category.title) 
    var dataList = []
    for(let i in data){
      dataList.push({
        name:i,
        value:data[i].length
      })
    }

    var myChart
    if (!piachart) {
      myChart = echarts.init(piaRef.current)
      setpiachart(myChart)
    }else{
      myChart = piachart
    }
    var option = {
      title: {
        text: '个人新闻分类展示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'right'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: dataList,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true} size='small'>
            <List
              dataSource={viewList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`} >{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true} size='small'>
            <List
              dataSource={starList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`} >{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" onClick={() => {
                setTimeout(() => {
                  setVisible(true)
                  renderpia() 
                }, 0);
              }}/>,
              <EditOutlined key="edit" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region ? region : '全球'}</b>
                  <span style={{ paddingLeft: '10px' }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <div ref={barRef} style={{ height: '400px', marginTop: '30px', width: '100%' }} />
      <Drawer
        width='50%'
        title=""
        placement="right"
        onClose={() => { setVisible(false) }}
        visible={visible}
      >
        <div ref={piaRef} style={{ height: '500px', marginTop: '30px', width: '100%' }} />
      </Drawer>
    </div>
  )
}
