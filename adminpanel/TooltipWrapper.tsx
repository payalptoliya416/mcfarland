// components/TooltipWrapper.tsx
"use client";

import * as Tooltip from "@radix-ui/react-tooltip";

export function TooltipWrapper({
  children,
  content,
  side = "top",
}: {
  children: React.ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className="inline-flex">{children}</span>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            align="center"
            sideOffset={8}
            collisionPadding={12}
            className="
              z-[9999]
              max-w-[180px]
              rounded-md
              bg-black/80
              px-2.5
              py-1.5
              text-[11px]
              leading-[14px]
              text-white
              text-center
              shadow-lg
              break-words
            "
          >
            {content}
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
