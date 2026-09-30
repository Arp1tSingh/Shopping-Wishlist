import { useMemo } from 'react';
import { Search, Grid, List as ListIcon } from 'lucide-react';

export default function Toolbar({ 
  items, 
  searchQuery, setSearchQuery, 
  filterCategory, setFilterCategory, 
  sortMethod, setSortMethod,
  viewMode, setViewMode 
}) {
  const categories = useMemo(() => {
    const unpurchased = items.filter(i => !i.purchased);
    const counts = {};
    unpurchased.forEach(i => {
      const c = i.category || 'Uncategorized';
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts).sort((a,b) => a[0].localeCompare(b[0]));
  }, [items]);

  const activeCount = items.filter(i => !i.purchased).length;

  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search items or notes..." />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="search-clear-btn" aria-label="Clear search">&times;</button>
          )}
        </div>

        <div className="filter-controls">
          <select className="select-styled" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="">All categories ({activeCount})</option>
            {categories.map(([cat, count]) => (
              <option key={cat} value={cat}>{cat} ({count})</option>
            ))}
          </select>

          <select className="select-styled" value={sortMethod} onChange={e => setSortMethod(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priority">Priority: High first</option>
            <option value="name">Name A–Z</option>
          </select>

          <div className="view-switcher">
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="Grid View">
              <Grid size={15} />
            </button>
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="List View">
              <ListIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="category-pills-bar">
        <button className={`cat-pill ${filterCategory === '' ? 'active' : ''}`} onClick={() => setFilterCategory('')}>
          All <span style={{ opacity: 0.7 }}>({activeCount})</span>
        </button>
        {categories.map(([cat, count]) => (
          <button key={cat} className={`cat-pill ${filterCategory === cat ? 'active' : ''}`} onClick={() => setFilterCategory(cat)}>
            {cat} <span style={{ opacity: 0.7 }}>({count})</span>
          </button>
        ))}
      </div>
    </>
  );
}
