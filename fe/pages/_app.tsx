"use client";

import "@/styles/globals.css";
import "@/styles/index.scss";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { celoAlfajores, mainnet, optimism, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import {
  ChatBubbleBottomCenterIcon,
  ClockIcon,
  HomeIcon,
  PaperAirplaneIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
// import { CONTENT_TOPIC } from "@/components/WakuChat/config";
import { Protocols } from "@waku/interfaces";

import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { Fragment } from "react";
import {
  Bars3Icon,
  UsersIcon,
  XMarkIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useAccount, useDisconnect, useBalance } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Alfajores } from "@celo/rainbowkit-celo/chains";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Groups", href: "/groups", icon: UsersIcon },
  { name: "Create Group", icon: PlusCircleIcon, href: "/create-group" },
  // { name: "Create Expense", icon: PlusCircleIcon, href: "/create-expense" },
  { name: "Settle Up", href: "/settle-up", icon: WalletIcon },
  // { name: "Chat", icon: ChatBubbleBottomCenterIcon, href: "/chat" },
];

// const NODE_OPTIONS = { defaultBootstrap: true };

const tabs = [
  { name: "Home", icon: HomeIcon, href: "/" },
  { name: "Groups", icon: PaperAirplaneIcon, href: "/groups" },
  { name: "Create Group", icon: PlusCircleIcon, href: "/create-group" },
  { name: "Settlements", icon: WalletIcon, href: "/settlements" },
  // { name: "Transactions", icon: ClockIcon, href: "/transactions" },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const MumbaiEVM = {
  id: 80001,
  name: "Mumbai",
  network: "Mumbai Testnet",
  iconUrl:
    "https://cdn.dorahacks.io/static/files/188c028468557368d12717c46b1bd63e.jpg",
  iconBackground: "#fff",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ["https://polygon-mumbai-bor.publicnode.com"] },
    default: { http: ["https://polygon-mumbai-bor.publicnode.com"] },
  },
  blockExplorers: {
    default: { name: "polygonscan", url: "https://mumbai.polygonscan.com" },
  },
  testnet: true,
};

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { chains, publicClient } = configureChains(
    [Alfajores],
    [publicProvider()]
  );

  const config = createConfig({
    autoConnect: true,
    publicClient,
    connectors: [
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ],
  });

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <WagmiConfig config={config}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme({
              accentColor: "#701a75",
              accentColorForeground: "white",
              borderRadius: "medium",
            })}
          >
            <div>
              <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                  as="div"
                  className="relative z-50 lg:hidden"
                  onClose={setSidebarOpen}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-gray-900/80" />
                  </Transition.Child>

                  <div className="fixed inset-0 flex">
                    <Transition.Child
                      as={Fragment}
                      enter="transition ease-in-out duration-300 transform"
                      enterFrom="-translate-x-full"
                      enterTo="translate-x-0"
                      leave="transition ease-in-out duration-300 transform"
                      leaveFrom="translate-x-0"
                      leaveTo="-translate-x-full"
                    >
                      <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-in-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in-out duration-300"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                            <button
                              type="button"
                              className="-m-2.5 p-2.5"
                              onClick={() => setSidebarOpen(false)}
                            >
                              <span className="sr-only">Close sidebar</span>
                              <XMarkIcon
                                className="h-6 w-6 text-white"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </Transition.Child>
                        {/* Sidebar component, swap this element with another sidebar if you like */}
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-2">
                          <div className="flex h-16 shrink-0 items-center gap-x-3">
                            <Image
                              className="h-8 w-auto"
                              src="/logo/logo-dark.png"
                              alt="SplitMonies"
                              height={948}
                              width={1249}
                            />
                            <div className="text-2xl text-white font-black">
                              SplitMonies
                            </div>
                          </div>
                          <nav className="flex flex-1 flex-col">
                            <ul
                              role="list"
                              className="flex flex-1 flex-col gap-y-7"
                            >
                              <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                  {navigation.map((item) => (
                                    <li key={item.name}>
                                      <Link
                                        onClick={() => setSidebarOpen(false)}
                                        href={item.href}
                                        className={classNames(
                                          pathname === item.href
                                            ? "bg-indigo-700 text-white"
                                            : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                                          "group flex items-center gap-x-4 rounded-md p-2 text-lg leading-6 font-semibold"
                                        )}
                                      >
                                        <item.icon
                                          className={classNames(
                                            pathname === item.href
                                              ? "text-white"
                                              : "text-indigo-200 group-hover:text-white",
                                            "h-8 w-8 shrink-0"
                                          )}
                                          aria-hidden="true"
                                        />
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition.Root>

              {/* Static sidebar for desktop */}
              <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6">
                  <div className="flex h-16 shrink-0 items-center gap-x-3">
                    <Image
                      className="h-8 w-auto"
                      src="/logo/logo-dark.png"
                      alt="SplitMonies"
                      height={948}
                      width={1249}
                    />
                    <div className="text-2xl font-black text-white">
                      SplitMonies
                    </div>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={classNames(
                                  pathname === item.href
                                    ? "bg-indigo-700 text-white"
                                    : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    pathname === item.href
                                      ? "text-white"
                                      : "text-indigo-200 group-hover:text-white",
                                    "h-6 w-6 shrink-0"
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="-mx-6 mt-auto">
                        <a
                          href="#"
                          className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-indigo-700"
                        >
                          <img
                            className="h-8 w-8 rounded-full bg-indigo-700"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                          <span className="sr-only">Your profile</span>
                          <span aria-hidden="true">Tom Cook</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-indigo-600 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-indigo-200 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-x-3">
                    <Image
                      className="h-8 w-auto"
                      src="/logo/logo-dark.png"
                      alt="SplitMonies"
                      height={948}
                      width={1249}
                    />
                    <div className="text-2xl font-black leading-6 text-white">
                      SplitMonies
                    </div>
                  </div>
                </div>
                <a href="#">
                  <span className="sr-only">Your profile</span>
                  <img
                    className="h-8 w-8 rounded-full bg-indigo-700"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </a>
              </div>

              <main className="h-full">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 h-full">
                  <Layout Component={Component} pageProps={pageProps} />
                </div>
              </main>
            </div>
          </RainbowKitProvider>
        </WagmiConfig>
      ) : null}
    </>
  );
}

const Layout = ({ Component, pageProps }: any) => {
  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  } else {
    return <Component {...pageProps} />;
  }
};
