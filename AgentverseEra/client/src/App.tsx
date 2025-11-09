import { useState, useEffect } from 'react';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PreLoader from "@/components/PreLoader";
import Dashboard from "@/pages/Dashboard";

function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');
    if (hasSeenPreloader) {
      setShowPreloader(false);
    }
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('hasSeenPreloader', 'true');
    setShowPreloader(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {showPreloader && <PreLoader onComplete={handlePreloaderComplete} />}
        {!showPreloader && (
          <div className="animate-fade-in">
            <Dashboard />
          </div>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
