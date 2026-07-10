"use client";

import React, { useState, useEffect } from 'react';
import { DailyTask, TaskCategory } from '@/types/tasks';
import { useTranslation } from '@/contexts/LanguageContext';

const DEFAULT_TASKS: DailyTask[] = [
  {
    id: 'water-1',
    title: 'Hydration Goal',
    category: 'hydration',
    frequency: 'daily',
    targetCount: 8,
    currentCount: 0,
    unit: 'glasses',
    completionHistory: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'steps-1',
    title: 'Daily Steps',
    category: 'activity',
    frequency: 'daily',
    targetCount: 8000,
    currentCount: 0,
    unit: 'steps',
    completionHistory: [],
    createdAt: new Date().toISOString()
  }
];

export default function DailyTasks() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('other');
  const [newTaskTarget, setNewTaskTarget] = useState(1);
  const [newTaskUnit, setNewTaskUnit] = useState('');

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mizen_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Reset current counts if it's a new day
        const today = new Date().toISOString().split('T')[0];
        const lastUpdated = localStorage.getItem('mizen_tasks_date');
        
        if (lastUpdated !== today) {
          const resetTasks = parsed.map((task: DailyTask) => ({
            ...task,
            currentCount: 0
          }));
          setTasks(resetTasks);
          localStorage.setItem('mizen_tasks', JSON.stringify(resetTasks));
          localStorage.setItem('mizen_tasks_date', today);
        } else {
          setTasks(parsed);
        }
      } else {
        setTasks(DEFAULT_TASKS);
        localStorage.setItem('mizen_tasks', JSON.stringify(DEFAULT_TASKS));
        localStorage.setItem('mizen_tasks_date', new Date().toISOString().split('T')[0]);
      }
    } catch (e) {
      console.error("Failed to load tasks", e);
      setTasks(DEFAULT_TASKS);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when tasks change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('mizen_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const handleUpdateProgress = (taskId: string, increment: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newCount = Math.max(0, Math.min(task.targetCount, task.currentCount + increment));
        
        // Handle completion history
        const today = new Date().toISOString().split('T')[0];
        let history = [...task.completionHistory];
        
        if (newCount === task.targetCount && !history.includes(today)) {
          history.push(today);
        } else if (newCount < task.targetCount && history.includes(today)) {
          history = history.filter(date => date !== today);
        }
        
        return { ...task, currentCount: newCount, completionHistory: history };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: DailyTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      frequency: 'daily',
      targetCount: newTaskTarget,
      currentCount: 0,
      unit: newTaskUnit.trim(),
      completionHistory: [],
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setNewTaskTarget(1);
    setNewTaskUnit('');
    setShowAddModal(false);
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'hydration': return '💧';
      case 'medication': return '💊';
      case 'activity': return '🏃🏽‍♂️';
      case 'nutrition': return '🥗';
      case 'mindfulness': return '🧘🏽‍♀️';
      default: return '📌';
    }
  };

  if (!isLoaded) return <div className="animate-pulse h-64 bg-gray-100 dark:bg-emerald-900/30 rounded-2xl"></div>;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center glass-panel p-6">
        <div>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">
            Daily Goals & Tasks
          </h2>
          <p className="text-gray-500 dark:text-emerald-200/60 mt-1">Track your wellness habits, everyday.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          + Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map(task => {
          const progressPercent = Math.round((task.currentCount / task.targetCount) * 100);
          const isComplete = task.currentCount === task.targetCount;
          
          return (
            <div key={task.id} className="glass-panel p-6 hover-lift relative overflow-hidden group">
              {isComplete && (
                <div className="absolute inset-0 bg-primary/5 pointer-events-none transition-opacity" />
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-white dark:bg-emerald-950/40 shadow-sm p-3 rounded-2xl">
                    {getCategoryIcon(task.category)}
                  </span>
                  <div>
                    <h3 className={`font-bold text-lg ${isComplete ? 'text-primary' : 'text-gray-800 dark:text-emerald-100'}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-400 capitalize">
                      {task.category}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete task"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-black text-gray-800 dark:text-emerald-100 tracking-tight">
                    {task.currentCount} <span className="text-sm font-semibold text-gray-400">/ {task.targetCount} {task.unit}</span>
                  </div>
                  {isComplete && <span className="text-primary font-bold text-sm animate-fade-in">Completed! 🎉</span>}
                </div>
                
                {/* Custom Progress Bar */}
                <div className="h-4 w-full bg-gray-100 dark:bg-emerald-900/30 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${isComplete ? 'bg-primary' : 'bg-emerald-400'}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleUpdateProgress(task.id, -1)}
                    disabled={task.currentCount === 0}
                    className="flex-1 py-2 rounded-xl bg-gray-50 dark:bg-emerald-900/20 text-gray-600 dark:text-emerald-200/60 hover:bg-gray-100 dark:bg-emerald-900/30 disabled:opacity-50 transition-colors font-bold border border-gray-100 dark:border-emerald-900/50 shadow-sm"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleUpdateProgress(task.id, task.targetCount < 100 ? 1 : 100)} // increment by 100 for big numbers like steps
                    disabled={isComplete}
                    className="flex-1 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 transition-colors font-bold shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {tasks.length === 0 && (
          <div className="col-span-1 md:col-span-2 glass-panel p-12 text-center text-gray-400">
            No daily tasks set. Click "Add Task" to start tracking your habits!
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-8 w-full max-w-md animate-slide-up relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:text-emerald-100"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-emerald-50 mb-6">Create New Goal</h3>
            
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-emerald-200 mb-1">Goal Title</label>
                <input 
                  type="text" 
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Take Vitamins"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-emerald-800/50 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-emerald-200 mb-1">Category</label>
                  <select 
                    value={newTaskCategory}
                    onChange={e => setNewTaskCategory(e.target.value as TaskCategory)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-emerald-800/50 focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-emerald-950/40"
                  >
                    <option value="hydration">Hydration 💧</option>
                    <option value="medication">Medication 💊</option>
                    <option value="nutrition">Nutrition 🥗</option>
                    <option value="activity">Activity 🏃🏽‍♂️</option>
                    <option value="mindfulness">Mindfulness 🧘🏽‍♀️</option>
                    <option value="other">Other 📌</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-emerald-200 mb-1">Target Number</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={newTaskTarget}
                    onChange={e => setNewTaskTarget(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-emerald-800/50 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-emerald-200 mb-1">Unit (Optional)</label>
                <input 
                  type="text" 
                  value={newTaskUnit}
                  onChange={e => setNewTaskUnit(e.target.value)}
                  placeholder="e.g., pills, glasses, steps"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-emerald-800/50 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-emerald-700 text-white font-bold py-3 rounded-xl mt-6 transition-colors shadow-md"
              >
                Save Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


