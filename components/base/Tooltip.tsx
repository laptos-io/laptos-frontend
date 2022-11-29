import dynamic from "next/dynamic";
import { forwardRef, ReactNode, useCallback, useState } from "react";

import { PopoverProps } from "./Popover";

const Popover = dynamic(() => import("./Popover"), {
  ssr: false,
});

const noOp = () => null;
const TooltipContainer = forwardRef(
  (
    props: {
      children: ReactNode;
      onMouseEnter?: (() => void) | undefined;
      onMouseLeave?: (() => void) | undefined;
    },
    ref: any
  ) => {
    return (
      <div
        className="z-[9998] max-w-[256px] cursor-default break-words rounded border border-solid border-slate-200 bg-slate-100 py-2 px-4 font-normal shadow"
        ref={ref}
      >
        {props.children}
      </div>
    );
  }
);
TooltipContainer.displayName = "TooltipContainer";
interface TooltipProps extends Omit<PopoverProps, "content"> {
  text: ReactNode;
  open?: () => void;
  close?: () => void;
  noOp?: () => void;
  disableHover?: boolean; // disable the hover and content display
}

interface TooltipContentProps extends Omit<PopoverProps, "content"> {
  content: ReactNode;
  onOpen?: () => void;
  // whether to wrap the content in a `TooltipContainer`
  wrap?: boolean;
  disableHover?: boolean; // disable the hover and content display
}

export default function Tooltip({
  text,
  open,
  close,
  noOp,
  disableHover,
  ...rest
}: TooltipProps) {
  return (
    <Popover
      content={
        text && (
          <TooltipContainer
            onMouseEnter={disableHover ? noOp : open}
            onMouseLeave={disableHover ? noOp : close}
          >
            {text}
          </TooltipContainer>
        )
      }
      {...rest}
    />
  );
}

function TooltipContent({
  content,
  wrap = false,
  ...rest
}: TooltipContentProps) {
  return (
    <Popover
      content={wrap ? <TooltipContainer>{content}</TooltipContainer> : content}
      {...rest}
    />
  );
}

/** Standard text tooltip. */
export function MouseoverTooltip({
  text,
  disableHover,
  children,
  ...rest
}: Omit<TooltipProps, "show">) {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <Tooltip
      {...rest}
      open={open}
      close={close}
      noOp={noOp}
      disableHover={disableHover}
      show={show}
      text={disableHover ? null : text}
    >
      <div
        onMouseEnter={disableHover ? noOp : open}
        onMouseLeave={disableHover ? noOp : close}
      >
        {children}
      </div>
    </Tooltip>
  );
}

/** Tooltip that displays custom content. */
export function MouseoverTooltipContent({
  content,
  children,
  onOpen: openCallback = undefined,
  disableHover,
  ...rest
}: Omit<TooltipContentProps, "show">) {
  const [show, setShow] = useState(false);
  const open = useCallback(() => {
    setShow(true);
    openCallback?.();
  }, [openCallback]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <TooltipContent
      {...rest}
      show={show}
      content={disableHover ? null : content}
    >
      <div
        className="inline-block p-1 leading-[0]"
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </div>
    </TooltipContent>
  );
}
