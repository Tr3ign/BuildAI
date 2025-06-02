import React, { useState, useEffect } from 'react';

function BlueprintGenerator() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [numRooms, setNumRooms] = useState(1);
  const [layoutType, setLayoutType] = useState('linear');
  const [blueprintData, setBlueprintData] = useState(null);
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    loadPyodide().then((py) => {
      setPyodide(py);
      py.loadPackage(['numpy', 'opencv-python']);
    });
  }, []);

  const generateBlueprint = async () => {
    if (!pyodide || !width || !height || !numRooms) return;

    const result = await pyodide.runPythonAsync(`
      import numpy as np
      from js import document, width, height, numRooms, layoutType

      room_width = float(width)
      room_height = float(height)
      num_rooms = int(numRooms)
      layout = layoutType

      scale = 10
      blueprint = np.zeros((int(room_height * scale * (num_rooms if layout == 'linear' else int(num_rooms ** 0.5))), int(room_width * scale * (int(num_rooms ** 0.5) if layout == 'square' else 1))))

      if layout == 'linear':
          for i in range(num_rooms):
              blueprint[i * int(room_height * scale):(i + 1) * int(room_height * scale), :] = 1
      else:  # square
          cols = int(num_rooms ** 0.5)
          for i in range(num_rooms):
              row = i // cols
              col = i % cols
              blueprint[row * int(room_height * scale):(row + 1) * int(room_height * scale), col * int(room_width * scale):(col + 1) * int(room_width * scale)] = 1

      suggestion = "Add windows for natural light" if room_width * room_height * num_rooms < 200 else "Layout optimized"
      {'blueprint': blueprint.tolist(), 'suggestion': suggestion}
    `, { width, height, numRooms, layoutType });

    setBlueprintData(result);
    drawBlueprint(result.blueprint, layoutType === 'square' ? int(numRooms ** 0.5) : numRooms);
  };

  const drawBlueprint = (data, rows) => {
    const canvas = document.getElementById('blueprintCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    const scale = 10;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j] === 1) {
          ctx.beginPath();
          ctx.rect(j, i, scale, scale);
          ctx.stroke();
          if (j % scale === 0 && i === data.length - scale) { // Door
            ctx.beginPath();
            ctx.moveTo(j + scale / 2 - 2, i + scale);
            ctx.lineTo(j + scale / 2 + 2, i + scale);
            ctx.strokeStyle = '#FF0000';
            ctx.stroke();
            ctx.strokeStyle = '#000';
          }
        }
      }
    }
  };

  const downloadBlueprint = () => {
    const canvas = document.getElementById('blueprintCanvas');
    const link = document.createElement('a');
    link.download = 'blueprint.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Blueprint Generator</h2>
      <div className="space-y-2">
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          placeholder="Room Width (ft)"
          className="w-full p-2 border rounded"
          min="1"
        />
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Room Height (ft)"
          className="w-full p-2 border rounded"
          min="1"
        />
        <input
          type="number"
          value={numRooms}
          onChange={(e) => setNumRooms(e.target.value)}
          placeholder="Number of Rooms"
          className="w-full p-2 border rounded"
          min="1"
          max="5"
        />
        <select
          value={layoutType}
          onChange={(e) => setLayoutType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="linear">Linear Layout</option>
          <option value="square">Square Layout</option>
        </select>
        <button
          onClick={generateBlueprint}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Generate Blueprint
        </button>
        <canvas id="blueprintCanvas" width="600" height="400" className="border mt-2"></canvas>
        <button
          onClick={downloadBlueprint}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 mt-2"
        >
          Download Blueprint (PNG)
        </button>
        {blueprintData && <p className="mt-2 text-gray-700">Suggestion: {blueprintData.suggestion}</p>}
      </div>
    </div>
  );
}

export default BlueprintGenerator;