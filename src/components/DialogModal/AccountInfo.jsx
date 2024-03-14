"use client";
import { Dialog } from "@headlessui/react";
import dayjs from "dayjs";

export default function AccountInfoModal({
  bots,
  interactedWalletOnModal,
  setInteractedWalletOnModal,
  isOpenModalAccountInfo,
  setIsOpenModalAccountInfo,
}) {
  const bot =
    bots
      .filter((b) => b.BOT.publicData?.createdAt)
      .find(
        (b) =>
          b.BOT.data.player.cryptoWallets[0].address ==
          interactedWalletOnModal[0]
      ) ?? false;
  const gettt = bot ? true : false;
  const closeModal = () => {
    setIsOpenModalAccountInfo(false);
    setInteractedWalletOnModal([]);
  };

  return (
    bot && (
      <Dialog
        open={isOpenModalAccountInfo && gettt}
        className="relative z-50 text-xs"
        onClose={closeModal}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-3">
            <Dialog.Title className={`text-lg font-bold my-2`}>
              Account Info
            </Dialog.Title>
            <span className="py-2">
              Created At:{" "}
              {dayjs(bot.BOT.publicData.createdAt).format("DD/MM/YYYY")}
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col">
                <span>Username: {bot.BOT.data.player.username}</span>
                <span>Address: {interactedWalletOnModal[0]}</span>
              </div>
              <hr />
              {Object.keys(bot.BOT.publicData.levels).length > 0 && (
                <>
                  <b>Levels</b>
                  <div className="grid grid-cols-2">
                    {Object.keys(bot.BOT.publicData.levels).map((farming) => (
                      <span key={farming} className="uppercase">
                        {farming}: lv {bot.BOT.publicData.levels[farming].level}
                      </span>
                    ))}
                  </div>
                  <hr />
                </>
              )}
              {Object.keys(bot.BOT.publicData.memberships).length > 0 && (
                <>
                  <b>Socials</b>
                  <div className="grid grid-cols-2">
                    {Object.keys(bot.BOT.publicData.memberships).map(
                      (social) => (
                        <span key={social} className="uppercase">
                          {social}
                        </span>
                      )
                    )}
                  </div>
                </>
              )}

              <button
                onClick={closeModal}
                className="px-2 py-1 border mt-2 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    )
  );
}
