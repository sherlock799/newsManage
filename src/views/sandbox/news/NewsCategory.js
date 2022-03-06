import React, { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table,Button,Modal, Form,Input} from 'antd';
import { 
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal;
const EditableContext = React.createContext(null);

export default function NewsCategory() {

  const [list, setList] = useState([])
  const [flag, setflag] = useState(false)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (title,item) => 
        <a href={`#/news-manage/preview/${item.id}`}>{title}</a>,
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave: handleSave,
      }),
    },
    {
      title: '操作',
      render: (item) => {
          return(
            <div size="middle">
              <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={()=>confilmM(item)}/>
            </div>
          )
        }
    }
  ]

  

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
  };
  
  const handleSave = (record) => {
    axios.patch(`/categories/${record.id}`,{
      title:record.title,
      value:record.title
    }).then(()=>{setflag(!flag)})
  };

  const confilmM=(item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        deleteM(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const deleteM=(item)=>{
      axios.delete(`/categories/${item.id}`)
      .then(()=>{setflag(!flag)})
  }

  useEffect(() => {
    axios.get("/categories")
    .then(res => {
      setList(res.data)
    })
  }, [flag])

  return (
    <div>
      <Table
        pagination={{ pageSize: 5 }}
        columns={columns}
        dataSource={list}
        rowKey={(item) => item.id}
        locale={{emptyText: ' ' }}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
      />
    </div>
  )
}
