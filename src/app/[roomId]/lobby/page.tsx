"use client";

import Image from "next/image";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

// Assets
import { toast } from "react-hot-toast";
import { BasicIcons } from "@/assets/BasicIcons";

// Components
import FeatCommon from "@/components/common/FeatCommon";
import AvatarWrapper from "@/components/common/AvatarWrapper";

// Store
import useStore from "@/store/slices";

// Hooks
import { useRoom } from "@huddle01/react/hooks";

type TLobboyProps = { params: Promise<{ roomId: string }> };

const Lobby = (props: TLobboyProps) => {
  const params = use(props.params);
  // Local States
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const avatarUrl = useStore((state) => state.avatarUrl);
  const setAvatarUrl = useStore((state) => state.setAvatarUrl);
  const setUserDisplayName = useStore((state) => state.setUserDisplayName);
  const userDisplayName = useStore((state) => state.userDisplayName);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const { push } = useRouter();

  // Huddle Hooks
  const { joinRoom, state } = useRoom();

  const handleStartSpaces = async () => {
    setIsJoining(true);
    let token = "";
    if (state !== "connected") {
      const response = await fetch(
        `/token?roomId=${params.roomId}&name=${userDisplayName}`
      );
      token = await response.text();
    }

    if (!userDisplayName.length) {
      toast.error("Display name is required!");
      return;
    }
    await joinRoom({
      roomId: params.roomId,
      token,
    });
    setIsJoining(false);
  };

  useEffect(() => {
    if (state === "connected") {
      push(`/${params.roomId}`);
    }
  }, [state]);

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-lobby text-slate-100">
      <div className="flex flex-col items-center justify-center gap-4 w-[26.25rem]">
        <div className="relative text-center flex items-center justify-center w-fit mx-auto">
          <Image
            src={avatarUrl}
            alt="audio-spaces-img"
            width={125}
            height={125}
            className="maskAvatar object-contain"
            quality={100}
            priority
          />
          <video
            src={avatarUrl}
            muted
            className="maskAvatar absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2"
            // autoPlay
            loop
          />
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            type="button"
            className="text-white absolute bottom-0 right-0 z-10"
          >
            {BasicIcons.edit}
          </button>
          <FeatCommon
            onClose={() => setIsOpen(false)}
            className={
              isOpen
                ? "absolute top-4 block"
                : "absolute top-1/2 -translate-y-1/2 hidden "
            }
          >
            <div className="relative mt-5">
              <div className="grid-cols-3  grid h-full w-full  place-items-center   gap-6  px-6 ">
                {Array.from({ length: 20 }).map((_, i) => {
                  const url = `/avatars/avatars/${i}.png`;

                  return (
                    <AvatarWrapper
                      key={`sidebar-avatars-${i}`}
                      isActive={avatarUrl === url}
                      onClick={() => {
                        setAvatarUrl(url);
                      }}
                    >
                      <Image
                        src={url}
                        alt={`avatar-${i}`}
                        width={45}
                        height={45}
                        loading="lazy"
                        className="object-contain"
                      />
                    </AvatarWrapper>
                  );
                })}
              </div>
            </div>
          </FeatCommon>
        </div>
        <div className="flex items-center w-full flex-col">
          <div className="flex flex-col justify-center w-full gap-1">
            Set a display name
            <div className="flex w-full items-center rounded-[10px] border px-3 text-slate-300 outline-none border-zinc-800 backdrop-blur-[400px] focus-within:border-slate-600 gap-">
              <div className="mr-2">
                <Image
                  alt="user-icon"
                  src="/images/user-icon.svg"
                  className="w-5 h-5"
                  width={30}
                  height={30}
                />
              </div>
              <input
                value={userDisplayName}
                onChange={(e) => {
                  setUserDisplayName(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleStartSpaces()}
                type="text"
                placeholder="Enter your name"
                className="flex-1 bg-transparent py-3 outline-none"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center w-full">
          <button
            className="flex items-center justify-center bg-[#246BFD] text-slate-100 rounded-md p-2 mt-2 w-full"
            onClick={handleStartSpaces}
          >
            {isJoining ? "Joining Spaces..." : "Start Spaces"}
            {!isJoining && (
              <Image
                alt="narrow-right"
                width={30}
                height={30}
                src="/images/arrow-narrow-right.svg"
                className="w-6 h-6 ml-1"
              />
            )}
          </button>
        </div>
      </div>
    </main>
  );
};
export default Lobby;
