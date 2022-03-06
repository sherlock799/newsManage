import { Table, Button, Popconfirm } from 'antd';

export default function PublishTable(props) {

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title,item) => 
        <a href={`#/news-manage/preview/${item.id}`}>{title}</a>,
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: category=> <div>{category.title}</div>
    },
    {
      title: '操作',
      render: (item) => {
        if(item.publishState===1){
          return(
            <div size="middle">
              <Button type='primary' onClick={()=>props.publishM(item)}>发布</Button>
            </div>
          )
        }
        if(item.publishState===2){
          return(
            <div size="middle">
              <Popconfirm
                title="您确定要下线此新闻吗？"
                onConfirm={()=>props.sunsetM(item)}
                onCancel={()=>{}}
                okText="确定"
                cancelText="取消"
              >
                <Button danger>下线</Button>
              </Popconfirm>
            </div>
          )
        }
        if(item.publishState===3){
          return(
            <div size="middle">
              <Popconfirm
                title="您确定要删除此新闻吗？"
                onConfirm={()=>props.deleteM(item)}
                onCancel={()=>{}}
                okText="确定"
                cancelText="取消"
              >
                <Button danger>删除</Button>
              </Popconfirm>
            </div>
          )
        }
      }
    },
  ]

  return (
    <div>
      <Table 
        pagination={{pageSize:5}} 
        columns={columns} 
        dataSource={props.dataSouce} 
        rowKey={(item)=>item.id}
        locale={{emptyText: ' ' }}
      />
    </div>
  )
}
