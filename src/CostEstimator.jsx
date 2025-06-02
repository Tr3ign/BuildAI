import React, { useState } from 'react';

function CostEstimator() {
  const [materialQty, setMaterialQty] = useState('');
  const [laborRate, setLaborRate] = useState('');
  const [cost, setCost] = useState(null);

  const estimateCost = () => {
    if (materialQty && laborRate) {
      const total = materialQty * laborRate * 8; // 8-hour workday estimate
      setCost(total.toFixed(2));
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Cost Estimation</h2>
      <div className="space-y-2">
        <input
          type="number"
          value={materialQty}
          onChange={(e) => setMaterialQty(e.target.value)}
          placeholder="Material Quantity"
          className="w-full p-2 border rounded"
          min="1"
        />
        <input
          type="number"
          value={laborRate}
          onChange={(e) => setLaborRate(e.target.value)}
          placeholder="Labor Rate ($/hour)"
          className="w-full p-2 border rounded"
          min="1"
        />
        <button
          onClick={estimateCost}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Estimate Cost
        </button>
        {cost && <p className="mt-2 text-gray-700">Estimated Cost: ${cost}</p>}
      </div>
    </div>
  );
}

export default CostEstimator;