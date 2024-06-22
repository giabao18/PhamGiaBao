import { Divider, Flex, Table, TableColumnsType, Typography } from "antd";
import React from "react";
import { IToken, IWallet } from "../home/Home";

export interface IWalletTableData {
  key: number;
  currency: string;
  number: number;
  icon: string;
  price: number;
}

export interface IWalletTable {
  wallet: IWallet[];
  tokens: IToken[];
}

export const WalletTable: React.FC<IWalletTable> = ({ wallet, tokens }) => {
  const columns: TableColumnsType<IWalletTableData> = [
    {
      title: "Currency",
      dataIndex: "currency",
    },
    {
      title: "Number",
      dataIndex: "number",
      sorter: (a, b) => a.number - b.number,
    },
    {
      title: "Icon",
      dataIndex: "icon",
      render: (_,record) => (
        <img
          src={record.icon}
          key={record.icon}
          alt={record.currency}
          style={{ width: "20px", height: "20px" }}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      render: (_, record) => <p>${record.price}</p>,
    },
  ];

  const data: IWalletTableData[] = [];
  for (let i = 0; i < wallet.length; i++) {
    data.push({
      key: i,
      currency: wallet[i].currency,
      number: Number(wallet[i].number.toFixed(4)),
      price: Number(tokens[i].price.toFixed(4)),
      icon: tokens[i].icon,
    });
  }

  return (
    <Flex
      vertical
      style={{
        width: "500px",
        height: "500px",
        padding: "10px 20px 20px 20px",
        margin: "80px",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
      }}
    >
      <Typography.Title style={{ textAlign: "center" }} level={3}>
        Wallet
      </Typography.Title>
      <Divider />
      <Table columns={columns} dataSource={data} scroll={{ y: 260 }} />
    </Flex>
  );
};
