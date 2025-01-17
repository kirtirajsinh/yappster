"use client";

import React, { useState } from "react";
import useStore from "@/store/slices";
import Strip from "../Sidebar/Peers/PeerRole/Strip";

// Assets
import { BasicIcons, NestedBasicIcons } from "@/assets/BasicIcons";
import { cn, getFallbackAvatar } from "@/utils/helpers";
import Dropdown from "../common/Dropdown";
import EmojiTray from "../EmojiTray/EmojiTray";
import {
  useLocalPeer,
  useLocalAudio,
  usePeerIds,
  useRoom,
} from "@huddle01/react/hooks";
import toast from "react-hot-toast";
import { NestedPeerListIcons } from "@/assets/PeerListIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

type BottomBarProps = {};

const BottomBar: React.FC<BottomBarProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { peerIds } = usePeerIds();

  const { leaveRoom, closeRoom } = useRoom();

  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio({
    onProduceStart(producer) {
      toast.success("Producer created");
      console.debug("Producer created", producer);
    },
  });

  const sidebarView = useStore((state) => state.sidebar.sidebarView);

  const isChatOpen = useStore((state) => state.isChatOpen);
  const setIsChatOpen = useStore((state) => state.setIsChatOpen);

  const setSidebarView = useStore((state) => state.setSidebarView);

  const setPromptView = useStore((state) => state.setPromptView);

  const {
    role,
    metadata,
    peerId,
    updateMetadata,
    updateRole,
    peerId: localPeerId,
  } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
    isHandRaised: boolean;
  }>();

  const [showLeaveDropDown, setShowLeaveDropDown] = useState<boolean>(false);

  return (
    <div className="fixed bottom-0 w-full flex flex-col sm:flex-row items-center px-3 sm:px-4 md:px-10 justify-between py-3 bg-custom-3 md:bg-transparent z-50">
      {/* Bottom Bar Left */}
      <div className="mb-2 sm:mb-0 w-full sm:w-auto flex justify-center sm:justify-start">
        {role === "host" || role === "coHost" || role === "speaker" ? (
          <div className="mr-auto flex items-center justify-between gap-2 sm:gap-3 w-32 sm:w-44" />
        ) : (
          <OutlineButton className="mr-auto flex items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
            {BasicIcons.requestToSpeak}
            <div className="hidden sm:block">Request to speak</div>
          </OutlineButton>
        )}
      </div>

      {/* Bottom Bar Center */}
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center">
        {role !== "listener" &&
          (!isAudioOn ? (
            <button
              onClick={() => {
                enableAudio();
              }}
            >
              {NestedBasicIcons.inactive.mic}
            </button>
          ) : (
            <button
              onClick={() => {
                disableAudio();
              }}
            >
              {NestedBasicIcons.active.mic}
            </button>
          ))}
        <DropdownMenu
          open={isOpen}
          onOpenChange={() => setIsOpen((prev) => !prev)}
        >
          <DropdownMenuTrigger asChild>
            <button>{BasicIcons.avatar}</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <EmojiTray
              onClick={() => alert("todo")}
              onClose={() => setIsOpen(false)}
            />
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          className="bg-custom-3 border-custom-4 rounded-lg p-2 sm:p-[11px] z-10"
          onClick={() => {
            if (peerId === localPeerId) {
              updateMetadata({
                displayName: metadata?.displayName ?? "Guest",
                avatarUrl: metadata?.avatarUrl ?? getFallbackAvatar(),
                isHandRaised: !metadata?.isHandRaised,
              });
            }
          }}
        >
          {metadata?.isHandRaised
            ? NestedPeerListIcons.active.hand
            : NestedPeerListIcons.inactive.hand}
        </button>
        <Dropdown
          triggerChild={BasicIcons.leave}
          open={showLeaveDropDown}
          onOpenChange={() => setShowLeaveDropDown((prev) => !prev)}
        >
          {role === "host" && (
            <Strip
              type="close"
              title="End spaces for all"
              variant="danger"
              onClick={() => {
                closeRoom();
              }}
            />
          )}
          <Strip
            type="leave"
            title="Leave the space"
            variant="danger"
            onClick={() => {
              leaveRoom();
            }}
          />
        </Dropdown>
      </div>

      {/* Bottom Bar Right */}
      <div className="mt-2 sm:mt-0 flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center">
        <OutlineButton
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          onClick={() => {
            setSidebarView(sidebarView === "peers" ? "close" : "peers");
            if (isChatOpen) {
              setIsChatOpen(false);
            }
          }}
        >
          {BasicIcons.peers}
          <span className="text-xs sm:text-sm">
            {Object.keys(peerIds).filter((peerId) => peerId !== localPeerId)
              .length + 1}
          </span>
        </OutlineButton>
        <OutlineButton
          className="flex items-center"
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            if (sidebarView !== "close") {
              setSidebarView("close");
            }
          }}
        >
          {BasicIcons.chat}
        </OutlineButton>
      </div>
    </div>
  );
};
export default React.memo(BottomBar);

interface OutlineButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const OutlineButton: React.FC<OutlineButtonProps> = ({
  className,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    type="button"
    className={cn(
      "border border-custom-4 rounded-lg py-1 px-2 sm:py-2 sm:px-3",
      className
    )}
  >
    {children}
  </button>
);
