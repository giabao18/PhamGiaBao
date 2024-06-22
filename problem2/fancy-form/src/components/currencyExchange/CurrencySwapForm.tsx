import React, { useState } from "react";
import "./styles.scss";
import {
  Button,
  Form,
  Select,
  Flex,
  Typography,
  message,
  InputNumber,
  Divider,
} from "antd";
import { IToken, IWallet } from "../home/Home";

const { Option } = Select;

export interface ICurrencyExchange {
  tokens: IToken[];
  wallet: IWallet[];
  setWallet: React.Dispatch<React.SetStateAction<IWallet[]>>;
}

export const CurrencyExchange: React.FC<ICurrencyExchange> = ({
  tokens,
  wallet,
  setWallet,
}) => {
  const [form] = Form.useForm();
  const [value, setValue] = useState(0);

  const updateWallet = (values: any) => {
    const update = wallet.map((token) => {
      if (token.currency === values.fromToken) {
        return {
          ...token,
          number: token.number - values.amount,
        };
      }
      if (token.currency === values.toToken) {
        let toTokenPrice: number = 0;
        let fromTokenPrice: number = 0;

        tokens.forEach((token) => {
          if (token.currency === values.toToken) toTokenPrice = token.price;
          if (token.currency === values.fromToken) fromTokenPrice = token.price;
        });

        return {
          ...token,
          number:
            token.number + (values.amount * fromTokenPrice) / toTokenPrice,
        };
      }
      return token;
    });

    return update;
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      setWallet(updateWallet(values));

      message.success("Form submitted successfully");
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const validateAmount = async (_: any, value: number) => {
    const fromToken = form.getFieldValue("fromToken");
    const token = wallet.find((token) => token.currency === fromToken);

    if (!fromToken) {
      return Promise.reject('Please select a "From Token" first.');
    }

    if (!token) {
      return Promise.reject("Invalid token selected.");
    }

    if (value > token.number) {
      return Promise.reject(
        `Amount must be less than or equal your number of token`
      );
    }

    return Promise.resolve();
  };

  const handleChangeFormItemForValue = (allValues: any) => {
    if ("amount" in allValues) {
      if ("fromToken" in allValues && "toToken" in allValues) {
        const amount = Number(allValues.amount);

        if (isNaN(amount)) {
          setValue(0);
          return;
        }

        const fromToken = tokens.find(
          (token) => token.currency === allValues.fromToken
        );
        const toToken = tokens.find(
          (token) => token.currency === allValues.toToken
        );

        const fromTokenPrice = fromToken ? fromToken.price : 1;
        const toTokenPrice = toToken ? toToken.price : 1;

        const finalValue = (amount * fromTokenPrice) / toTokenPrice;

        if (isNaN(finalValue)) {
          setValue(0);
        } else {
          setValue(Number(finalValue.toFixed(4)));
        }
      }
    }
    throw new Error("Amount is undefined");
  };

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
        Currency Exchange
      </Typography.Title>
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={"optional"}
        title="Currency Swap"
        onValuesChange={handleChangeFormItemForValue}
        initialValues={{
          fromToken: "ETH",
          toToken: "USD",
        }}
      >
        <Typography.Title level={5} style={{ margin: "10px" }}>
          From
        </Typography.Title>

        <div className="items_horizontal">
          <Form.Item
            name="amount"
            rules={[
              { required: true, message: "Amount is required" },
              {
                validator: validateAmount,
              },
            ]}
          >
            <InputNumber
              min={1}
              size="large"
              type="number"
              placeholder="Enter amount"
              style={{ width: "200px" }}
            />
          </Form.Item>

          <Form.Item
            name="fromToken"
            rules={[{ required: true, message: "Token is required" }]}
          >
            <Select
              size="large"
              style={{ width: "140px" }}
              placeholder="Select from token"
              onChange={() => form.validateFields(["amount"])}
            >
              {tokens.map((token) => (
                <Option key={token.currency} value={token.currency}>
                  <img src={token.icon} alt="icon" className="token_icon" />
                  {token.currency}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Typography.Title level={5} style={{ margin: "10px" }}>
          To
        </Typography.Title>

        <div className="items_horizontal">
          <div className="value">
            <Typography
              style={{
                padding: "10px 0 0 10px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              {value}
            </Typography>
          </div>
          
          <Form.Item
            name="toToken"
            rules={[{ required: true, message: "Token is required" }]}
          >
            <Select
              size="large"
              style={{ width: "140px" }}
              placeholder="Select to token"
            >
              {tokens.map((token) => (
                <Option key={token.currency} value={token.currency}>
                  <img src={token.icon} alt="icon" className="token_icon" />
                  {token.currency}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ float: "right" }}>
            Swap
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};
