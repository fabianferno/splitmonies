"use client";

import * as React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { useContractWrite } from "wagmi";
import { CONTRACT_ABIS } from "@/utilities/contractDetails";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import axios from "axios";
import { PlusIcon } from "@heroicons/react/24/solid";
import {
  createNode,
  retrieveExistingMessages,
  receiveMessage,
  sendMessage,
} from "@/components/Waku";
import { LightNode } from "@waku/sdk";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSearchParams } from "next/navigation";
import { superShortenAddress } from "@/utilities/shortenAddress";

export default function GroupPage() {
  const router = useRouter();
  const id = router.query.id;
  const { address } = useAccount();
  const [open, setOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [wakuNode, setWakuNode] = useState<LightNode | null>(null);
  const searchParams = useSearchParams();
  const groupId = searchParams.get("id");

  const [expenses, setExpenses] = useState<any>([]);
  const [groupImageHash, setGroupImageHash] = useState("");

  const [combinedMessages, setCombinedMessages] = useState<any>([]);

  useEffect(() => {
    if (router.isReady) {
      const apiUrl =
        "https://api.studio.thegraph.com/query/55648/splitmonies/version/latest"; // Replace with your GraphQL API URL
      const query = `
    query {
      groupCreateds(where: {groupId: "${id}"}) {
        groupImage
      }
    }`;
      const headers = {
        "Content-Type": "application/json",
        // Add any necessary authentication headers if required
      };
      axios.post(apiUrl, { query }, { headers }).then((res) => {
        setGroupImageHash(res.data.data.groupCreateds[0].groupImage);
        // console.log(res.data.data.groupCreateds[0].groupImage)
      });
    }
  }, [router.isReady]);

  // Get expenses from the graph
  useEffect(() => {
    if (router.isReady) {
      const apiUrl =
        "https://api.studio.thegraph.com/query/55648/splitmonies/version/latest"; // Replace with your GraphQL API URL
      const query = `
        query {
          expenseAddeds(where: {groupId: "${String(id)}"}) {
            id
            groupId
            expenseId
            requester
            amount
            blockTimestamp
            payers
            share
          }
        }`;
      const headers = {
        "Content-Type": "application/json",
        // Add any necessary authentication headers if required
      };
      axios.post(apiUrl, { query }, { headers }).then((res) => {
        console.log(res.data.data.expenseAddeds);
        if (res.data.data.expenseAddeds.length > 0) {
          setExpenses(res.data.data.expenseAddeds);
        }
      });
    }
  }, [router.isReady]);

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

  const createExpense = async () => {
    setTransactionLoading(true);
    // console.log(image)
    console.log(groupDetails);
    await expenseCreateAsync({
      args: [groupId, groupDetails.amount, groupDetails.description],
    });
    setTransactionLoading(false);
  };

  const [transactionLoading, setTransactionLoading] = useState(false);

  // Update the inputMessage state as the user input changes
  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputMessage(e.target.value);
  };

  // Send the message to the Waku node
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (wakuNode) {
      console.log("message pushing...");
      const message = await sendMessage(
        wakuNode,
        address as string,
        inputMessage,
        `/splitmonies/group/${id}`
      );
      console.log("message pushed...", message);
      setInputMessage("");
      let newMessage = await receiveMessage(
        wakuNode,
        `/splitmonies/group/${id}`
      );
      console.log(newMessage);
      // await queryMessage(wakuNode)
      setMessages([
        ...messages,
        {
          message: inputMessage,
          sender: address,
          timestamp: new Date().getTime(),
        },
      ]);
    } else {
      console.log("No waku node");
    }
  };

  useEffect(() => {
    if (wakuNode) return;

    (async () => {
      const node = await createNode();
      setWakuNode(node);
    })();
  }, [wakuNode]);

  // Query the messages from the Waku node
  useEffect(() => {
    if (router.isReady) {
      console.log(id);
      (async () => {
        if (!wakuNode) {
          console.log("Node not created");
        } else {
          console.log("querying message...", `/splitmonies/group/${id}`);
          const messages = await retrieveExistingMessages(
            wakuNode,
            `/splitmonies/group/${id}`
            // `/js-waku-examples/1/chat/proto`
          );
          setMessages(messages);
          console.log({ messages });
        }
      })();
    }
  }, [wakuNode, router.isReady]);

  // Combining messages from Waku and expenses from the graph
  useEffect(
    () => {
      if (expenses && messages) {
        // Combine messages and expenses
        let combinedList: any = [...messages, ...expenses];

        // Convert timestamp to seconds and sort combinedList
        combinedList = combinedList
          .map((item: any) => {
            // Convert timestamp to seconds if it exists
            if (item.timestamp) {
              let time = new Date(parseInt(item.timestamp)).getTime();
              console.log(time);
              // item.timestamp = time.getTime() / 1000;
              item.timestamp = time;
            } else {
              let time = new Date(
                parseInt(item.blockTimestamp) * 1000
              ).getTime();
              console.log(time);
              // item.timestamp = time.getTime() / 1000;
              item.timestamp = time;
            }

            return item;
          })
          .sort((a: any, b: any) => {
            // Compare timestamp
            return a.timestamp - b.timestamp;
          });

        console.log(combinedList);
        setCombinedMessages(combinedList);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expenses, messages]
  );

  // Always scroll to bottom of the chat
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ height: "calc(100vh - 64px)" }}
        className="overflow-hidden flex flex-col justify-between"
      >
        <div className="grow overflow-y-scroll py-5">
          <div className="space-y-2">
            {combinedMessages?.map((message: any, index: number) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === address || message.requester === address
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.requester ? (
                  // Its an expense
                  <span
                    className={`px-5 py-2 text-lg shadow ${
                      message.requester === address
                        ? "bg-indigo-500 text-white border border-indigo-600 rounded-l-xl rounded-tr-xl"
                        : "bg-white text-gray-900 border border-gray-200 border-b-4 border-b-green-600 rounded-r-xl rounded-tl-xl"
                    }`}
                  >
                    <div className="font-black text-5xl">
                      {message.amount}
                      <span className="ml-2 text-xl font-bold text-gray-700">
                        cUSD
                      </span>
                    </div>
                    <div className="mt-3 text-sm flex items-center gap-x-2">
                      Paid by{" "}
                      <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-lg">
                        {superShortenAddress(message.requester)}
                      </span>
                    </div>
                    <div className="mt-3 text-gray-500 text-sm">
                      You owe them {message.amount / message.payers.length} cUSD
                    </div>
                  </span>
                ) : (
                  // Its a message
                  <span
                    className={`px-5 py-2 text-lg shadow ${
                      message.sender === address
                        ? "bg-indigo-500 text-white border border-indigo-600 rounded-l-xl rounded-tr-xl"
                        : "bg-white text-gray-900 border border-gray-200 rounded-r-xl rounded-tl-xl"
                    }`}
                  >
                    {message.message}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
        <div className="mb-2 grid grid-cols-6 gap-x-1">
          <button
            onClick={() => setOpen(true)}
            type="button"
            className="col-span-2 flex items-center justify-center gap-x-1.5 rounded-full bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create
            <PlusIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
          </button>
          <div className="col-span-4">
            <label htmlFor="email" className="sr-only">
              Message
            </label>
            <input
              type="text"
              name="message"
              id="message"
              value={inputMessage}
              onChange={handleInputChange}
              className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Pay up 🥺"
            />
          </div>
        </div>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:p-6">
                  <div className="font-black text-xl text-gray-900">
                    Create an Expense
                  </div>
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
                          Amount
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
                          Expense Description
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
                        onClick={createExpense}
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </form>
  );
}
