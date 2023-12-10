import React, { useEffect, useState } from "react";
import Head from "next/head";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { useContractRead, useContractWrite } from "wagmi";
import { CONTRACT_ABIS } from "@/utilities/contractDetails";
import { useAccount } from "wagmi";
import lighthouse from "@lighthouse-web3/sdk";

export default function Index() {
  const { address } = useAccount();

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  const { isLoading: groupCreationLoading, writeAsync: groupCreateAsync } =
    useContractWrite({
      abi: CONTRACT_ABIS.SplitMoneyContract.abi,
      address: CONTRACT_ABIS.SplitMoneyContract.address as `0x${string}`,
      functionName: "createGroup",
      account: address,
      chainId: 44787,
    });

  const [groupDetails, setGroupDetails] = useState({
    members: [],
    name: "",
    description: "",
    imageCID: "",
  });

  useEffect(() => {
    console.log(groupDetails);
  }, [groupDetails]);

  const [image, setImage] = useState();

  const handleSubmit = async () => {
    setTransactionLoading(true);
    console.log(image);
    const output = await lighthouse.upload(
      image,
      process.env.NEXT_PUBLIC_LIGHTHOUSE_KEY,
      false,
      null,
      progressCallback
    );
    // setGroupDetails({ ...groupDetails, imageCID: output.data.Hash })
    await groupCreateAsync({
      args: [
        groupDetails.members,
        groupDetails.name,
        groupDetails.description,
        output.data.Hash,
      ],
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
      <div className="my-5 text-2xl font-black">Create Group</div>
      {/* Groups start */}
      <div>
        <div className="mt-3 divide-y divide-gray-300 space-y-5">
          <div className="space-y-12">
            <div className="border-b border-white/10">
              <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                <div className="rounded-md px-3 pb-1.5 pt-2.5 bg-white shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                    htmlFor="groupName"
                    className="block text-xs font-medium text-gray-900"
                  >
                    Group Name
                  </label>
                  <input
                    type="text"
                    name="groupName"
                    id="groupName"
                    onChange={(e) => {
                      setGroupDetails({
                        ...groupDetails,
                        name: e.target.value,
                      });
                    }}
                    className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Hong Kong Vacation"
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

                <div className="rounded-md px-3 pb-1.5 pt-2.5 bg-white shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                    htmlFor="walletAddresses"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Wallet Addresses
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="walletAddresses"
                      name="walletAddresses"
                      rows={3}
                      className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      defaultValue={""}
                      onChange={(e) => {
                        setGroupDetails({
                          ...groupDetails,
                          members: e.target.value.split(", "),
                        });
                      }}
                      placeholder="Write a few sentences about the group."
                    />
                  </div>
                </div>

                <div className="rounded-md px-3 pb-1.5 pt-2.5 bg-white shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-800"
                  >
                    Group picture
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-500"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-gray-200 font-semibold text-gray-900 px-1.5 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={(e: any) => {
                              setImage(e.target.files);
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-6">
            {!transactionLoading ? (
              <button
                type="submit"
                onClick={handleSubmit}
                className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 my-4"
              >
                Save
              </button>
            ) : (
              <button className="inline-flex justify-center rounded-md border border-transparent bg-indigo-300 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 my-4">
                Loading, wait for the transaction to complete.
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Groups end */}
    </>
  );
}
