import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { useState } from "react";

type shape = "circle" | "rect" | "pencil";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<shape>("circle");

  useEffect(() => {
    //@ts-ignore
    window.selectedTool = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <div>
      <canvas ref={canvasRef} width={outerWidth} height={innerHeight}></canvas>
      <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
  );
}

function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: shape;
  setSelectedTool: (s: shape) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
      }}
    >
      <div className="flex gap-2">
        <IconButton
          activated={selectedTool === "pencil"}
          icon={<Pencil />}
          onClick={() => {
            setSelectedTool("pencil");
          }}
        ></IconButton>
        <IconButton
          activated={selectedTool === "rect"}
          icon={<RectangleHorizontalIcon />}
          onClick={() => {
            {
              setSelectedTool("rect");
            }
          }}
        ></IconButton>
        <IconButton
          activated={selectedTool === "circle"}
          icon={<Circle />}
          onClick={() => {
            {
              setSelectedTool("circle");
              console.log(selectedTool)
            }
          }}
        ></IconButton>
      </div>
    </div>
  );
}
