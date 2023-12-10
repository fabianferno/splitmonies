import React, { useEffect, useState } from "react";
import Head from "next/head";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { useContractRead, useContractWrite } from "wagmi";
import { CONTRACT_ABIS } from "@/utilities/contractDetails";
import { useAccount } from "wagmi";
import lighthouse from "@lighthouse-web3/sdk";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { group } from "console";

export default function CreateExpense() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const groupId = searchParams.get("group");

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  const { isLoading: expenseCreationLoading, writeAsync: expenseCreateAsync } =
    useContractWrite({
      abi: CONTRACT_ABIS.SplitMoneyContract.abi,
      address: CONTRACT_ABIS.SplitMoneyContract.address as `0x${string}`,
      functionName: "addExpense",
    });

  const [groupDetails, setGroupDetails] = useState({
    amount: "",
    description: "",
  });

  const handleSubmit = async () => {
    setTransactionLoading(true);
    // console.log(image)
    console.log(groupDetails);
    await expenseCreateAsync({
      args: [groupId, groupDetails.amount, groupDetails.description],
    });
    setTransactionLoading(false);
  };

  const [transactionLoading, setTransactionLoading] = useState(false);

  return (
    <>
      <Head>
        <title>SplitMonies</title>
        <meta name="title" content="SplitMonies" />
      </Head>
      <div className="text-2xl font-black">Create Expense</div>

      {/* Create expense start */}
      <div className="mt-3">
        <div className="space-y-12">
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="rounded-md px-3 pb-1.5 pt-2.5 bg-white shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                htmlFor="groupID"
                className="block text-xs font-medium text-gray-900"
              >
                Group ID
              </label>
              {groupId && (
                <input
                  type="text"
                  name="groupID"
                  id="groupID"
                  value={groupId}
                  disabled={true}
                  className="block w-full opacity-30 border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 cursor-not-allowed"
                />
              )}
            </div>

            <div className="rounded-md px-3 pb-1.5 pt-2.5 bg-white shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                htmlFor="amount"
                className="block text-xs font-medium text-gray-900"
              >
                Group Name
              </label>
              <input
                type="text"
                name="amount"
                id="amount"
                onChange={(e) => {
                  setGroupDetails({
                    ...groupDetails,
                    amount: e.target.value,
                  });
                }}
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="100 ETH"
              />
            </div>

            <div className="rounded-md px-3 pb-1.5 pt-2.5 bg-white shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  defaultValue={""}
                  onChange={(e) => {
                    setGroupDetails({
                      ...groupDetails,
                      description: e.target.value,
                    });
                  }}
                  placeholder="Write a few sentences about the group."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-x-6">
          {!transactionLoading ? (
            <button
              type="submit"
              onClick={handleSubmit}
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create
            </button>
          ) : (
            <button className="opacity-50 rounded-md bg-indigo-600 px-4 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Creating
            </button>
          )}
        </div>
      </div>
      {/* Create expense end */}
    </>
  );
}
