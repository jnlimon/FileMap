import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Homepage } from './components/Homepage';
import { ExperimentPage } from './components/ExperimentPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <div className="App h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
            <Header />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/project/:projectId" element={<ExperimentPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
