"use client";
import { Combobox, Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
export const cookRecipes = [
  { name: "Pancakes", value: 0, time: 15 },
  { name: "Plain Omelet", value: 1, time: 10 },
  { name: "Popberry Pie", value: 2, time: 24 },
  { name: "Popberry Loaf", value: 3, time: 24 },
  { name: "Grumpkin Pie", value: 4, time: 30 },
];

export default function CookingModal({
  interactedWalletOnModal,
  setInteractedWalletOnModal,
  isOpenModalCooking,
  setIsOpenModalCooking,
  cooking,
}) {
  const [selectedRecipes, setSelectedRecipes] = useState(cookRecipes[0]);
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(10);

  const closeModal = () => {
    setIsOpenModalCooking(false);
    setInteractedWalletOnModal([]);
  };

  const filteredRecipes =
    cookRecipes === ""
      ? cookRecipes
      : cookRecipes
          .filter((farm) => farm.name != query)
          .filter((farm) => {
            return farm.name
              .toString()
              .toLowerCase()
              .includes(query.toLowerCase());
          });
  const processCooking = () => {
    cooking(interactedWalletOnModal, {
      name: selectedRecipes.value,
      count,
    });
    closeModal();
  };
  return (
    <Dialog
      open={isOpenModalCooking}
      onClose={closeModal}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-3">
          <Dialog.Title className={`text-lg font-bold my-2`}>
            Cooking
          </Dialog.Title>

          <div className="flex flex-col gap-2 w-full">
            <Combobox value={selectedRecipes} onChange={setSelectedRecipes}>
              <div className="relative">
                <Combobox.Input
                  className="w-full border p-1 outline-none"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(person) => person.name}
                />
                <Combobox.Options className={"absolute top-10 bg-white w-full"}>
                  {filteredRecipes.map((person) => (
                    <Combobox.Option
                      className={`hover:bg-gray-200 px-1 py-0.5 hover:cursor-pointer`}
                      key={person.value}
                      value={person}
                    >
                      {person.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
            <input
              type="number"
              className="p-1 border rounded"
              placeholder="total"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="50"
            />
            <button
              className="bg-emerald-400 p-1 text-white rounded"
              onClick={processCooking}
            >
              Process
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
