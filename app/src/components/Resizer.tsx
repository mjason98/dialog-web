import { useEffect, useRef } from "react";

type Props = {
  onResize: (delta: number) => void;
  side: "left" | "right";
};

export default function Resizer({ onResize, side }: Props) {
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (startX.current == null) return;
      const delta = e.clientX - startX.current;
      startX.current = e.clientX;
      onResize(side === "left" ? delta : -delta);
    };
    const onUp = () => {
      startX.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [onResize, side]);

  return (
    <div
      onMouseDown={(e) => {
        startX.current = e.clientX;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      }}
      className="w-1.5 cursor-col-resize bg-rose-200 hover:bg-rose-400 active:bg-rose-500 transition-colors shrink-0"
      title="drag to resize"
    />
  );
}
