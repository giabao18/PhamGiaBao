import React, { useEffect, useState } from "react";
import { CurrencyExchange } from "../currencyExchange/CurrencySwapForm";
import { WalletTable } from "../wallet/Wallet";
import "./styles.scss";
import { Flex } from "antd";

export interface IToken {
  currency: string;
  date: string;
  price: number;
  icon: string;
}

export interface IWallet {
  currency: string;
  number: number;
}

export const Home = () => {
  const [tokens, setTokens] = useState<Array<IToken>>([]);
  const [wallet, setWallet] = useState<Array<IWallet>>([]);

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((response) => response.json())
      .then((data) => {
        const walletTokens: IWallet[] = [];
        let icon;

        const uniqueTokens = data.reduce((acc: any, cur: any) => {
          const existingToken = acc.find(
            (token: any) => token.currency === cur.currency
          );
          if (!existingToken) {
            acc.push(cur);
          }

          return acc;
        }, []);

        const tokensList = uniqueTokens.map((token: any) => {
          let tokenName: string;

          switch (token.currency) {
            case "STEVMOS":
              tokenName = "stEVMOS";
              break;
            case "RATOM":
              tokenName = "rATOM";
              break;
            case "STOSMO":
              tokenName = "stOSMO";
              break;
            case "STATOM":
              tokenName = "stATOM";
              break;
            case "STLUNA":
              tokenName = "stLUNA";
              break;
            default:
              tokenName = token.currency;
              break;
          }

          icon = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${tokenName}.svg`;

          walletTokens.push({
            currency: token.currency,
            number: 10,
          });

          return {
            ...token,
            icon: icon,
          };
        });

        setTokens(tokensList);
        setWallet(walletTokens);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="gradientBackground">
      <Flex style={{ height: "100vh" }} align="center" justify="center">
        <CurrencyExchange
          tokens={tokens}
          wallet={wallet}
          setWallet={setWallet}
        />
        <WalletTable tokens={tokens} wallet={wallet} />
      </Flex>
    </div>
  );
};
