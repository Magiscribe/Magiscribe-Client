import Button from '@/components/controls/button';
import { useTokenUsage } from '@/providers/token-usage-provider';
import { faPlus, faRedo } from '@fortawesome/free-solid-svg-icons';

export default function TokenUsageDemo() {
  const { addTokens, addFromAPI, resetTokens, currentTokens, currentTier } = useTokenUsage();

  const handleAddSmall = () => addTokens(50, 25); // Small API call
  const handleAddMedium = () => addTokens(200, 150); // Medium API call
  const handleAddLarge = () => addTokens(500, 300); // Large API call
  const handleAddMassive = () => addTokens(2000, 1500); // Massive API call
  
  const handleTestAPI = () => {
    // Simulate an API response
    addFromAPI({
      inputTokens: 100,
      outputTokens: 200,
      totalTokens: 300
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
        Token Usage Demo
      </h3>
      
      <div className="mb-4">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
          Current: <span className="font-mono">{currentTokens.toLocaleString()}</span> tokens
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
          Target: <span className="font-bold">{currentTier.label}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <Button onClick={handleAddSmall} variant="secondary" size="small" icon={faPlus}>
          +75 tokens
        </Button>
        <Button onClick={handleAddMedium} variant="secondary" size="small" icon={faPlus}>
          +350 tokens
        </Button>
        <Button onClick={handleAddLarge} variant="secondary" size="small" icon={faPlus}>
          +800 tokens
        </Button>
        <Button onClick={handleAddMassive} variant="primary" size="small" icon={faPlus}>
          +3.5K tokens
        </Button>
        <Button onClick={handleTestAPI} variant="accent" size="small" icon={faPlus}>
          Test API (+300)
        </Button>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
        <Button onClick={resetTokens} variant="danger" size="small" icon={faRedo}>
          Reset Progress
        </Button>
      </div>
    </div>
  );
}
