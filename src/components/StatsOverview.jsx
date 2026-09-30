import { useState } from 'react';

export default function StatsOverview({ items, budget, onSaveBudget }) {
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget || '');

  const activeItems = items.filter(i => !i.purchased);
  const total = activeItems.reduce((acc, curr) => acc + (curr.price || 0), 0);
  
  const formatPrice = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  
  const budgetOver = budget && total > budget;
  const budgetGood = budget && total > 0 && total <= budget;
  
  const percent = budget ? Math.min((total / budget) * 100, 100) : 0;

  function handleSave() {
    onSaveBudget(tempBudget ? Number(tempBudget) : null);
    setEditingBudget(false);
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header-row">
          <span className="stat-num">{activeItems.length}</span>
          <span className="stat-badge">Active</span>
        </div>
        <span className="stat-label">Items on your wishlist</span>
      </div>

      <div className="stat-card">
        <div className="stat-header-row">
          <span className="stat-num">{formatPrice(total)}</span>
          <span className="stat-badge">Total</span>
        </div>
        <span className="stat-label">Combined wishlist value</span>
      </div>

      <div className={`stat-card budget-card ${budgetOver ? 'over' : ''} ${budgetGood ? 'good' : ''}`}>
        {!editingBudget ? (
          <div className="budget-display" onClick={() => setEditingBudget(true)} title="Click to edit budget">
            <div className="stat-header-row">
              <span className="stat-num">{budget ? formatPrice(budget) : '—'}</span>
              <span className="stat-badge">Budget</span>
            </div>
            <span className="stat-label">{budget ? (budgetOver ? 'Over budget' : 'Under budget') : 'Set a spending limit'}</span>
            {budget !== null && (
              <div className="budget-meter-track" style={{ display: 'block' }}>
                <div className="budget-meter-fill" style={{ width: `${percent}%`, backgroundColor: budgetOver ? 'var(--coral)' : 'var(--sage)' }}></div>
              </div>
            )}
          </div>
        ) : (
          <div className="budget-edit-form">
            <input type="number" value={tempBudget} onChange={e => setTempBudget(e.target.value)} placeholder="₹ amount" autoFocus />
            <button type="button" onClick={handleSave} className="primary-btn-sm">Save</button>
            <button type="button" onClick={() => setEditingBudget(false)} className="ghost-btn-sm">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
