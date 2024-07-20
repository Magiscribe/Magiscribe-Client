import { useState } from 'react';
import Canvas, { LineProps } from '../../components/canvas';

export default function CanvasDashboard() {
  const [drawing, setDrawing] = useState<LineProps[]>([]);

  return (
    <div className="bg-white container max-w-12xl mx-auto px-4 py-8 rounded-2xl shadow-xl text-slate-700">
      <h1 className="text-3xl font-bold">Canvas</h1>
      <div className="flex justify-center mt-8">
        <Canvas drawing={drawing} setDrawing={setDrawing} />
      </div>
    </div>
  );
}
