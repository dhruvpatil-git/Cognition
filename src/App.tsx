import React, { useState, useMemo } from 'react';
import type { Allocation, AssetTier } from './types/risk';
import { calculatePortfolioAnalytics, redistributeAllocation } from './utils/riskCalculations';

// Minimal Components
import { Navbar } from './components/Navbar';
import { ChatWorkspace } from './components/ChatWorkspace';
import { RiskSimulatorSidebar } from './components/RiskSimulatorSidebar';
import { EducationalHelpModal } from './components/EducationalHelpModal';
import { StickyComplianceBanner } from './components/StickyComplianceBanner';

export const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Initial allocation state: Balanced 35% Low, 50% Medium, 15% High
  const [allocation, setAllocation] = useState<Allocation>({
    low: 35,
    medium: 50,
    high: 15,
  });

  // Calculate live portfolio analytics whenever allocation changes
  const analytics = useMemo(() => calculatePortfolioAnalytics(allocation), [allocation]);

  // Handle synchronized slider changes
  const handleAllocationChange = (
    currentAlloc: Allocation,
    changedTier: AssetTier,
    newVal: number
  ) => {
    const nextAllocation = redistributeAllocation(currentAlloc, changedTier, newVal);
    setAllocation(nextAllocation);
  };

  // Handle quick preset selection
  const handleSelectPreset = (newAllocation: Allocation) => {
    setAllocation(newAllocation);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#0B1020] text-white flex flex-col font-sans selection:bg-[#00D084] selection:text-slate-950">
      {/* Sleek Enterprise Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        currentAllocation={allocation}
        onSelectPreset={handleSelectPreset}
        onOpenHelpModal={() => setIsHelpOpen(true)}
      />

      {/* Main Enterprise Workspace */}
      <ChatWorkspace
        allocation={allocation}
        analytics={analytics}
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />

      {/* Dockable Risk Simulator Sidebar */}
      <RiskSimulatorSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        allocation={allocation}
        onAllocationChange={handleAllocationChange}
        analytics={analytics}
      />

      {/* Educational Help Modal */}
      <EducationalHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Non-Intrusive Compliance Banner */}
      <StickyComplianceBanner />
    </div>
  );
};

export default App;
