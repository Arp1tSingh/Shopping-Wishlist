import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Check, Edit2, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';

const formatPrice = n => n ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n) : null;

// Ensure relative links don't break routing
const ensureProtocol = url => {
  if (!url) return '';
  if (!url.match(/^https?:\/\//i)) {
    return 'https://' + url;
  }
  return url;
};

function Placeholder({ category }) {
  return (
    <div className="card-placeholder">
      <ImageIcon size={34} strokeWidth={1.5} />
      <span>{category || 'Wishlist Item'}</span>
    </div>
  )
}

function Actions({ item, setEditingItem, refreshItems, readOnly }) {
  const [armed, setArmed] = useState(false);

  if (readOnly) {
    return (
      <div className="card-icon-btns">
        {item.link && (
          <a href={ensureProtocol(item.link)} target="_blank" rel="noopener noreferrer" className="icon-action-btn">
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    );
  }

  async function togglePurchased() {
    await supabase.from('items').update({ purchased: !item.purchased }).eq('id', item.id);
    refreshItems();
  }

  async function handleDelete() {
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 3500);
      return;
    }
    await supabase.from('items').delete().eq('id', item.id);
    refreshItems();
  }

  return (
    <>
      <button onClick={togglePurchased} className="got-btn" title={item.purchased ? "Restore" : "Mark as acquired"}>
        <Check size={14} />
        <span>{item.purchased ? 'Restore' : 'Got it'}</span>
      </button>
      <div className="card-icon-btns">
        {item.link && (
          <a href={ensureProtocol(item.link)} target="_blank" rel="noopener noreferrer" className="icon-action-btn">
            <ExternalLink size={15} />
          </a>
        )}
        <button onClick={() => setEditingItem(item)} className="icon-action-btn">
          <Edit2 size={15} />
        </button>
        <button onClick={handleDelete} className={`icon-action-btn delete-btn ${armed ? 'delete-armed' : ''}`}>
          {armed ? 'Confirm?' : <Trash2 size={15} />}
        </button>
      </div>
    </>
  )
}

export function ItemCard({ item, setEditingItem, refreshItems, readOnly }) {
  const priceStr = formatPrice(item.price);
  const priorityLabel = item.priority.charAt(0).toUpperCase() + item.priority.slice(1);

  return (
    <li className={`item-card prio-${item.priority}`}>
      <div className="card-media">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="card-img" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
        ) : null}
        <div style={{display: item.image_url ? 'none' : 'flex', width: '100%', height: '100%'}}>
           <Placeholder category={item.category} />
        </div>
        <div className="card-badge-layer">
          <span className={`badge-prio ${item.priority}`}>{priorityLabel}</span>
          <span className="badge-cat">{item.category}</span>
        </div>
      </div>
      <div className="card-content">
        <div className="card-top">
          <h3 className="card-title">{item.name}</h3>
          {priceStr && <span className="card-price">{priceStr}</span>}
        </div>
        {item.notes ? <p className="card-notes">{item.notes}</p> : <div style={{flex: 1}}></div>}
        
        <div className="card-actions">
          <Actions item={item} setEditingItem={setEditingItem} refreshItems={refreshItems} readOnly={readOnly} />
        </div>
      </div>
    </li>
  );
}

export function ItemRow({ item, setEditingItem, refreshItems, readOnly }) {
  const priceStr = formatPrice(item.price);
  const priorityLabel = item.priority.charAt(0).toUpperCase() + item.priority.slice(1);
  const [armed, setArmed] = useState(false);

  async function togglePurchased() {
    if (readOnly) return;
    await supabase.from('items').update({ purchased: !item.purchased }).eq('id', item.id);
    refreshItems();
  }

  async function handleDelete() {
    if (readOnly) return;
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 3500);
      return;
    }
    await supabase.from('items').delete().eq('id', item.id);
    refreshItems();
  }
  
  if (item.purchased) {
    return (
      <li className="item-row purchased-row">
        {!readOnly && (
          <button className="check-circle checked" onClick={togglePurchased} title="Restore to wishlist">
            <Check size={13} strokeWidth={3} />
          </button>
        )}
        {item.image_url && (
            <div className="row-thumb"><img src={item.image_url} alt="" onError={(e) => e.target.parentElement.hidden = true} /></div>
        )}
        <div className="row-main">
          <div className="row-top">
            <span className="row-name">{item.name}</span>
            <span className="badge-cat">{item.category}</span>
          </div>
        </div>
        <div className="row-right">
          {priceStr && <span className="row-price" style={{color: 'var(--text-muted)'}}>{priceStr}</span>}
          <div className="row-actions">
            {!readOnly && (
              <button onClick={handleDelete} className={`icon-action-btn delete-btn ${armed ? 'delete-armed' : ''}`}>
                {armed ? 'Confirm?' : <Trash2 size={15} />}
              </button>
            )}
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={`item-row prio-${item.priority}`}>
      {!readOnly && (
        <button className="check-circle" onClick={togglePurchased} title="Mark as acquired">
          <Check size={13} strokeWidth={3} />
        </button>
      )}
      {item.image_url && (
          <div className="row-thumb"><img src={item.image_url} alt="" onError={(e) => e.target.parentElement.hidden = true} /></div>
      )}
      <div className="row-main">
        <div className="row-top">
          <span className="row-name">{item.name}</span>
          <div className="row-meta">
            <span className="badge-cat">{item.category}</span>
            <span className="badge-prio">{priorityLabel}</span>
          </div>
        </div>
        {item.notes && <p className="row-notes">{item.notes}</p>}
      </div>
      <div className="row-right">
        {priceStr && <span className="row-price">{priceStr}</span>}
        <div className="row-actions">
          {item.link && (
            <a href={ensureProtocol(item.link)} target="_blank" rel="noopener noreferrer" className="icon-action-btn">
              <ExternalLink size={15} />
            </a>
          )}
          {!readOnly && (
            <>
              <button onClick={() => setEditingItem(item)} className="icon-action-btn">
                <Edit2 size={15} />
              </button>
              <button onClick={handleDelete} className={`icon-action-btn delete-btn ${armed ? 'delete-armed' : ''}`}>
                {armed ? 'Confirm?' : <Trash2 size={15} />}
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
