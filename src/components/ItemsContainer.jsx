import { useState } from 'react';
import { ItemCard, ItemRow } from './ItemUI';

export default function ItemsContainer({ items, loading, viewMode, searchQuery, filterCategory, sortMethod, setEditingItem, refreshItems, readOnly }) {
  const [showPurchased, setShowPurchased] = useState(false);

  if (loading) {
    return <div className="loading-state">Loading your wishlist…</div>;
  }

  const q = searchQuery.toLowerCase();
  
  let filtered = items.filter(i => {
    if (q && !i.name.toLowerCase().includes(q) && !(i.notes || '').toLowerCase().includes(q)) return false;
    if (filterCategory && i.category !== filterCategory) return false;
    return true;
  });

  const prioRank = { high: 0, medium: 1, low: 2 };
  
  filtered.sort((a, b) => {
    if (sortMethod === 'priceHigh') return (b.price || -1) - (a.price || -1);
    if (sortMethod === 'priceLow') return (a.price || Infinity) - (b.price || Infinity);
    if (sortMethod === 'priority') return prioRank[a.priority] - prioRank[b.priority];
    if (sortMethod === 'name') return a.name.localeCompare(b.name);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const activeItems = filtered.filter(i => !i.purchased);
  const purchasedItems = filtered.filter(i => i.purchased);

  return (
    <div className="items-container">
      {activeItems.length === 0 && !loading && (
         <div className="empty-state">
           <div className="empty-state-icon">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <circle cx="9" cy="21" r="1"></circle>
               <circle cx="20" cy="21" r="1"></circle>
               <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
             </svg>
           </div>
           <h3>{readOnly ? 'This wishlist is empty' : 'Your wishlist is empty'}</h3>
           {!readOnly && <p>Add your first item using the form on the left to start curating.</p>}
         </div>
      )}

      {activeItems.length > 0 && (
        <ul className={viewMode === 'grid' ? 'card-grid' : 'item-list'}>
          {activeItems.map(item => viewMode === 'grid' 
            ? <ItemCard key={item.id} item={item} setEditingItem={setEditingItem} refreshItems={refreshItems} readOnly={readOnly} />
            : <ItemRow key={item.id} item={item} setEditingItem={setEditingItem} refreshItems={refreshItems} readOnly={readOnly} />
          )}
        </ul>
      )}

      {purchasedItems.length > 0 && (
        <div className="purchased-section">
          <button className="purchased-toggle-btn" onClick={() => setShowPurchased(!showPurchased)}>
            <span>Already acquired items ({purchasedItems.length})</span>
            <svg style={{ transform: showPurchased ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          
          {showPurchased && (
            <div style={{ marginTop: '12px' }}>
              <ul className="item-list">
                {purchasedItems.map(item => (
                  <ItemRow key={item.id} item={item} setEditingItem={setEditingItem} refreshItems={refreshItems} readOnly={readOnly} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
