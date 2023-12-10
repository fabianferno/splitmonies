"use client";

import { multiaddr } from "@multiformats/multiaddr";
import {
  createLightNode,
  waitForRemotePeer,
  Protocols,
  createEncoder,
  createDecoder,
  LightNode,
  DecodedMessage,
} from "@waku/sdk";
import protobuf from "protobufjs";

// Create a message structure using Protobuf
const ChatMessage = new protobuf.Type("ChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("sender", 2, "string"))
  .add(new protobuf.Field("message", 3, "string"));

// const contentTopic = '/waku/demo-split/0'

// const encoder = createEncoder({ contentTopic })
// const decoder = createDecoder(contentTopic);

export async function createNode() {
  console.log("starting the node...");
  const node = await createLightNode({
    defaultBootstrap: true,
  });
  console.log("starting node...");
  await node.start();
  console.log("started node.");
  await waitForRemotePeer(node);
  console.log("connected to peer...");
  return node;
}

export async function receiveMessage(node: LightNode, contentTopic: string) {
  const decoder = createDecoder(contentTopic);

  let messageContent: any = {};
  const _callback = (message: DecodedMessage) => {
    // Check if there is a payload on the message
    if (!message.payload) return;
    // Render the messageObj as desired in your application
    const messageObj = ChatMessage.decode(message.payload);
    messageContent = messageObj.toJSON();
  };
  const subscription = await node.filter.createSubscription();
  await subscription.subscribe([decoder], _callback);
  return messageContent;
}

export async function retrieveExistingMessages(
  node: LightNode,
  contentTopic: string
) {
  const decoder = createDecoder(contentTopic);
  // Create the callback function
  let messages: any[] = [];
  const _callback = (message: DecodedMessage) => {
    // Check if there is a payload on the message
    if (!message.payload) return;
    // Render the messageObj as desired in your application
    const messageObj = ChatMessage.decode(message.payload);
    messages.push(messageObj.toJSON());
    // console.log(messageObj.toJSON());
  };

  // Query the Store peer
  await node.store.queryWithOrderedCallback([decoder], _callback);

  return messages;
}

export async function sendMessage(
  node: LightNode,
  sender: string,
  message: string,
  contentTopic: string
) {
  const encoder = createEncoder({ contentTopic });

  const messageObj = ChatMessage.create({
    timestamp: Date.now(),
    sender: sender,
    message: message,
  });
  const serialisedMessage = ChatMessage.encode(messageObj).finish();
  await node.lightPush.send(encoder, {
    payload: serialisedMessage,
  });
  console.log("sent", serialisedMessage);
  return messageObj.toJSON();
}
