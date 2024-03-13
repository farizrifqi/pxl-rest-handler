"use client";
import { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { censorAddress } from "@/lib/helper";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import RespawnLocationModal from "../DialogModal/RespawnLocationModal";
import CookingModal from "../DialogModal/CookingModal";
import { AppContext } from "../Context/IOSocket";
import NotesComponent from "../Notes";
import AccountInfoModal from "../DialogModal/AccountInfo";

// const socket = io("ws://localhost:2601", {
//   transports: ["websocket"],
//   forceNew: false,
// });
export default function IndexPage() {
  const {
    bots,
    socket,
    initializeSocket,
    monitorLogs,
    isLoaded,
    socketUrl,
    setSocketUrl,
    os,
  } = useContext(AppContext);

  // const [bots, setBots] = useState([]);
  const [connected, setConnected] = useState(false);
  // const [monitorLogs, setMonitorLogs] = useState([]);
  const [selectedBots, setSelectedBots] = useState([]);
  const [refreshing, setRereshing] = useState(false);
  const [sUrl, setSUrl] = useState(socketUrl);
  // ! Interacted Wallet
  const [interactedWalletOnModal, setInteractedWalletOnModal] = useState([]);
  const [selectedWorld, setSelectedWorld] = useState("55");
  // ! Modal
  let [isOpenModalRespawn, setIsOpenModalRespawn] = useState(false);
  let [isOpenModalCooking, setIsOpenModalCooking] = useState(false);
  let [isOpenModalAccountInfo, setIsOpenModalAccountInfo] = useState(false);

  // const updateMonitorLogs = (newLogs) => {
  //   setMonitorLogs((old) => [newLogs, ...old]);
  // };
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      let url = localStorage.getItem("socketUrl");
      if (url) {
        setSocketUrl(url);
        initializeSocket(url);
        setSUrl(url);
      }
    }
  }, []);
  const openBrowser = (accounts = selectedBots) => {
    socket.emit(
      "doAction",
      JSON.stringify({
        action: "openAccount",
        accounts,
        worldId: selectedWorld,
      })
    );
  };
  const closeBrowser = (accounts = selectedBots) => {
    socket.emit(
      "doAction",
      JSON.stringify({ action: "closeAccount", accounts })
    );
  };
  const harvestBee = (accounts = selectedBots) => {
    socket.emit("doAction", JSON.stringify({ action: "harvestBee", accounts }));
  };
  const getEnergy = (accounts = selectedBots) => {
    socket.emit("doAction", JSON.stringify({ action: "getEnergy", accounts }));
  };
  const respawn = (accounts = selectedBots, data) => {
    socket.emit(
      "doAction",
      JSON.stringify({ action: "respawnLocation", accounts, ...data })
    );
  };
  const cooking = (accounts = selectedBots, data) => {
    socket.emit(
      "doAction",
      JSON.stringify({ action: "cook", accounts, ...data })
    );
  };
  const updateSelectedBots = (wallet) => {
    const temp = [...selectedBots];
    const index = temp.indexOf(wallet);
    if (index > -1) {
      // only splice array when item is found
      temp.splice(index, 1); // 2nd parameter means remove one item only
    } else {
      temp.push(wallet);
    }
    setSelectedBots(temp);
  };
  const refreshData = () => {
    setRereshing(true);
    socket.emit("requestData", "botsData");
    socket.emit("requestData", "regularData");
    setTimeout(() => {
      setRereshing(false);
    }, 2000);
  };
  const openRespawnModal = (wallet) => {
    setIsOpenModalRespawn(true);
    setInteractedWalletOnModal(wallet);
  };
  const openCookingModal = (wallet) => {
    setIsOpenModalCooking(true);
    setInteractedWalletOnModal(wallet);
  };
  const openAccountModal = (wallet) => {
    setIsOpenModalAccountInfo(true);
    setInteractedWalletOnModal(wallet);
  };
  if (!isLoaded) {
    return <>Loading...</>;
  }
  return socket ? (
    <div className="w-full flex flex-col gap-1">
      <div className="grid grid-cols-1 lg:flex lg:flex-row items-tart justify-between my-2">
        <pre
          className={`lg:block hidden select-none ${
            !connected ? "text-red-600" : "text-green-500"
          } font-bold py-5`}
        >
          {` _______   __    __  __       
/       \ /  |  /  |/  |      
$$$$$$$  |$$ |  $$ |$$ |      
$$ |__$$ |$$  \/$$/ $$ |      
$$    $$/  $$  $$<  $$ |      
$$$$$$$/    $$$$  \ $$ |      
$$ |       $$ /$$  |$$ |_____ 
$$ |      $$ |  $$ |$$       |
$$/       $$/   $$/ $$$$$$$$/ `}
        </pre>
        <div className="flex flex-col justify-center py-2 text-left w-fit">
          <b className="uppercase">World</b>
          <input
            type="number"
            value={selectedWorld}
            min="1"
            max="99"
            onChange={(e) => setSelectedWorld(e.target.value)}
            className="border px-1 py-0.5 rounded outline-none w-24"
          />
        </div>
        <div className="w-1/2 p-2 flex flex-col gap-0.5">
          <div className="flex flex-row items-center gap-2">
            <input
              type="password"
              className="px-2 border py-1 outline-none rounded"
              value={sUrl}
              onChange={(e) => setSUrl(e.target.value)}
            />
            <button
              className="px-2 border py-1 rounded"
              onClick={() => initializeSocket(sUrl)}
            >
              Connect
            </button>
          </div>
          <p>OS: {os}</p>
          <Disclosure defaultOpen={true}>
            <Disclosure.Button
              className={`font-bold border px-2 py-1 text-left`}
            >
              Monitor
            </Disclosure.Button>
            <Disclosure.Panel className={`h-full`}>
              <textarea
                className=" resize-none h-3/4 p-2 w-full bg-slate-500 overflow-y-scroll text-xs"
                value={monitorLogs.join("\n")}
                readOnly
              ></textarea>
            </Disclosure.Panel>
          </Disclosure>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1.5">
          <div>Total Accounts: {bots.length}</div>
          <div className="text-xs">
            Selected Accounts: {selectedBots.length}
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 text-lg font-bold border-lime-400 border rounded-md px-2 py-1 bg-blue-900 text-white">
          <img className="w-6 h-6" src="/image/cur_pixel.png" />
          {bots
            .map(
              (b) =>
                b.BOT.data.player.coinInventory.find(
                  (c) => c.currencyId == "cur_pixel"
                ).balance
            )
            .reduce((partialSum, a) => partialSum + a, 0)}{" "}
          $PIXELS
        </div>
        <div className="flex flex-row items-center gap-2">
          <button
            onClick={refreshData}
            disabled={refreshing}
            className={`disabled:bg-emerald-700 disabled:cursor-progress flex flex-row items-center bg-emerald-500 border px-2 py-1 rounded-md text-white`}
          >
            <i className="fa fa-refresh"></i> Refresh Data
          </button>
          <button
            onClick={() => setSelectedBots([])}
            disabled={selectedBots.length < 1}
            className={`disabled:bg-gray-200 disabled:cursor-progress flex flex-row items-center border px-2 py-1 rounded-md text-black bg-gray-200`}
          >
            <i className="fa fa-refresh"></i> Unselect
          </button>
          <button
            disabled={true}
            className={`disabled:bg-red-700 disabled:cursor-progress flex flex-row items-center bg-red-500 border px-2 py-1 rounded-md text-white hidden`}
          >
            <i className="fa fa-refresh"></i> Save Shutdown
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-1 text-xs w-full">
        {bots.map((bot, i) => {
          const disabled = bot.BOT.status != null;
          const wallet = bot.BOT.data.player.cryptoWallets[0].address;
          const accUsername = bot.BOT.data.player.username;
          const coins = bot.BOT.data.player.coinInventory.find(
            (c) => c.currencyId == "cur_coins"
          )?.balance;
          const pixel = bot.BOT.data.player.coinInventory.find(
            (c) => c.currencyId == "cur_pixel"
          )?.balance;
          return (
            <div
              key={i}
              title={`A`}
              className={`bg-white border rounded-md px-3 py-2 drop-shadow-md flex flex-col gap-1 w-full hover:cursor-default ${
                selectedBots.includes(wallet) ? "border-blue-500" : ""
              }`}
            >
              <div
                onClick={() => openAccountModal([wallet])}
                className={
                  "border-b flex flex-row justify-star items-center gap-2 hover:cursor-pointer"
                }
              >
                <span className={`${bot.BOT.browser && "animate-pulse"}`}>
                  {bot.BOT.browser ? "🟢" : "🔴"}
                </span>
                <span className="text-lg font-bold">
                  {bot.BOT.data.player.username}
                </span>
                {/* <span className="border px-2 text-xs font-extralight rounded">
                  {censorAddress(wallet)}
                </span> */}
              </div>
              <div className="w-full">
                <div
                  className={`w-full text-white rounded-md px-2 py-0.5 ${
                    bot.BOT.status == null
                      ? "bg-gray-400 font-bold"
                      : "bg-emerald-500 font-light"
                  }`}
                >
                  {bot.BOT.status == null ? "IDLE" : bot.BOT.status}
                </div>
              </div>
              <div className="flex flex-row items-center gap-3">
                <div className="flex flex-row items-center gap-1">
                  <img className="w-4 h-4" src="/image/cur_pixel.png" />
                  {pixel.toLocaleString(2)}
                </div>
                <div className="flex flex-row items-center gap-1">
                  <img className="w-4 h-4" src="/image/cur_coins.png" />
                  {coins.toLocaleString(2)}
                </div>
                <div
                  className="flex flex-row items-center gap-1"
                  title={bot.BOT.bees.map((f) => f.farmId).join(", ")}
                >
                  <img className="w-4 h-4" src="/image/honey.png" />
                  {bot.BOT.bees.length}
                </div>
                <div
                  className="flex flex-row items-center gap-1"
                  title="Trust Score"
                >
                  👍 <span>{bot.BOT.data.player.trustScore.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <Disclosure defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="disclosure-button-bot">
                        Action
                      </Disclosure.Button>
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel className="disclosure-wrapper-bot">
                          <div className="flex flex-row gap-0.5">
                            <button
                              onClick={() => harvestBee([wallet])}
                              disabled={disabled || bot.BOT.bees.length < 1}
                              className="button-control hidden"
                              title={
                                disabled
                                  ? `Currently doing ${bot.BOT.status}.`
                                  : bot.BOT.bees.length < 1
                                  ? "No Data"
                                  : "Harvest Honey"
                              }
                            >
                              Harvest
                            </button>
                            <button
                              onClick={() => getEnergy([wallet])}
                              disabled={disabled}
                              className="button-control"
                            >
                              Get Energy
                            </button>

                            <button
                              onClick={() => openRespawnModal([wallet])}
                              disabled={disabled}
                              className="button-control"
                            >
                              Respawn
                            </button>
                            <button
                              onClick={() => openCookingModal([wallet])}
                              disabled={disabled}
                              className="button-control"
                            >
                              Cooking
                            </button>
                          </div>
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
                <Disclosure defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="disclosure-button-bot">
                        Control
                      </Disclosure.Button>
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel className="disclosure-wrapper-bot">
                          <div className="flex flex-row gap-0.5">
                            <button
                              onClick={() => openBrowser([wallet])}
                              className="button-control"
                              disabled={
                                (bot.BOT.browser && bot.BOT.page) ||
                                (os && os.toString().includes("linux"))
                              }
                            >
                              Open Browser
                            </button>
                            <button
                              onClick={() => closeBrowser([wallet])}
                              className="button-control"
                            >
                              Force Close Browser
                            </button>
                          </div>
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
                <button
                  className={`px-2 py-1 border m-2 rounded-lg  ${
                    selectedBots.includes(wallet)
                      ? "bg-gray-200"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => updateSelectedBots(wallet)}
                >
                  {selectedBots.includes(wallet) ? "Selected" : "Select"}
                </button>
                <NotesComponent username={accUsername} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="border px-5 py-3 my-2 w-full text-xs">
        <h2 className="font-bold text-base border-b mb-1 py-1">
          Multi Controller
        </h2>
        <div className="flex flex-col">
          <p className="font-bold">
            Selected: ({selectedBots.length} accounts)
          </p>
          <div className="flex flex-row my-1 gap-1">
            {selectedBots.map((bot, i) => {
              const bt = bots.find(
                (b) => b.BOT.data.player.cryptoWallets[0].address == bot
              )?.BOT;

              return (
                bt && (
                  <div className="border px-1 py-0.5 rounded" key={i}>
                    {bt.data.player.username}
                  </div>
                )
              );
            })}
          </div>
        </div>
        <hr className="my-2" />
        <div className="flex items-center gap-1">
          <button
            onClick={() => openBrowser()}
            className="button-control"
            disabled={os && os.toString().includes("linux")}
          >
            Open Browser
          </button>
          <button onClick={() => closeBrowser()} className="button-control">
            Close Browser
          </button>
          <button
            onClick={() => harvestBee()}
            className="button-control hidden"
          >
            Harvest
          </button>
          <button onClick={() => getEnergy()} className="button-control">
            AFK Energy
          </button>
        </div>
      </div>
      <RespawnLocationModal
        respawn={respawn}
        setInteractedWalletOnModal={setInteractedWalletOnModal}
        setIsOpenModalRespawn={setIsOpenModalRespawn}
        isOpenModalRespawn={isOpenModalRespawn}
        interactedWalletOnModal={interactedWalletOnModal}
      />
      <CookingModal
        cooking={cooking}
        setInteractedWalletOnModal={setInteractedWalletOnModal}
        interactedWalletOnModal={interactedWalletOnModal}
        setIsOpenModalCooking={setIsOpenModalCooking}
        isOpenModalCooking={isOpenModalCooking}
      />
      <AccountInfoModal
        bots={bots}
        interactedWalletOnModal={interactedWalletOnModal}
        setInteractedWalletOnModal={setInteractedWalletOnModal}
        setIsOpenModalAccountInfo={setIsOpenModalAccountInfo}
        isOpenModalAccountInfo={isOpenModalAccountInfo}
      />
    </div>
  ) : (
    <div className="w-full flex flex-col gap-1 items-center py-24">
      <div className="flex flex-row items-center gap-2">
        <input
          type="password"
          className="px-2 border py-1 outline-none rounded"
          value={sUrl}
          onChange={(e) => setSUrl(e.target.value)}
        />
        <button
          className="px-2 border py-1 rounded"
          onClick={() => initializeSocket(sUrl)}
        >
          Connect
        </button>
      </div>
    </div>
  );
}
