import React, { useState } from 'react';
import { 
  MessageSquare, LayoutDashboard, FileText, Settings, 
  HelpCircle, LogOut, Activity, Plus, Trash2, 
  Link, FileImage, Sparkles, FileCode, HelpCircle as QuestionIcon,
  Video, Mic, FileUp, GripVertical, Play, AlertCircle, Sparkles as SparkIcon,
  Edit2, Copy, Check, Save as SaveIcon
} from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const [currentView, setCurrentView] = useState('list'); 
  const [listTab, setListTab] = useState('templates'); // templates, categories, global

  // Templates State
  const [templates, setTemplates] = useState([
    { id: 1, groupId: 1, version: 1, name: 'Untitled template', categories: '-', blocks: '-', active: true, categoryIds: [], steps: [] },
    { id: 2, groupId: 2, version: 1, name: 'Untitled template', categories: '-', blocks: '-', active: true, categoryIds: [], steps: [] },
    { id: 3, groupId: 3, version: 1, name: 'Untitled template', categories: '-', blocks: '-', active: true, categoryIds: [], steps: [] },
    { id: 4, groupId: 4, version: 1, name: 'Untitled template', categories: '-', blocks: '-', active: true, categoryIds: [], steps: [] }
  ]);
  
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);

  // Categories State
  const [categories, setCategories] = useState([
    { id: 1, name: 'Popular' },
    { id: 2, name: 'AI Memory' },
    { id: 3, name: 'Trends' },
    { id: 4, name: 'YouTube' },
    { id: 5, name: 'Ads' }
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Builder Steps State
  const [steps, setSteps] = useState([
    { 
      id: 1, title: 'Step 01', desc: 'Step 01', required: true,
      items: [
        { id: 1, type: 'upload', instruction: 'Please upload your file...', outputType: ['text'] }
      ]
    }
  ]);
  const [newActionInput, setNewActionInput] = useState('');
  const [stepToDelete, setStepToDelete] = useState(null);
  const [selectedGroupForVersions, setSelectedGroupForVersions] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [draggedStepIndex, setDraggedStepIndex] = useState(null);
  const [dragOverStepIndex, setDragOverStepIndex] = useState(null);
  const [expandedItemIds, setExpandedItemIds] = useState({});
  const [draggedItem, setDraggedItem] = useState(null); // { stepId, qIndex }
  const [dragOverItem, setDragOverItem] = useState(null); // { stepId, qIndex }
  const [itemWizardOpenForStep, setItemWizardOpenForStep] = useState(null);
  const [newItemText, setNewItemText] = useState('');

  const handleToggleCategory = (categoryId) => {
    const currentIds = activeTemplate.categoryIds || [];
    const newIds = currentIds.includes(categoryId) 
      ? currentIds.filter(id => id !== categoryId)
      : [...currentIds, categoryId];
    setActiveTemplate({ ...activeTemplate, categoryIds: newIds });
  };

  // --- Templates List Logic ---
  const handleToggleTemplateActive = (id) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };
  const handleDuplicateTemplate = (template) => {
    const newId = templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1;
    const newGroupId = templates.length > 0 ? Math.max(...templates.map(t => t.groupId || 0)) + 1 : 1;
    setTemplates([...templates, { ...template, id: newId, groupId: newGroupId, version: 1, active: true, name: `${template.name} (Copy)` }]);
  };
  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
  };
  const handleCreateTemplate = () => {
    setSteps([]); // Start with an empty workflow
    const newId = templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1;
    const newGroupId = templates.length > 0 ? Math.max(...templates.map(t => t.groupId || 0)) + 1 : 1;
    const newTemplate = { id: newId, groupId: newGroupId, version: 1, isDraft: true, name: 'Untitled template', categories: '-', blocks: '-', active: true, categoryIds: [], steps: [] };
    setActiveTemplate(newTemplate);
    setCurrentView('builder');
  };

  const handleEditTemplate = (template) => {
    setSteps(template.steps || []);
    setActiveTemplate(template);
    setIsReadOnly(false);
    setCurrentView('builder');
  };

  const handleSaveTemplate = () => {
    if (activeTemplate.isDraft) {
      // First time saving a new template
      const newTemplate = { ...activeTemplate, isDraft: false, steps: steps };
      setTemplates([...templates, newTemplate]);
      setActiveTemplate(newTemplate);
    } else {
      // Saving an existing template creates a new version
      const newId = Math.max(...templates.map(t => t.id)) + 1;
      const currentGroupId = activeTemplate.groupId;
      const groupTemplates = templates.filter(t => t.groupId === currentGroupId);
      const maxVersion = Math.max(...groupTemplates.map(t => t.version || 1));
      
      const newVersionTemplate = {
        ...activeTemplate,
        id: newId,
        version: maxVersion + 1,
        active: true,
        steps: steps
      };
      
      const updatedTemplates = templates.map(t => 
        t.groupId === currentGroupId ? { ...t, active: false } : t
      );
      
      setTemplates([...updatedTemplates, newVersionTemplate]);
      setActiveTemplate(newVersionTemplate);
    }
    setCurrentView('list');
  };

  // --- Categories CRUD Logic ---
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories([...categories, { id: newId, name: newCategoryName }]);
    setNewCategoryName('');
  };
  const startEditCategory = (cat) => {
    setEditingCategory(cat.id);
    setEditCategoryName(cat.name);
  };
  const handleSaveCategory = (id) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name: editCategoryName } : c));
    setEditingCategory(null);
    setEditCategoryName('');
  };
  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  // --- Builder Logic ---
  const handleDeleteStep = (id) => setStepToDelete(id);
  const confirmDeleteStep = () => { setSteps(steps.filter(s => s.id !== stepToDelete)); setStepToDelete(null); };
  const handleUpdateStep = (id, field, value) => setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  
  const handleAddItem = (stepId, type) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;
    const items = step.items || [];
    const newId = items.length > 0 ? Math.max(...items.map(q => q.id)) + 1 : 1;
    
    let newItem = { id: newId, type: type, outputType: ['text'], text: newItemText };
    if (type === 'question') { newItem.choices = []; }
    if (type === 'action') { newItem.actionsList = []; }
    if (type === 'prompt') { newItem.outputDestination = 'chat'; }
    if (type === 'link') { newItem.url = ''; }
    
    const newItems = [...items, newItem];
    handleUpdateStep(stepId, 'items', newItems);
    setExpandedItemIds(prev => ({ ...prev, [stepId]: newId }));
    setItemWizardOpenForStep(null);
    setNewItemText('');
  };

  const handleUpdateItem = (stepId, itemId, field, value) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;
    const newItems = (step.items || []).map(q => q.id === itemId ? { ...q, [field]: value } : q);
    handleUpdateStep(stepId, 'items', newItems);
  };

  const handleItemDragStart = (e, stepId, qIndex) => {
    e.stopPropagation();
    setDraggedItem({ stepId, qIndex });
  };

  const handleItemDragOver = (e, stepId, qIndex) => {
    e.preventDefault(); 
    e.stopPropagation();
    setDragOverItem({ stepId, qIndex });
  };

  const handleItemDrop = (e, stepId) => {
    e.stopPropagation();
    if (!draggedItem || !dragOverItem || draggedItem.stepId !== stepId || dragOverItem.stepId !== stepId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }
    if (draggedItem.qIndex === dragOverItem.qIndex) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    const newItems = [...(step.items || [])];
    const item = newItems[draggedItem.qIndex];
    newItems.splice(draggedItem.qIndex, 1);
    newItems.splice(dragOverItem.qIndex, 0, item);

    handleUpdateStep(stepId, 'items', newItems);
    setDraggedItem(null);
    setDragOverItem(null);
  };


  const handleToggleRequired = (id) => setSteps(steps.map(s => s.id === id ? { ...s, required: !s.required } : s));
  
  const handleSortSteps = () => {
    if (draggedStepIndex === null || dragOverStepIndex === null || draggedStepIndex === dragOverStepIndex) {
      setDraggedStepIndex(null);
      setDragOverStepIndex(null);
      return;
    }
    const newSteps = [...steps];
    const draggedStep = newSteps[draggedStepIndex];
    newSteps.splice(draggedStepIndex, 1);
    newSteps.splice(dragOverStepIndex, 0, draggedStep);
    
    const updatedSteps = newSteps.map((s, idx) => ({
      ...s,
      desc: `Step 0${idx + 1}`
    }));
    setSteps(updatedSteps);
    setDraggedStepIndex(null);
    setDragOverStepIndex(null);
  };
  
  const handleAddGenericStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    let newStep = { id: newId, title: `Step 0${newId}`, desc: `Step 0${newId}`, required: false, items: [] };
    setSteps([...steps, newStep]);
  };

  const handleToggleExpectedOutput = (stepId, type) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;
    const current = Array.isArray(step.outputType) ? step.outputType : [step.outputType].filter(Boolean);
    const newTypes = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
    handleUpdateStep(stepId, 'outputType', newTypes);
  };

  const ExpectedOutputSection = ({ step }) => {
    const isSelected = (type) => Array.isArray(step.outputType) ? step.outputType.includes(type) : step.outputType === type;
    return (
    <div style={{ marginTop: '2rem' }}>
      <label className="input-label" style={{textTransform: 'none', color: '#0f172a'}}>Expected Output</label>
      <div className="expected-output-grid">
        <label className={`expected-tile ${isSelected('text') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleToggleExpectedOutput(step.id, 'text'); }}>
          <input type="checkbox" checked={isSelected('text')} readOnly style={{display: 'none'}} />
          <FileText size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Text</div><div className="expected-tile-sub">Manual entry</div></div>
        </label>
        <label className={`expected-tile ${isSelected('image') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleToggleExpectedOutput(step.id, 'image'); }}>
          <input type="checkbox" checked={isSelected('image')} readOnly style={{display: 'none'}} />
          <FileImage size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Image</div><div className="expected-tile-sub">Visual Data</div></div>
        </label>
        <label className={`expected-tile ${isSelected('video') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleToggleExpectedOutput(step.id, 'video'); }}>
          <input type="checkbox" checked={isSelected('video')} readOnly style={{display: 'none'}} />
          <Video size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Video</div><div className="expected-tile-sub">Motion clips</div></div>
        </label>
        <label className={`expected-tile ${isSelected('chips') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleToggleExpectedOutput(step.id, 'chips'); }}>
          <input type="checkbox" checked={isSelected('chips')} readOnly style={{display: 'none'}} />
          <FileCode size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Chips</div><div className="expected-tile-sub">Interactive</div></div>
        </label>
      </div>
    </div>
  )};

  const handleToggleItemExpectedOutput = (stepId, itemId, type) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;
    const item = (step.items || []).find(q => q.id === itemId);
    if (!item) return;
    const current = Array.isArray(item.outputType) ? item.outputType : [item.outputType].filter(Boolean);
    const newTypes = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
    handleUpdateItem(stepId, itemId, 'outputType', newTypes);
  };

  const ItemExpectedOutputSection = ({ step, item }) => {
    const isSelected = (type) => Array.isArray(item.outputType) ? item.outputType.includes(type) : item.outputType === type;
    return (
    <div style={{ marginTop: '2rem' }}>
      <label className="input-label" style={{textTransform: 'none', color: '#0f172a'}}>Expected Output for this Item</label>
      <div className="expected-output-grid">
        <label className={`expected-tile ${isSelected('text') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleToggleItemExpectedOutput(step.id, item.id, 'text'); }}>
          <input type="checkbox" checked={isSelected('text')} readOnly style={{display: 'none'}} />
          <FileText size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Text</div><div className="expected-tile-sub">Manual entry</div></div>
        </label>
        <label className={`expected-tile ${isSelected('image') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleToggleItemExpectedOutput(step.id, item.id, 'image'); }}>
          <input type="checkbox" checked={isSelected('image')} readOnly style={{display: 'none'}} />
          <FileImage size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Image</div><div className="expected-tile-sub">Visual Data</div></div>
        </label>
        <label className={`expected-tile ${isSelected('video') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleToggleItemExpectedOutput(step.id, item.id, 'video'); }}>
          <input type="checkbox" checked={isSelected('video')} readOnly style={{display: 'none'}} />
          <Video size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Video</div><div className="expected-tile-sub">Motion clips</div></div>
        </label>
        <label className={`expected-tile ${isSelected('chips') ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleToggleItemExpectedOutput(step.id, item.id, 'chips'); }}>
          <input type="checkbox" checked={isSelected('chips')} readOnly style={{display: 'none'}} />
          <FileCode size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Chips</div><div className="expected-tile-sub">Interactive</div></div>
        </label>
      </div>
    </div>
  )};

  const Sidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-logo"><MessageSquare className="sidebar-logo-icon" size={24} /> ChatBuilder Pro</div>
      <div className="sidebar-subtitle">Enterprise Admin</div>
      <div className="create-btn-container"><button className="btn-create-template" onClick={handleCreateTemplate}><Plus size={18} /> Create New Template</button></div>
      <nav className="sidebar-menu">
        <div className="menu-item"><LayoutDashboard size={18} /> Dashboard</div>
        <div className={`menu-item ${currentView === 'list' || currentView === 'builder' ? 'active' : ''}`} onClick={() => setCurrentView('list')}><FileText size={18} /> Templates</div>
        <div className="menu-item"><Activity size={18} /> Workflows</div>
        <div className="menu-item"><Settings size={18} /> Settings</div>
      </nav>
      <div className="sidebar-footer"><div className="menu-item"><HelpCircle size={18} /> Help Center</div></div>
    </aside>
  );

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-area">
        {currentView === 'list' ? (
           <div className="workspace" style={{background: '#ffffff'}}>
            <div className="template-list-container">
              <div className="template-list-header">
                <h1 className="template-list-title">Templates</h1>
                <p className="template-list-subtitle">Build templates from composable blocks.</p>
                
                <div className="template-tabs">
                  <div className={`template-tab ${listTab === 'templates' ? 'active' : ''}`} onClick={() => setListTab('templates')}>Templates</div>
                  <div className={`template-tab ${listTab === 'categories' ? 'active' : ''}`} onClick={() => setListTab('categories')}>Categories</div>
                </div>
              </div>

              {listTab === 'templates' && (
                <>
                  <div className="template-list-actions">
                    <span className="template-count">{templates.length} templates</span>
                    <button className="btn-black" onClick={handleCreateTemplate}><Plus size={16}/> New template</button>
                  </div>
                  <table className="template-table">
                    <thead>
                      <tr>
                        <th>NAME</th><th>CATEGORIES</th><th>BLOCKS</th><th>ACTIVE</th><th style={{textAlign: 'right'}}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(templates.reduce((acc, t) => {
                        if (!acc[t.groupId]) {
                          acc[t.groupId] = t;
                        } else if (t.active) {
                          acc[t.groupId] = t; // Active version overrides
                        } else if (!acc[t.groupId].active && t.version > acc[t.groupId].version) {
                          acc[t.groupId] = t; // Higher version overrides if neither is active
                        }
                        return acc;
                      }, {})).map(t => (
                        <tr key={t.id} onClick={() => { setSelectedGroupForVersions(t.groupId); setCurrentView('versions'); }} style={{cursor: 'pointer'}}>
                          <td>
                            <div className="cell-name">
                              <SparkIcon size={16} className="cell-name-icon" fill="#f59e0b" />
                              {t.name} <span style={{fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px'}}>v{t.version}</span>
                            </div>
                          </td>
                          <td style={{color: '#94a3b8'}}>{t.categories}</td>
                          <td style={{color: '#94a3b8'}}>{t.steps ? t.steps.length : t.blocks}</td>
                          <td>
                            <div className={`toggle-pill ${t.active ? 'active' : ''}`} onClick={() => handleToggleTemplateActive(t.id)}>
                              <div className="toggle-circle"></div>
                            </div>
                          </td>
                          <td>
                            <div className="cell-actions" style={{justifyContent: 'flex-end'}}>
                              <Trash2 size={16} className="cell-action-icon delete" onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(t.id); }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {listTab === 'categories' && (
                <div className="categories-container">
                  <h2 style={{fontSize: '1.25rem', marginBottom: '1.5rem', color: '#0f172a'}}>Manage Categories</h2>
                  <div className="category-add-form">
                    <input 
                      type="text" 
                      className="text-input" 
                      style={{marginBottom: 0, flex: 1}} 
                      placeholder="Category Name" 
                      value={newCategoryName} 
                      onChange={e => setNewCategoryName(e.target.value)} 
                    />
                    <button className="btn-black" onClick={handleAddCategory}>Add Category</button>
                  </div>
                  
                  <table className="template-table">
                    <thead><tr><th>CATEGORY NAME</th><th style={{textAlign: 'right'}}>ACTIONS</th></tr></thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr><td colSpan="2" style={{textAlign: 'center', color: '#94a3b8'}}>No categories created yet.</td></tr>
                      ) : (
                        categories.map(c => (
                          <tr key={c.id}>
                            <td>
                              {editingCategory === c.id ? (
                                <input type="text" className="text-input" style={{marginBottom: 0}} value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
                              ) : c.name}
                            </td>
                            <td>
                              <div className="cell-actions" style={{justifyContent: 'flex-end'}}>
                                {editingCategory === c.id ? (
                                  <Check size={18} className="cell-action-icon" style={{color: '#10b981'}} onClick={() => handleSaveCategory(c.id)} />
                                ) : (
                                  <Edit2 size={16} className="cell-action-icon" onClick={() => startEditCategory(c)} />
                                )}
                                <Trash2 size={16} className="cell-action-icon delete" onClick={() => handleDeleteCategory(c.id)} />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}



            </div>
          </div>
        ) : currentView === 'versions' ? (
          <div className="workspace" style={{background: '#ffffff'}}>
            <div className="template-list-container">
              <header className="topbar" style={{padding: '0 0 1.5rem 0', background: 'transparent', borderBottom: 'none'}}>
                <div className="breadcrumb" style={{cursor: 'pointer', color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}} onClick={() => setCurrentView('list')}>
                  &larr; Back to templates
                </div>
              </header>
              <h1 className="template-list-title" style={{marginBottom: '0.5rem'}}>Version History</h1>
              <p className="template-list-subtitle" style={{marginBottom: '2rem'}}>Manage and view past configurations for this template.</p>
              
              <table className="template-table">
                <thead>
                  <tr>
                    <th>VERSION</th><th>BLOCKS</th><th>STATUS</th><th style={{textAlign: 'right'}}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.filter(t => t.groupId === selectedGroupForVersions).sort((a, b) => b.version - a.version).map(t => {
                    const isLatest = Math.max(...templates.filter(temp => temp.groupId === selectedGroupForVersions).map(temp => temp.version)) === t.version;
                    return (
                    <tr key={t.id}>
                      <td>
                        <div className="cell-name">
                          <SparkIcon size={16} className="cell-name-icon" fill="#f59e0b" />
                          Version {t.version}
                        </div>
                      </td>
                      <td style={{color: '#94a3b8'}}>{t.steps ? t.steps.length : t.blocks}</td>
                      <td>
                        {t.active ? <span style={{fontSize: '0.75rem', padding: '0.2rem 0.6rem', backgroundColor: '#10b981', color: 'white', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold'}}>Live</span> : <span style={{fontSize: '0.75rem', padding: '0.2rem 0.6rem', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold'}}>Archived</span>}
                      </td>
                      <td>
                        <div className="cell-actions" style={{justifyContent: 'flex-end'}}>
                          <button className="btn-secondary" style={{padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px', marginRight: '0.5rem'}} onClick={() => {
                             setSteps(t.steps || []);
                             setActiveTemplate(t);
                             setIsReadOnly(true);
                             setCurrentView('builder');
                          }}>View</button>
                          
                          {isLatest && (
                             <button className="btn-primary" style={{padding: '0.3rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px'}} onClick={() => {
                               handleEditTemplate(t);
                             }}>Edit</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Builder View */
          <>
            <header className="topbar">
              <div className="topbar-left">
                <div className="breadcrumb" style={{cursor: 'pointer', color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}} onClick={() => setCurrentView(isReadOnly ? 'versions' : 'list')}>
                  &larr; {isReadOnly ? 'Back to versions' : 'All templates'}
                </div>
              </div>
              <div className="topbar-right">
                <div className="topbar-actions">
                  <div style={{color: '#64748b', fontSize: '0.85rem', marginRight: '1rem'}}>
                    {isReadOnly ? 'Viewing' : 'Editing'}: <span style={{fontWeight: '600', color: '#0f172a'}}>v{activeTemplate.version}</span>
                  </div>
                  {isReadOnly ? (
                    <div style={{color: '#ef4444', fontSize: '0.85rem', fontWeight: '600', padding: '0.5rem 1rem', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2'}}>
                      Read-Only Mode
                    </div>
                  ) : (
                    <>
                      <button className="btn-cancel-step" style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem 1rem', background: '#ffffff', color: '#0f172a', fontWeight: '600'}} onClick={() => setCurrentView('list')}>Cancel</button>
                      <button className="btn-primary" style={{backgroundColor: '#0f172a', padding: '0.6rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem'}} onClick={handleSaveTemplate}><SaveIcon size={16} /> {activeTemplate.isDraft ? 'Save' : `Save as v${activeTemplate.version + 1}`}</button>
                    </>
                  )}
                </div>
              </div>
            </header>

            <div className="workspace" style={isReadOnly ? { pointerEvents: 'none', opacity: 0.7 } : {}}>
              <div className="workspace-inner">
                {/* Top Info Card */}
                <div className="step-card" style={{marginBottom: '1.5rem', padding: '1.5rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem'}}>
                    <div className="step-icon-box" style={{backgroundColor: '#fffbeb', border: '1px solid #e2e8f0', width: '48px', height: '48px'}}><SparkIcon size={24} fill="#f59e0b" color="#f59e0b" /></div>
                    <input type="text" className="text-input" style={{marginBottom: 0, flex: 1, fontWeight: '600', fontSize: '1.1rem'}} value={activeTemplate.name} onChange={e => setActiveTemplate({...activeTemplate, name: e.target.value})} placeholder="Template name" />
                    <div className="toggle-wrap" style={{backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '8px'}}>
                      Active
                      <div className={`toggle-pill ${activeTemplate.active ? 'active' : ''}`} onClick={() => setActiveTemplate({...activeTemplate, active: !activeTemplate.active})}>
                        <div className="toggle-circle"></div>
                      </div>
                    </div>
                  </div>
                  
                  <label className="input-label">CATEGORIES</label>
                  <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center'}}>
                    {categories.map(cat => {
                      const isActive = (activeTemplate.categoryIds || []).includes(cat.id);
                      return (
                        <div 
                          key={cat.id} 
                          className={`category-pill ${isActive ? 'active' : ''}`}
                          onClick={() => handleToggleCategory(cat.id)}
                        >
                          {cat.name}
                        </div>
                      );
                    })}
                    <button className="btn-cancel-step" style={{border: '1px solid #e2e8f0', background: 'white', borderRadius: '20px', padding: '0.4rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem'}} onClick={() => setCurrentView('list')} >+ Manage categories</button>
                  </div>
                </div>

                {/* Base Prompt Card */}
                <div className="step-card" style={{marginBottom: '3rem', padding: '1.5rem', backgroundColor: '#f8fafc'}}>
                  <h3 style={{fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.25rem 0'}}>Base Prompt</h3>
                  <p style={{fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0'}}>Sits on top of the God Prompt for this template.</p>
                  <textarea className="textarea-input" style={{minHeight: '160px', marginBottom: 0, backgroundColor: '#ffffff'}} placeholder="Type base prompt here..."></textarea>
                </div>

                <div className="workflow-steps-container">
                  {steps.map((step, index) => (
                    <div 
                      key={step.id} 
                      className="roadmap-step-container"
                      draggable={!isReadOnly}
                      onDragStart={(e) => {
                        if (isReadOnly) return;
                        setDraggedStepIndex(index);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnter={() => {
                        if (isReadOnly) return;
                        setDragOverStepIndex(index);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleSortSteps}
                      onDragEnd={() => {
                        setDraggedStepIndex(null);
                        setDragOverStepIndex(null);
                      }}
                      style={{
                        opacity: draggedStepIndex === index ? 0.5 : 1,
                        border: dragOverStepIndex === index && draggedStepIndex !== index ? '2px dashed #3b82f6' : 'none',
                        borderRadius: '12px',
                        transition: 'opacity 0.2s, border 0.2s'
                      }}
                    >
                      <div className="roadmap-timeline">
                        <div className="roadmap-circle">{index + 1}</div>
                        <div className="roadmap-line"></div>
                      </div>
                      <div className="step-card roadmap-content">
                      <div className="step-header">
                        <div className="step-header-left">
                          <div>
                            <div className="step-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              {step.title}
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.6rem', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {step.type}
                              </span>
                            </div>
                            <div className="step-subtitle">{step.desc}</div>
                          </div>
                        </div>
                        <div className="step-header-right">
                          <div className="toggle-wrap" style={{marginRight: '1rem'}}>
                            Required
                            <div className={`toggle-pill ${step.required ? 'active' : ''}`} onClick={() => handleToggleRequired(step.id)}>
                              <div className="toggle-circle"></div>
                            </div>
                          </div>
                          <GripVertical size={20} className="step-menu-icon" style={{ cursor: isReadOnly ? 'default' : 'grab' }} />
                        </div>
                      </div>

                      {/* Step Items Array Map */}
                      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                        {(step.items || []).map((item, qIndex) => {
                          const isExpanded = expandedItemIds[step.id] === item.id;
                          const isDragged = draggedItem?.stepId === step.id && draggedItem?.qIndex === qIndex;
                          const isDragOver = dragOverItem?.stepId === step.id && dragOverItem?.qIndex === qIndex;
                          
                          const itemTitles = {
                            question: 'Question', prompt: 'Prompt', upload: 'File Upload',
                            action: 'Action', link: 'Link'
                          };

                          return (
                            <div 
                              key={item.id} 
                              draggable
                              onDragStart={(e) => handleItemDragStart(e, step.id, qIndex)}
                              onDragOver={(e) => handleItemDragOver(e, step.id, qIndex)}
                              onDrop={(e) => handleItemDrop(e, step.id)}
                              onDragEnd={() => { setDraggedItem(null); setDragOverItem(null); }}
                              style={{ 
                                marginBottom: '1rem', 
                                border: isDragOver ? '2px dashed #3b82f6' : '1px solid #e2e8f0', 
                                borderRadius: '12px', 
                                overflow: 'hidden', 
                                backgroundColor: 'white',
                                opacity: isDragged ? 0.5 : 1,
                                transform: isDragged ? 'scale(0.98)' : 'scale(1)',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {/* Accordion Header */}
                              <div 
                                style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'grab', backgroundColor: isExpanded ? '#f8fafc' : 'white', borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none' }}
                                onClick={() => setExpandedItemIds(prev => ({ ...prev, [step.id]: isExpanded ? null : item.id }))}
                              >
                                <div style={{ fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <GripVertical size={16} color="#cbd5e1"/>
                                  {itemTitles[item.type] || 'Item'} {qIndex + 1} {item.text ? `- ${item.text.substring(0, 30)}${item.text.length > 30 ? '...' : ''}` : ''}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                  {item.type === 'question' && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.choices?.length || 0} options</div>}
                                  <button className="btn-secondary" style={{color: '#ef4444', borderColor: 'transparent', padding: '0.25rem 0.5rem', fontSize: '0.85rem'}} onClick={(e) => {
                                    e.stopPropagation();
                                    const newItems = (step.items || []).filter(q => q.id !== item.id);
                                    handleUpdateStep(step.id, 'items', newItems);
                                  }}><Trash2 size={16} /></button>
                                </div>
                              </div>
                              
                              {/* Accordion Body */}
                              {isExpanded && (
                                <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc' }}>
                                  
                                  {/* Text Area for Instruction / Description */}
                                  <label className="input-label" style={{textTransform: 'none', color: '#0f172a'}}>Instruction / Question Text</label>
                                  <textarea className="textarea-input" value={item.text || ''} onChange={(e) => handleUpdateItem(step.id, item.id, 'text', e.target.value)} placeholder={`e.g., Please provide your ${item.type}...`} style={{marginBottom: '1.5rem', minHeight: '60px', padding: '0.75rem', fontSize: '0.9rem'}} />

                                  {/* UPLOAD TYPES */}
                                  {item.type === 'upload' && (
                                    <>
                                      <label className="input-label" style={{textTransform: 'none', color: '#0f172a'}}>File Upload</label>
                                      <label className="upload-box" style={{display: 'block', cursor: 'pointer', marginBottom: '1.5rem'}}>
                                        <input 
                                          type="file" 
                                          style={{display: 'none'}} 
                                          accept="*/*" 
                                          onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                              handleUpdateItem(step.id, item.id, 'uploadedFile', e.target.files[0].name);
                                            }
                                          }}
                                        />
                                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                          <div className="upload-icon-circle"><FileUp size={24} /></div>
                                          <div className="upload-title">
                                            {item.uploadedFile ? <span style={{color: '#4f46e5', fontWeight: '600'}}>{item.uploadedFile}</span> : 'Click to upload or drag and drop'}
                                          </div>
                                          {!item.uploadedFile && <div className="upload-sub">Supported formats: All files (Max 200MB)</div>}
                                        </div>
                                      </label>
                                    </>
                                  )}

                                  {/* OPTIONS BUILDER (For Questions) */}
                                  {item.type === 'question' && (
                                    <>
                                      <div className="add-option-row" style={{marginBottom: '1rem', border: 'none', padding: 0}}>
                                        <div style={{flex: 1}}>
                                          <label className="input-label">ADD NEW OPTION</label>
                                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <input type="text" className="text-input" style={{marginBottom: 0}} placeholder="e.g. Yes" id={`new-qopt-${step.id}-${item.id}`} onKeyDown={(e) => {
                                              if (e.key === 'Enter' && e.target.value.trim()) {
                                                handleUpdateItem(step.id, item.id, 'choices', [...(item.choices||[]), {id: Date.now(), text: e.target.value.trim()}]);
                                                e.target.value = '';
                                              }
                                            }} />
                                            <button className="btn-secondary" onClick={() => {
                                              const input = document.getElementById(`new-qopt-${step.id}-${item.id}`);
                                              if (input && input.value.trim()) {
                                                handleUpdateItem(step.id, item.id, 'choices', [...(item.choices||[]), {id: Date.now(), text: input.value.trim()}]);
                                                input.value = '';
                                              }
                                            }}>Add Option</button>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="configured-choices">
                                        <label className="input-label">CONFIGURED CHOICES</label>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                          {(item.choices || []).length === 0 && <div style={{fontSize: '0.85rem', color: '#94a3b8'}}>No choices added yet.</div>}
                                          {(item.choices || []).map(opt => (
                                            <div key={opt.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                                              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><GripVertical size={16} color="#cbd5e1"/> {opt.text}</div>
                                              <Trash2 size={16} className="step-delete-icon" onClick={() => handleUpdateItem(step.id, item.id, 'choices', item.choices.filter(o => o.id !== opt.id))} />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {/* ACTION CHOICES */}
                                  {item.type === 'action' && (
                                    <>
                                      <div className="add-option-row">
                                        <div style={{flex: 1}}>
                                          <label className="input-label">ADD NEW OPTION</label>
                                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <input type="text" className="text-input" style={{marginBottom: 0}} placeholder="e.g. Expand Content" id={`new-act-${step.id}-${item.id}`} />
                                            <button className="btn-secondary" onClick={() => {
                                              const input = document.getElementById(`new-act-${step.id}-${item.id}`);
                                              if (input && input.value.trim()) {
                                                handleUpdateItem(step.id, item.id, 'actionsList', [...(item.actionsList||[]), {id: Date.now(), name: input.value.trim(), prompt: ''}]);
                                                input.value = '';
                                              }
                                            }}>Add Option</button>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="configured-choices">
                                        <label className="input-label">CONFIGURED CHOICES</label>
                                        <div className="action-choices-grid">
                                          {(item.actionsList||[]).map(action => (
                                            <div key={action.id} className="action-card">
                                              <div className="action-card-header">
                                                <div className="action-card-left"><GripVertical size={16} color="#cbd5e1" /> {action.name}</div>
                                                <Trash2 size={16} className="step-delete-icon" onClick={() => handleUpdateItem(step.id, item.id, 'actionsList', item.actionsList.filter(a => a.id !== action.id))} />
                                              </div>
                                              <label className="action-card-prompt-label">📝 PROMPT / INSTRUCTION</label>
                                              <textarea className="textarea-input" style={{marginBottom: 0, minHeight: '60px', padding: '0.5rem', fontSize: '0.8rem'}} placeholder="e.g. Rewrite the previous output..." value={action.prompt} onChange={(e) => handleUpdateItem(step.id, item.id, 'actionsList', item.actionsList.map(a => a.id === action.id ? {...a, prompt: e.target.value} : a))} />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {/* ADMIN PRE-FILL ANSWER (for question, prompt, link) */}
                                  {(item.type === 'question' || item.type === 'prompt' || item.type === 'link') && (
                                    <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                                      <label className="input-label" style={{textTransform: 'none', color: '#0f172a'}}>Admin Pre-filled Value / Answer</label>
                                      <textarea 
                                        className="textarea-input" 
                                        placeholder={`Enter the default ${item.type} value here...`} 
                                        value={item.adminAnswer || ''} 
                                        onChange={(e) => handleUpdateItem(step.id, item.id, 'adminAnswer', e.target.value)} 
                                        style={{marginBottom: 0, minHeight: '60px', padding: '0.75rem', fontSize: '0.9rem', backgroundColor: 'white', border: '1px dashed #cbd5e1'}} 
                                      />
                                    </div>
                                  )}

                                  <ItemExpectedOutputSection step={step} item={item} />
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* ADD ITEM WIZARD */}
                        {itemWizardOpenForStep === step.id ? (
                           <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#f8fafc', marginTop: '1rem' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                               <div style={{ fontWeight: '600', color: '#0f172a' }}>Add Item Instruction</div>
                               <button className="btn-secondary" style={{ border: 'none', background: 'none' }} onClick={() => { setItemWizardOpenForStep(null); setNewItemText(''); }}>Cancel</button>
                             </div>
                             
                             <textarea 
                               className="textarea-input" 
                               value={newItemText} 
                               onChange={(e) => setNewItemText(e.target.value)} 
                               placeholder="e.g., What is your favorite color?" 
                               style={{marginBottom: '1rem', minHeight: '60px', padding: '0.75rem', fontSize: '0.9rem'}} 
                             />

                             <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Select Item Type</div>
                             <div className="wizard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                                 {['question', 'prompt', 'upload', 'link', 'action'].map(t => (
                                    <div key={t} className="wizard-tile" style={{ padding: '0.75rem', minHeight: 'auto' }} onClick={() => handleAddItem(step.id, t)}>
                                      {t === 'question' && <QuestionIcon size={20} className="wizard-tile-icon" style={{marginBottom: '0.5rem'}} />}
                                      {t === 'prompt' && <FileText size={20} className="wizard-tile-icon" style={{marginBottom: '0.5rem'}} />}
                                      {t === 'upload' && <FileUp size={20} className="wizard-tile-icon" color="#3b82f6" style={{marginBottom: '0.5rem'}} />}
                                      {t === 'link' && <Link size={20} className="wizard-tile-icon" color="#94a3b8" style={{marginBottom: '0.5rem'}} />}
                                      {t === 'action' && <Sparkles size={20} className="wizard-tile-icon" color="#ef4444" style={{marginBottom: '0.5rem'}} />}
                                      <div className="wizard-tile-label" style={{textTransform: 'capitalize', fontSize: '0.75rem'}}>{t === 'upload' ? 'File Upload' : t}</div>
                                    </div>
                                 ))}
                             </div>
                           </div>
                        ) : (
                          <button className="btn-secondary" style={{width: '100%', borderStyle: 'dashed', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}} onClick={() => setItemWizardOpenForStep(step.id)}>
                            <Plus size={16} /> Add Item
                          </button>
                        )}
                      </div>

                      {/* Step Footer */}
                      <div className="step-footer">
                        <div className="step-footer-left">
                          <button className="btn-remove-step" onClick={() => handleDeleteStep(step.id)}><Trash2 size={16}/> Remove Step</button>
                        </div>
                        <button className="btn-primary" style={{padding: '0.6rem 1.5rem'}}>Save Step</button>
                      </div>
                      </div>
                    </div>
                  ))}

                  <div className="roadmap-step-container">
                    <div className="roadmap-timeline">
                      <div className="roadmap-circle" style={{backgroundColor: '#0f172a'}}><Plus size={18} /></div>
                    </div>
                    <div className="roadmap-content" style={{display: 'flex', alignItems: 'center'}}>
                      <button className="btn-primary" style={{backgroundColor: '#0f172a', padding: '0.6rem 2rem'}} onClick={handleAddGenericStep}>
                         Add Step
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {stepToDelete !== null && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
            <div style={{background: 'white', padding: '2rem', borderRadius: '12px', width: '400px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#0f172a'}}>
                <AlertCircle size={24} color="#ef4444" />
                <h2 style={{fontSize: '1.25rem', margin: 0}}>Delete Step?</h2>
              </div>
              <p style={{color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem'}}>Are you sure you want to remove this step? This action cannot be undone.</p>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                <button style={{background: 'none', border: 'none', color: '#64748b', fontWeight: 600, cursor: 'pointer'}} onClick={() => setStepToDelete(null)}>Cancel</button>
                <button style={{background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'}} onClick={confirmDeleteStep}>Delete Step</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
