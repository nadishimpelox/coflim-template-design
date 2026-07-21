import React, { useState } from 'react';
import { 
  MessageSquare, LayoutDashboard, FileText, Settings, 
  HelpCircle, LogOut, Activity, Plus, Trash2, 
  Link, FileImage, Sparkles, FileCode, HelpCircle as QuestionIcon,
  Video, Mic, FileUp, GripVertical, Play, AlertCircle, Sparkles as SparkIcon,
  Edit2, Copy, Check
} from 'lucide-react';
import './Admin.css';

const Admin = () => {
  const [currentView, setCurrentView] = useState('list'); 
  const [listTab, setListTab] = useState('templates'); // templates, categories, global

  // Templates State
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Untitled template', categories: '-', blocks: '-', active: true },
    { id: 2, name: 'Untitled template', categories: '-', blocks: '-', active: true },
    { id: 3, name: 'Untitled template', categories: '-', blocks: '-', active: true },
    { id: 4, name: 'Untitled template', categories: '-', blocks: '-', active: true }
  ]);
  
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);

  // Categories State
  const [categories, setCategories] = useState([
    { id: 1, name: 'Support' },
    { id: 2, name: 'Marketing' }
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Builder Steps State
  const [steps, setSteps] = useState([
    { 
      id: 1, type: 'audio', title: 'Audio Configuration', desc: 'Step 01', 
      instruction: 'Please upload your audio file...', outputType: 'text', required: true
    }
  ]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardInstruction, setWizardInstruction] = useState('');
  const [wizardType, setWizardType] = useState('question'); 
  const [newActionInput, setNewActionInput] = useState('');
  const [stepToDelete, setStepToDelete] = useState(null);

  // --- Templates List Logic ---
  const handleToggleTemplateActive = (id) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };
  const handleDuplicateTemplate = (template) => {
    const newId = templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1;
    setTemplates([...templates, { ...template, id: newId, name: `${template.name} (Copy)` }]);
  };
  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
  };
  const handleCreateTemplate = () => {
    setCurrentView('builder');
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
  const handleToggleRequired = (id) => setSteps(steps.map(s => s.id === id ? { ...s, required: !s.required } : s));
  
  const handleWizardSubmit = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    const titleMap = {
      'audio': 'Audio Configuration', 'video': 'Video Configuration', 'docs': 'Docs Configuration',
      'action': 'Action Options', 'question': 'Question Configuration', 'prompt': 'Prompt Configuration', 'link': 'Link Configuration'
    };
    let newStep = { id: newId, type: wizardType, title: titleMap[wizardType] || 'Configuration', desc: `Step 0${newId}`, instruction: wizardInstruction, outputType: 'text', required: false };
    if (wizardType === 'action') newStep.actionsList = [];
    if (wizardType === 'prompt') { newStep.promptText = ''; newStep.outputDestination = 'chat'; }
    if (wizardType === 'question') { newStep.answerType = 'text'; newStep.choices = [{id: 1, text: 'Option 1'}, {id: 2, text: 'Option 2'}]; }
    if (wizardType === 'link') { newStep.url = ''; }
    setSteps([...steps, newStep]); setIsWizardOpen(false); setWizardInstruction(''); setWizardType('question');
  };

  const ExpectedOutputSection = ({ step }) => (
    <div style={{ marginTop: '2rem' }}>
      <label className="input-label" style={{textTransform: 'none', color: '#0f172a'}}>Expected Output</label>
      <div className="expected-output-grid">
        <label className={`expected-tile ${step.outputType === 'text' ? 'active' : ''}`} onClick={() => handleUpdateStep(step.id, 'outputType', 'text')}>
          <input type="radio" checked={step.outputType === 'text'} readOnly style={{display: 'none'}} />
          <FileText size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Text</div><div className="expected-tile-sub">Manual entry</div></div>
        </label>
        <label className={`expected-tile ${step.outputType === 'image' ? 'active' : ''}`} onClick={() => handleUpdateStep(step.id, 'outputType', 'image')}>
          <input type="radio" checked={step.outputType === 'image'} readOnly style={{display: 'none'}} />
          <FileImage size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Image</div><div className="expected-tile-sub">Visual Data</div></div>
        </label>
        <label className={`expected-tile ${step.outputType === 'video' ? 'active' : ''}`} onClick={() => handleUpdateStep(step.id, 'outputType', 'video')}>
          <input type="radio" checked={step.outputType === 'video'} readOnly style={{display: 'none'}} />
          <Video size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Video</div><div className="expected-tile-sub">Motion clips</div></div>
        </label>
        <label className={`expected-tile ${step.outputType === 'chips' ? 'active' : ''}`} onClick={() => handleUpdateStep(step.id, 'outputType', 'chips')}>
          <input type="radio" checked={step.outputType === 'chips'} readOnly style={{display: 'none'}} />
          <FileCode size={18} className="expected-tile-icon" />
          <div><div className="expected-tile-title">Chips</div><div className="expected-tile-sub">Interactive</div></div>
        </label>
      </div>
    </div>
  );

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
                      {templates.map(t => (
                        <tr key={t.id}>
                          <td>
                            <div className="cell-name">
                              <SparkIcon size={16} className="cell-name-icon" fill="#f59e0b" />
                              {t.name}
                            </div>
                          </td>
                          <td style={{color: '#94a3b8'}}>{t.categories}</td>
                          <td style={{color: '#94a3b8'}}>{t.blocks}</td>
                          <td>
                            <div className={`toggle-pill ${t.active ? 'active' : ''}`} onClick={() => handleToggleTemplateActive(t.id)}>
                              <div className="toggle-circle"></div>
                            </div>
                          </td>
                          <td>
                            <div className="cell-actions" style={{justifyContent: 'flex-end'}}>
                              <Edit2 size={16} className="cell-action-icon" onClick={() => { setActiveTemplate(t); setCurrentView('builder'); }} />
                              <Copy size={16} className="cell-action-icon" onClick={() => handleDuplicateTemplate(t)} />
                              <Trash2 size={16} className="cell-action-icon delete" onClick={() => handleDeleteTemplate(t.id)} />
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
        ) : (
          /* Builder View */
          <>
            <header className="topbar">
              <div className="topbar-left">
                <div className="breadcrumb">
                  <span className="breadcrumb-title" style={{cursor: 'pointer'}} onClick={() => setCurrentView('list')}>Templates</span>
                  <div className="divider"></div>
                  <span className="breadcrumb-title" style={{color: '#2563eb'}}>{activeTemplate.name}</span>
                </div>
              </div>
              <div className="topbar-right">
                <div className="topbar-actions">
                  <button className="btn-primary" onClick={() => setCurrentView('list')}>Save Template</button>
                  <div className="avatar"><img src="https://ui-avatars.com/api/?name=Admin&background=cbd5e1" alt="User" style={{width: '100%'}}/></div>
                </div>
              </div>
            </header>

            <div className="workspace">
              <div className="workspace-inner">
                <div className="workflow-steps-container">
                  {steps.map((step) => (
                    <div key={step.id} className="step-card">
                      <div className="step-header">
                        <div className="step-header-left">
                          <div><div className="step-title">{step.title}</div><div className="step-subtitle">{step.desc}</div></div>
                        </div>
                        <div className="step-header-right">
                          <div className="toggle-wrap" style={{marginRight: '1rem'}}>
                            Required
                            <div className={`toggle-pill ${step.required ? 'active' : ''}`} onClick={() => handleToggleRequired(step.id)}>
                              <div className="toggle-circle"></div>
                            </div>
                          </div>
                          <GripVertical size={20} className="step-menu-icon" />
                        </div>
                      </div>

                      {step.type !== 'action' && (
                        <>
                          <label className="input-label" style={{textTransform: 'none', color: '#0f172a'}}>Step Instruction (e.g., Question for User)</label>
                          <textarea className="textarea-input" value={step.instruction} onChange={(e) => handleUpdateStep(step.id, 'instruction', e.target.value)} placeholder="e.g., Please enter your name..." style={{marginBottom: 0, minHeight: '60px', padding: '0.75rem', fontSize: '0.9rem'}} />
                        </>
                      )}

                      {/* UPLOAD TYPES */}
                      {(step.type === 'audio' || step.type === 'video' || step.type === 'docs') && (
                        <>
                          <label className="input-label" style={{textTransform: 'none', color: '#0f172a'}}>{step.type === 'audio' ? 'Audio Upload' : step.type === 'video' ? 'File Upload' : 'Document Upload'}</label>
                          <div className="upload-box">
                            <div className="upload-icon-circle">{step.type === 'audio' ? <Mic size={24} /> : step.type === 'video' ? <Play size={24} /> : <FileUp size={24} />}</div>
                            <div className="upload-title">Click to upload or drag and drop</div>
                            <div className="upload-sub">Supported formats: {step.type === 'audio' ? 'MP3, WAV' : step.type === 'video' ? 'MP4, MOV' : 'PDF, DOCX'} (Max 200MB)</div>
                          </div>
                        </>
                      )}

                      {/* ACTION CHOICES */}
                      {step.type === 'action' && (
                        <>
                          <div className="add-option-row">
                            <div style={{flex: 1}}>
                              <label className="input-label">ADD NEW OPTION</label>
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input type="text" className="text-input" style={{marginBottom: 0}} placeholder="e.g. Expand Content" value={newActionInput} onChange={(e) => setNewActionInput(e.target.value)} />
                                <button className="btn-secondary" onClick={() => { if(newActionInput.trim()) { handleUpdateStep(step.id, 'actionsList', [...step.actionsList, {id: Date.now(), name: newActionInput, prompt: ''}]); setNewActionInput(''); }}}>Add Option</button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="configured-choices">
                            <label className="input-label">CONFIGURED CHOICES</label>
                            <div className="action-choices-grid">
                              {step.actionsList?.map(action => (
                                <div key={action.id} className="action-card">
                                  <div className="action-card-header">
                                    <div className="action-card-left"><GripVertical size={16} color="#cbd5e1" /> {action.name}</div>
                                    <Trash2 size={16} className="step-delete-icon" onClick={() => handleUpdateStep(step.id, 'actionsList', step.actionsList.filter(a => a.id !== action.id))} />
                                  </div>
                                  <label className="action-card-prompt-label">📝 PROMPT / INSTRUCTION</label>
                                  <textarea className="textarea-input" style={{marginBottom: 0, minHeight: '60px', padding: '0.5rem', fontSize: '0.8rem'}} placeholder="e.g. Rewrite the previous output..." value={action.prompt} onChange={(e) => handleUpdateStep(step.id, 'actionsList', step.actionsList.map(a => a.id === action.id ? {...a, prompt: e.target.value} : a))} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <ExpectedOutputSection step={step} />

                      {/* Step Footer */}
                      <div className="step-footer">
                        <div className="step-footer-left">
                          <button className="btn-remove-step" onClick={() => handleDeleteStep(step.id)}><Trash2 size={16}/> Remove Step</button>
                        </div>
                        <button className="btn-primary" style={{padding: '0.6rem 1.5rem'}}>Save Step</button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Step Wizard */}
                  {isWizardOpen ? (
                    <div className="wizard-card">
                      <div className="wizard-title">Add New Step</div>
                      <div className="wizard-subtitle">Select the type of step you want to add to your template.</div>
                      
                      <label className="input-label" style={{textTransform: 'none', color: '#0f172a'}}>Step Instruction</label>
                      <input type="text" className="text-input" placeholder="e.g., Please enter your name..." value={wizardInstruction} onChange={e => setWizardInstruction(e.target.value)} />
                      
                      <div className="wizard-grid">
                        {['question', 'prompt', 'docs', 'video', 'audio', 'link', 'action'].map(t => (
                           <div key={t} className={`wizard-tile ${wizardType === t ? 'selected' : ''}`} onClick={() => setWizardType(t)}>
                             {t === 'question' && <QuestionIcon size={24} className="wizard-tile-icon" />}
                             {t === 'prompt' && <FileText size={24} className="wizard-tile-icon" />}
                             {t === 'docs' && <FileUp size={24} className="wizard-tile-icon" color="#eab308" />}
                             {t === 'video' && <Video size={24} className="wizard-tile-icon" color="#3b82f6" />}
                             {t === 'audio' && <Mic size={24} className="wizard-tile-icon" color="#a855f7" />}
                             {t === 'link' && <Link size={24} className="wizard-tile-icon" color="#94a3b8" />}
                             {t === 'action' && <Sparkles size={24} className="wizard-tile-icon" color="#ef4444" />}
                             <div className="wizard-tile-label" style={{textTransform: 'capitalize'}}>{t}</div>
                           </div>
                        ))}
                      </div>

                      <div className="wizard-footer">
                        <button className="btn-cancel-step" onClick={() => setIsWizardOpen(false)} style={{background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 500}}>Cancel</button>
                        <button className="btn-primary" onClick={handleWizardSubmit}>Continue to Config</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
                      <button className="btn-primary" style={{backgroundColor: '#0f172a', padding: '0.6rem 2rem'}} onClick={() => setIsWizardOpen(true)}>
                         Add Step
                      </button>
                    </div>
                  )}
                  
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
