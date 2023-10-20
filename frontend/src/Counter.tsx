import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../utils/abi.json";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
import { BiconomySmartAccountV2 } from "@biconomy/account";
import styles from "@/styles/Home.module.css";
import { ChainId } from "@biconomy/core-types";

interface Props {
  smartAccount: BiconomySmartAccountV2;
  address: string;
  provider: ethers.providers.Provider;
}

const Counter: React.FC<Props> = ({ smartAccount, address, provider }) => {
  const [counter, setCounter] = useState(0);
  const [lastCaller, setLastCaller] = useState("");
  const counterAddress = "0x33AbDF461BeE7Fd576d723e25D617d21cfeeD0C3";

  useEffect(() => {
    if (smartAccount) {
      getCount();
      getLastCaller();
    }
  }, [smartAccount]);
  const getContract = async (read?: boolean) =>
    new ethers.Contract(
      counterAddress,
      abi,
      read
        ? new ethers.providers.AlchemyProvider(
            ChainId.GOERLI,
            "cHQ1YGm0toEoqWo0dMNnIxjmujm32uP_"
          )
        : provider
    );
  const handleIncrease = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.populateTransaction.increase();
      const tx1 = {
        to: counterAddress,
        data: tx.data,
      };

      let userOp = await smartAccount.buildUserOp([tx1]);
      console.log({ userOp });
      const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: "BICONOMY",
          version: "2.0.0",
        },
      };
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );

      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
    } catch (error) {
      console.error(error);
    }
  };

  const getCount = async () => {
    try {
      const contract = await getContract(true);
      const tx = await contract.number();
      setCounter(Number(tx));
    } catch (error) {
      console.error(error);
    }
  };

  const getLastCaller = async () => {
    try {
      const contract = await getContract(true);
      const tx = await contract.lastCaller();
      setLastCaller(tx);
    } catch (error) {
      console.error(error);
    }
  };

  const setNumber = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.populateTransaction.setNumber(235);
      const tx1 = {
        to: counterAddress,
        data: tx.data,
      };

      let userOp = await smartAccount.buildUserOp([tx1]);
      console.log({ userOp });
      const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: "BICONOMY",
          version: "2.0.0",
        },
      };
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );

      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);

      await getCount();
      await getLastCaller();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {address && (
        <>
          <div>
            <p>Count is: {counter}</p>
            <p>Last Caller: {lastCaller}</p>
          </div>
          <button onClick={handleIncrease}>Increase</button>
          <button onClick={setNumber}>Set Number to 205</button>
        </>
      )}
    </>
  );
};

export default Counter;
