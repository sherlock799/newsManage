import React from 'react'
import SideMenu from './layout/SideMenu'
import TopHeader from './layout/TopHeader'
import NewsRouter from './route/NewsRouter'
import './NewsSandBox.css'
import { Layout } from 'antd';
const { Content } = Layout;

export default function NewsSandBox(props) {
  return (
      <Layout>
        <SideMenu></SideMenu>
        <Layout className="site-layout">
        <TopHeader></TopHeader>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              overflow:"auto"
            }}
          >
            <NewsRouter/>
          </Content>
        </Layout>
      </Layout>
  )
}
