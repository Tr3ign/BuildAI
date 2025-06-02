import React from 'react';
import BlueprintGenerator from './BlueprintGenerator';
import ProjectManager from './ProjectManager';
import CostEstimator from './CostEstimator';

function App() {
  return (
    <div className="container mx-auto p-6 max-w-4xl bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">BuildSmart AI</h1>
      <BlueprintGenerator />
      <ProjectManager />
      <CostEstimator />
    </div>
  );
}

export default App;