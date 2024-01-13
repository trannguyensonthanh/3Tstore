import React, { useEffect, useState } from "react";
import { Image, Table } from "antd";

import "./Table.scss";

import CurrentDay from "../../../components/takeDay/takeDay";
import { useSelector } from "react-redux";
import { getAllOrder, getHistory, getProductdt } from "../../../service/getcategory/getCategory";



const BasicTable = () => {
  const dateDay = CurrentDay();
  const [dataAll, setDataAll] = useState([]);
  const reload = useSelector((state) => state.Reload)
  const [dataHistory, setDatahistory] = useState([]);
   
useEffect(() => {
  const fetchPur = async () => {
  const result = await getAllOrder();
 setDataAll(result);
}

fetchPur();
},[reload ? reload : null ])
const getProduct = async (id) => {
  const result = await getProductdt(id);
  return result;
}

const orderRecent = dataAll.filter(item => {
   return item.date.includes(dateDay);
})


const historyNhap = async () => {
  const result = await getHistory();

  for(let item of result){
    const inforsp = await getProduct(item.productId);
    item.productId = inforsp[0].title

  }
  setDatahistory(result);
}
const historyOrder = orderRecent.map(item => {
  return item.thanhtoan.map((x) => {
      return {
         ...x,
         date: item.date,
         paymentMethod: item.paymentMethod,
         user: item.user,
      }
    })
})
 const combineArray = historyOrder.reduce((origin, item) => {
  return origin.concat(item);
 }, [])

const data = combineArray.reduce((origin, item, index) => {
    return origin.concat({
      ...item, 
      key: index
    })
}, [])

useEffect(() => {
  historyNhap();
}, [reload])

  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      key: "id",
    },
    {
      title: "Hình ảnh",
      dataIndex: "img",
      key: "img",
      render: (text, record) => {
       return <Image src={text} width={40} height={40} />
      }
    },
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Số Lượng",
      dataIndex: "soluong",
      key: "soluong",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "thanhtien",
      key: "thanhtien",
    },
    {
      title: "Phương thức",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
  ];

  const columns_1 = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];
  return (
    <>  
    <div className="Table">
      <h3>Recent Orders</h3>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      />

<h3>hàng nhập kho</h3>
<Table dataSource={dataHistory} columns={columns_1} />
    </div>
    
    </>
  
  );
};

export default BasicTable;
