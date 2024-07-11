import clsx from 'clsx';
import { KonvaEventObject } from 'konva/lib/Node';
import React, { useEffect, useRef } from 'react';
import { Layer, Shape, Stage } from 'react-konva';

interface CanvasProps {
  canvasSize?: number;
  drawing: LineProps[];
  setDrawing?: (drawing: LineProps[]) => void;
  onDrawDone?: (drawing: LineProps[]) => void;
}

export interface LineProps {
  points: number[];
  stroke: string;
  width: number;
  tool: string;
  canvasHeight: number;
  canvasWidth: number;
}

export default function Canvas({ drawing, setDrawing, onDrawDone }: CanvasProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = React.useState<string>('pen');
  const [color, setColor] = React.useState<string>('#f58c29');
  const [width, setWidth] = React.useState<number>(5);
  const [canvasWidth, setCanvasWidth] = React.useState<number>(window.innerWidth - 36);
  const [canvasHeight, setCanvasHeight] = React.useState<number>(window.innerHeight - 310);
  const isDrawing = React.useRef(false);

  const colorSelectors = [
    { color: '#f58c29' },
    { color: '#db0632' },
    { color: '#d51668' },
    { color: '#99d9d9' },
    { color: '#20145f' },
    { color: '#18864a' },
  ];

  useEffect(() => {
    const updateSize = () => {
      if (stageRef.current) {
        setCanvasWidth(stageRef.current.offsetWidth);
        setCanvasHeight(stageRef.current.offsetHeight);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) => {
    // Base case 1: Set drawing is defined.
    if (!setDrawing) {
      return;
    }

    const stage = e.target.getStage();

    // Base case 2: Stage is defined.
    if (!stage) {
      return;
    }

    // Base case 3: Position is defined.
    const pos = stage.getPointerPosition();
    if (!pos) {
      return;
    }

    isDrawing.current = true;
    setDrawing([
      ...drawing,
      {
        tool,
        points: [pos.x, pos.y],
        stroke: color,
        width: width,
        canvasWidth,
        canvasHeight,
      },
    ]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) => {
    // Base case 1: Set drawing is defined.
    if (!setDrawing) {
      return;
    }

    const stage = e.target.getStage();

    // Base case 2: Stage is defined.
    if (!stage) {
      return;
    }

    // Base case 3: Position is defined.
    const pos = stage.getPointerPosition();
    if (!pos || pos.x < -1 || pos.y < -1 || pos.x > canvasWidth || pos.y > canvasHeight) {
      return;
    }

    // Base case 4: Drawing is defined.
    if (!isDrawing.current) {
      return;
    }

    // Gets the last line so that we can append the new point to it
    // and connect the lines together.
    const lastLine = drawing[drawing.length - 1];

    const dy = pos.y - lastLine.points[lastLine.points.length - 1];
    const dx = pos.x - lastLine.points[lastLine.points.length - 2];
    const dist = Math.sqrt(dx * dx + dy * dy);

    // If the distance between the last point and the current point is
    // less than 5, we don't need to draw a new point.
    if (dist < 5) {
      return;
    }

    // Adds
    lastLine.points = lastLine.points.concat([pos.x, pos.y]);

    // replace last
    drawing.splice(drawing.length - 1, 1, lastLine);
    setDrawing(drawing.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    if (onDrawDone) {
      onDrawDone(drawing);
    }
  };

  return (
    <div ref={stageRef} className="w-full h-full">
      <Stage
        className={clsx('w-full h-full')}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMousemove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchEnd={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Layer>
          {drawing.map((line, i) => (
            // Using the shape, create a curve that is drawn with the
            // points that are stored in the line.
            <Shape
              key={i}
              sceneFunc={(context, shape) => {
                context.beginPath();
                context.moveTo(line.points[0], line.points[1]);

                // For each point in the line, we need to add a curve
                // to make sure that the line is drawn properly.
                for (let j = 2; j < line.points.length; j += 2) {
                  context.quadraticCurveTo(
                    line.points[j - 2],
                    line.points[j - 1],
                    (line.points[j - 2] + line.points[j]) / 2,
                    (line.points[j - 1] + line.points[j + 1]) / 2,
                  );
                }

                // For the last 2 points of the line, we add a
                // small curve so it looks like the line is
                // being drawn.
                context.quadraticCurveTo(
                  line.points[line.points.length - 2],
                  line.points[line.points.length - 1],
                  line.points[line.points.length - 2] + 0.5,
                  line.points[line.points.length - 1],
                );

                // Fills the shape with the color and then strokes it.
                context.fillStrokeShape(shape);
              }}
              globalCompositeOperation={line.tool === 'eraser' ? 'destination-out' : 'source-over'}
              stroke={line.stroke}
              strokeWidth={line.width}
              tension={0}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
      <div className="flex justify-end mr-8"></div>
      <div className="flex items-center justify-center space-x-4 p-4 ">
        {colorSelectors.map((colorSelector, index) => (
          <button
            key={index}
            style={{ backgroundColor: colorSelector.color }}
            className={clsx(
              'w-8 h-8 rounded-full transition-all',
              color === colorSelector.color ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-110',
            )}
            onClick={() => setColor(colorSelector.color)}
          />
        ))}
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          onClick={() => {
            if (setDrawing) setDrawing(drawing.slice(0, -1));
          }}
        >
          Undo
        </button>
        <select
          className="px-3 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setWidth(parseInt(e.target.value))}
          value={width}
        >
          {[1, 5, 10, 25, 50].map((w) => (
            <option key={w} value={w}>
              {w}px
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2 bg-white border border-gray-300 rounded-full capitalize focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setTool(e.target.value)}
          value={tool}
        >
          {['pen', 'eraser'].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
