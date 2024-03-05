"use client";
import { Combobox, Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
const savedFarms = [2203, 755, 4081, 2780, 2788, 2781, 2784];

export default function RespawnLocationModal({
  interactedWalletOnModal,
  setInteractedWalletOnModal,
  isOpenModalRespawn,
  setIsOpenModalRespawn,
  respawn,
}) {
  const [respawnLocation, setRepawnLocation] = useState("sauna");
  const [gotoLocation, setGotoLocation] = useState("carnival");
  const [nftFarmLocation, setNftFarmLocation] = useState(savedFarms[0]);
  const [query, setQuery] = useState("");

  const closeModal = () => {
    setIsOpenModalRespawn(false);
    setInteractedWalletOnModal([]);
  };

  const teleportNFT = () => {
    respawn(interactedWalletOnModal, {
      location: "nftfarm",
      farmId: nftFarmLocation,
    });
    closeModal();
  };
  const teleportRespawn = () => {
    respawn(interactedWalletOnModal, {
      location: respawnLocation,
    });
    closeModal();
  };
  const teleportGoto = () => {
    respawn(interactedWalletOnModal, {
      location: gotoLocation,
    });
    closeModal();
  };
  const filteredFarms =
    savedFarms === ""
      ? savedFarms
      : savedFarms
          .filter((farm) => farm != query)
          .filter((farm) => {
            return farm.toString().toLowerCase().includes(query.toLowerCase());
          });

  return (
    <Dialog
      open={isOpenModalRespawn}
      onClose={closeModal}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-3">
          <Dialog.Title className={`text-lg font-bold my-2`}>
            Teleport (Respawn)
          </Dialog.Title>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-1.5 w-full">
              <b>Respawn:</b>
              <div className="flex flex-row items-center gap-2.5  w-full">
                <select
                  className="w-full border p-1 outline-none"
                  onChange={(e) => setRepawnLocation(e.target.value)}
                >
                  <option value="sauna">Sauna</option>
                  <option value="drunkengoose">Drunken Goose</option>

                  <option value="kitchen">Karen&apos;s Kitchen</option>
                </select>
                <button
                  className="px-2 py-1 bg-sky-400 text-white rounded-md"
                  onClick={teleportRespawn}
                >
                  Teleport
                </button>
              </div>
              <hr />
            </div>
            <div className="flex flex-col gap-1.5  w-full">
              <b>Goto:</b>
              <div className="flex flex-row items-center gap-2.5  w-full">
                <select
                  onChange={(e) => setGotoLocation(e.target.value)}
                  className="w-full border p-1 outline-none"
                  value={gotoLocation}
                >
                  <option value="carnival">Carnival Farm</option>
                  <option value="store">Buck Galore</option>
                  <option value="wine">Wine Brewer</option>
                </select>
                <button
                  className="px-2 py-1 bg-sky-400 text-white rounded-md"
                  onClick={teleportGoto}
                >
                  Teleport
                </button>
              </div>
              <hr />
            </div>
            <div className="flex flex-col gap-1.5">
              <b>NFT Farm:</b>
              <div className="flex flex-row items-center gap-2.5">
                <Combobox value={nftFarmLocation} onChange={setNftFarmLocation}>
                  <div className="relative">
                    <Combobox.Input
                      className="w-full border p-1 outline-none"
                      onChange={(event) => {
                        if (event.target.value < 0) {
                          setQuery("1");
                        } else if (event.target.value > 5000) {
                          setQuery("5000");
                        } else {
                          setQuery(event.target.value);
                        }
                      }}
                      displayValue={(person) => {
                        if (person < 0) {
                          return "1";
                        } else if (person > 5000) {
                          return "5000";
                        } else {
                          return person;
                        }
                      }}
                    />
                    <Combobox.Options
                      className={"absolute top-10 bg-white w-full"}
                    >
                      {query.length > 0 && (
                        <Combobox.Option
                          className={`hover:bg-gray-200 px-1 py-0.5 hover:cursor-pointer`}
                          value={query}
                        >
                          {query}
                        </Combobox.Option>
                      )}
                      {filteredFarms.map((person) => (
                        <Combobox.Option
                          className={`hover:bg-gray-200 px-1 py-0.5 hover:cursor-pointer`}
                          key={person}
                          value={person}
                        >
                          {person}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </div>
                </Combobox>
                {/* <input
                  type="number"
                  className="w-full border p-1 outline-none"
                  placeholder="farmId"
                  value={nftFarmLocation}
                  onChange={(e) => {
                    setNftFarmLocation(e.target.value);
                  }}
                /> */}
                <button
                  className="px-2 py-1 bg-sky-400 text-white rounded-md"
                  onClick={teleportNFT}
                >
                  Teleport
                </button>
              </div>
            </div>
          </div>
          <hr />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
