import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SidebarForm({ user, editingItem, setEditingItem, refreshItems }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    priority: 'medium',
    link: '',
    image_url: '',
    notes: ''
  });
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        price: editingItem.price || '',
        category: editingItem.category || '',
        priority: editingItem.priority || 'medium',
        link: editingItem.link || '',
        image_url: editingItem.image_url || '',
        notes: editingItem.notes || ''
      });
      setShowNotes(!!editingItem.notes);
    } else {
      resetForm();
    }
  }, [editingItem]);

  function resetForm() {
    setFormData({ name: '', price: '', category: '', priority: 'medium', link: '', image_url: '', notes: '' });
    setShowNotes(false);
    setEditingItem(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      user_id: user.id
    };

    if (editingItem) {
      await supabase.from('items').update(payload).eq('id', editingItem.id);
    } else {
      payload.purchased = false;
      await supabase.from('items').insert([payload]);
    }

    setLoading(false);
    resetForm();
    refreshItems();
  }

  return (
    <section className={`add-panel ${editingItem ? 'editing-active' : ''}`}>
      <div className="panel-header">
        <h2>{editingItem ? 'Edit wishlist item' : 'Add something you want'}</h2>
        <span className="panel-badge">{editingItem ? 'Editing' : 'New Item'}</span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Item Name</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Mechanical keyboard" />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Price (₹)</label>
            <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0" />
          </div>
          <div className="field">
            <label>Category</label>
            <input type="text" list="catList" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Electronics" />
            <datalist id="catList">
              <option value="Electronics"></option>
              <option value="Books"></option>
              <option value="Clothing"></option>
              <option value="Home"></option>
              <option value="Hobbies"></option>
            </datalist>
          </div>
        </div>

        <div className="field">
          <span className="field-label">Priority Level</span>
          <div className="priority-picker">
            {['low', 'medium', 'high'].map(p => (
              <button 
                key={p} type="button" 
                className={`prio-btn ${formData.priority === p ? 'active' : ''}`}
                data-value={p}
                onClick={() => setFormData({...formData, priority: p})}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Product URL</label>
          <input type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://store.com/item (optional)" />
        </div>

        <div className="field">
          <label>Photo URL</label>
          <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="Image link for preview (optional)" />
          {formData.image_url && (
            <div className="img-preview-box">
              <div className="img-preview-thumb">
                <img src={formData.image_url} alt="Preview" onError={(e) => e.target.parentElement.parentElement.hidden = true} onLoad={(e) => e.target.parentElement.parentElement.hidden = false}/>
              </div>
              <div className="img-preview-info">
                <span>Image preview</span>
              </div>
            </div>
          )}
        </div>

        <button type="button" onClick={() => setShowNotes(!showNotes)} className="link-btn">
          {showNotes ? '– Hide note' : '+ Add a note or specifications'}
        </button>
        
        {showNotes && (
          <div className="field">
            <label>Notes & Details</label>
            <textarea rows="2" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Size, color, store discount..."></textarea>
          </div>
        )}

        <div className="form-actions">
          {editingItem && (
            <button type="button" onClick={resetForm} className="ghost-btn">Cancel</button>
          )}
          <button disabled={loading} type="submit" className="primary-btn">
           {editingItem ? 'Save changes' : 'Add to list'}
          </button>
        </div>
      </form>
    </section>
  );
}
