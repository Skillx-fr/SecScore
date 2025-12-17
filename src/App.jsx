import { useState } from 'react';
import { useRealTimeScore } from './hooks/useRealTimeScore';
import { ThemeSelector } from './components/ThemeSelector';
import { QuestionWizard } from './components/QuestionWizard';
import { ResultsDashboard } from './components/ResultsDashboard';
import { LiveScoreGauge } from './components/LiveScoreGauge';
import data from './data/questions.json';

function App() {
  const [currentTheme, setCurrentTheme] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const { totalScore, addAnswer, calculateGrade, resetScore, answers } = useRealTimeScore();

  // Calculate dynamic max score based on current theme's questions
  const currentMaxScore = currentTheme
    ? currentTheme.questions.reduce((acc, q) => {
      // Find max possible score for this question (usually 10)
      const maxQScore = Math.max(...q.options.map(o => o.score));
      // Only count it if we've answered it? Or always?
      // Let's count always to show progress towards total
      return acc + maxQScore;
    }, 0)
    : 0;

  const handleSelectTheme = (theme) => {
    setCurrentTheme(theme);
    resetScore();
    setIsFinished(false);
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const handleReset = () => {
    setCurrentTheme(null);
    setIsFinished(false);
    resetScore();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white">S</span>
            </div>
            <span>SecScore</span>
          </div>

          {currentTheme && !isFinished && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-400 uppercase">Score en direct</div>
                <div className="font-mono font-bold text-blue-400">{totalScore} / {currentMaxScore}</div>
              </div>
              <div className="w-12 h-12">
                <LiveScoreGauge score={totalScore} maxScore={currentMaxScore} size={48} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center py-12">
        {!currentTheme ? (
          <ThemeSelector themes={data.themes} onSelect={handleSelectTheme} />
        ) : isFinished ? (
          <ResultsDashboard
            score={totalScore}
            maxScore={currentMaxScore}
            grade={calculateGrade(totalScore, currentMaxScore)}
            onReset={handleReset}
          />
        ) : (
          <QuestionWizard
            theme={currentTheme}
            onAnswer={addAnswer}
            onFinish={handleFinish}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} SecScore &bull; Skillx-fr</p>
      </footer>
    </div>
  );
}

export default App;
