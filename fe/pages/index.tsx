import React, { useEffect } from "react";
import Head from "next/head";
import {
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BellAlertIcon,
  ClockIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import {
  useAccount,
  useConnect,
  useContractRead,
  usePublicClient,
} from "wagmi";
import { superShortenAddress } from "@/utilities/shortenAddress";
import { useRouter } from "next/router";
import { CONTRACT_ABIS } from "@/utilities/contractDetails";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function Index() {
  const { address } = useAccount();
  const router = useRouter();
  const transactions = [
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png",
      name: "Binance",
      date: "Today at 12:34 PM",
      amount: "0.024",
    },
    {
      image:
        "https://images.crunchbase.com/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/zl5oeeeuqaqhfyhlifl5",
      name: "FTX On Ramp",
      date: "Today at 12:45 PM",
      amount: "4.245",
    },
    {
      image: "https://static.tvtropes.org/pmwiki/pub/images/ss_glenn.png",
      name: "Glenn Sturgis OnlyFans",
      date: "Today at 1:20 PM",
      amount: "0.010",
    },
    {
      image:
        "https://i.guim.co.uk/img/media/b0e3074fc9a0b27623a4533872aed1b89e0c73fa/0_53_8192_4915/master/8192.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=709cf73b9b07f55bf30de4309ba35325",
      name: "CZ Bail Money",
      date: "Today at 3:34 PM",
      amount: "25",
    },
    {
      image:
        "https://pbs.twimg.com/profile_images/1551863971703046146/fl3RyAXc_400x400.jpg",
      name: "DappRadar Subscription",
      date: "Today at 4:15 PM",
      amount: "0.0001",
    },
  ];
  const [balance, setBalance] = React.useState<any>(0);

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    connect();
  }, []);

  const {
    data: balanceData,
    refetch: balanceDataRefetch,
    isLoading: balanceDataLoading,
  } = useContractRead({
    abi: CONTRACT_ABIS.SMTokenContract.abi,
    address: "0x874069fa1eb16d44d622f2e0ca25eea172369bc1",
    functionName: "balanceOf",
    args: [address],
    account: address,
  });

  useEffect(() => {
    if (address && router.isReady) {
      balanceDataRefetch();
    }
  }, [address, router.isReady]);

  useEffect(() => {
    console.log(balanceData);
    if (balanceDataLoading || !address) return;
    setBalance(balanceData);
  }, [balanceDataLoading]);

  return (
    <>
      <Head>
        <title>SplitMonies</title>
        <meta name="title" content="SplitMonies" />
      </Head>
      <div className="p-5 pb-20">
        <div className="mt-5">
          <div className="text-gray-900 text-lg font-medium text-center">
            Available Balance
          </div>
          <div className="text-gra-600 text-3xl font-black text-center">
            {parseInt(balance)} cUSD
          </div>
        </div>
      </div>
      {/* Menu start */}
      <div className="grid grid-cols-4 px-1 py-4 bg-white rounded-xl border border-gray-200 shadow-md">
        <Link href="/top-up" className="text-center space-y-1">
          <div className="flex justify-center">
            <CreditCardIcon className="h-8 w-8 text-gray-600" />
          </div>
          <div className="text-gray-900 text-xs">Top Up</div>
        </Link>
        <Link href="/top-up" className="text-center space-y-1">
          <div className="flex justify-center">
            <ArrowsRightLeftIcon className="h-8 w-8 text-gray-600" />
          </div>
          <div className="text-gray-900 text-xs">Transfer</div>
        </Link>
        <Link href="/top-up" className="text-center space-y-1">
          <div className="flex justify-center">
            <ClockIcon className="h-8 w-8 text-gray-600" />
          </div>
          <div className="text-gray-900 text-xs">Transactions</div>
        </Link>
        <Link href="/top-up" className="text-center space-y-1">
          <div className="flex justify-center">
            <BanknotesIcon className="h-8 w-8 text-gray-600" />
          </div>
          <div className="text-gray-900 text-xs">Withdraw</div>
        </Link>
      </div>
      {/* Menu end */}
      {/* Wallet address badge start */}
      <div className="mt-5 flex justify-center">
        <span className="mx-auto inline-flex items-center gap-x-0.5 rounded-full bg-white px-4 py-1 text-base font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
          {superShortenAddress(address)}
          <span className="sr-only">Copy</span>
          <DocumentDuplicateIcon className="ml-8 h-4 w-4 text-gray-400" />
        </span>
      </div>
      {/* Wallet address badge end */}
      {/* Recent transactions start */}
      <div className="mt-8 px-5">
        <div className="text-2xl font-extrabold">Recent Transactions</div>
        <div className="mt-3">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="py-2.5 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="inline-block h-14 w-14 rounded-full"
                    src={transaction.image}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-lg font-bold text-gray-900 leading-none">
                    {transaction.name}
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-600 leading-none">
                    {transaction.date}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600 font-bold">
                {transaction.amount} ETH
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent transactions end */}
    </>
  );
}
