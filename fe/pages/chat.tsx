"use client";

import * as React from "react";
import { ReactNode } from "react";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import {
  useFilterMessages,
  useLightPush,
  useStoreMessages,
  useWaku,
} from "@waku/react";
import { createEncoder, createDecoder, waku } from "@waku/sdk";
import protobuf from "protobufjs";
import {
  createNode,
  retrieveExistingMessages,
  receiveMessage,
  sendMessage,
} from "@/components/Waku";
import { useAccount } from "wagmi";
import { createLightNode } from "@waku/sdk";
import { waitForRemotePeer, Protocols } from "@waku/sdk";
import { multiaddr } from "@multiformats/multiaddr";

interface Props {
  children: ReactNode;
}

export default function Chat() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [wakuNode, setWakuNode] = useState<any>();
  const { address } = useAccount();

  // // Update the inputMessage state as the user input changes
  // const handleInputChange = (e: {
  //   target: { value: React.SetStateAction<string> };
  // }) => {
  //   setInputMessage(e.target.value);
  // };

  // const handleSubmit = async () => {
  //   if (wakuNode) {
  //     console.log("message pushing...");
  //     const message = await sendMessage(
  //       wakuNode,
  //       address as string,
  //       inputMessage,
  //       "/chat/1.0.0"
  //     );
  //     console.log("message pushed...");
  //     setInputMessage("");
  //     let newMessage = await receiveMessage(wakuNode, "/chat/1.0.0");
  //     console.log(newMessage);
  //     // await queryMessage(wakuNode)
  //     setMessages([...messages, newMessage]);
  //   }
  // };

  useEffect(() => {
    (async () => {
      if (wakuNode) return;
      else {
        const node = await createNode();
        setWakuNode(node);
      }
    })();
  }, [wakuNode]);

  useEffect(() => {
    (async () => {
      if (!wakuNode) return;
      else {
        console.log("querying message...");
        const messages = await retrieveExistingMessages(
          wakuNode,
          "/chat/1.0.0"
        );
        setMessages(messages);
      }
    })();
  }, [wakuNode]);

  // const decodeMessage = (wakuMessage: any) => {
  //   // Render the message/payload in your application
  //   console.log(wakuMessage);
  // };

  // useEffect(() => {
  //   (async () => {
  //     const node = await createLightNode({ defaultBootstrap: true });
  //     console.info("Starting node");
  //     await node.start();
  //     console.info("Node started");

  //     console.log("Waiting for remote peer..");
  //     // await waitForRemotePeer(node, [Protocols.Store]);
  //     await node.dial(
  //       // multiaddr(
  //       //   "/dns4/node-01.gc-us-central1-a.waku.test.statusim.net/tcp/8000/wss/p2p/16Uiu2HAmDCp8XJ9z1ev18zuv8NHekAsjNyezAvmMfFEJkiharitG"
  //       // )
  //       multiaddr(
  //         "/dns4/node-01.do-ams3.wakuv2.prod.statusim.net/tcp/30303/p2p/16Uiu2HAmL5okWopX7NqZWBUKVqW8iUxCEmd5GMHLVPwCgzYzQv3e"
  //       )
  //     );
  //     console.log("Gotten peer");

  //     const contentTopic = "/store-guide/1/message/proto";

  //     // Create a message decoder
  //     const decoder = createDecoder(contentTopic);

  //     await node.store.queryWithOrderedCallback([decoder], decodeMessage);
  //   })();
  // }, []);

  return (
    <div className="chat-interface h-full grow flex flex-col">
      <div className="chat-body grow overflow-y-scroll bg-black">
        {messages ? (
          messages.map((message: any, index: any) => (
            <div key={index} className="chat-message">
              <span>{}</span>
              <div className="message-text">
                {message.message} from {message.sender}
              </div>
            </div>
          ))
        ) : (
          <div className="message-text">No Messages</div>
        )}
      </div>
      <div className="chat-footer px-5 py-3 bg-zinc-950">
        <div className="flex items-center gap-x-3">
          {/* <button
            type="button"
            className="rounded-full bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            onClick={handleSubmit}
          >
            Pay
          </button>
          <div className="grow">
            <label htmlFor="message-input" className="sr-only">
              Message
            </label>
            <input
              type="text"
              id="message-input"
              name="message-input"
              value={inputMessage}
              onChange={handleInputChange}
              className="block w-full rounded-full border-0 py-1.5 px-5 bg-black text-white shadow-sm ring-1 ring-inset ring-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              placeholder="Type your message..."
            /> 
          </div>*/}
        </div>
      </div>
    </div>
  );
}
