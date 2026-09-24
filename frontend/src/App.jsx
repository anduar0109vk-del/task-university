import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const icons = {
  grid: '▦',
  tasks: '✓',
  users: '◉',
  category: '◇',
  audit: '◌',
  logout: '↪',
  plus: '+',
  search: '⌕',
  calendar: '▣',
}

async function api(path, options = {}) {
  const token = localStorage.getItem('task-university-token')
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || data.message || 'No se pudo completar la solicitud')
  return data
}

function formatDate(date) {
  if (!date) return 'Sin fecha'
  const dateText = String(date).slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) return 'Sin fecha'
  const parsedDate = new Date(`${dateText}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsedDate)
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ nombre_usuario: '', contrasena: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    setLoading(true); setError('')
    try {
      const result = await api('/auth/login', { method: 'POST', body: JSON.stringify(form) })
      localStorage.setItem('task-university-token', result.token)
      onLogin(result.usuario || result.user)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  return (
    <main className="auth-shell">
      <section className="auth-brand">
        <div className="brand-mark">TU</div>
        <p className="eyebrow">PLATAFORMA ACADÉMICA</p>
        <h1>Organiza tus metas.<br /><span>Alcanza tu potencial.</span></h1>
        <p className="auth-copy">Un espacio profesional para planificar, priorizar y completar cada desafío universitario.</p>
        <div className="auth-stats"><strong>+1.2k</strong><span>tareas organizadas</span><strong>98%</strong><span>de productividad</span></div>
      </section>
      <section className="auth-card">
        <div className="brand-lockup"><div className="brand-mark small">TU</div><strong>Task<span>University</span></strong></div>
        <h2>Bienvenido de nuevo</h2><p className="muted">Ingresa tus credenciales para continuar.</p>
        <form onSubmit={submit}>
          <label>Usuario<input autoFocus required value={form.nombre_usuario} onChange={(e) => setForm({ ...form, nombre_usuario: e.target.value })} placeholder="Tu nombre de usuario" /></label>
          <label>Contraseña<input required type="password" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} placeholder="••••••••" /></label>
          {error && <div className="alert">{error}</div>}
          <button className="primary full" disabled={loading}>{loading ? 'Ingresando…' : 'Iniciar sesión  →'}</button>
        </form>
        <p className="login-hint">Acceso administrador inicial: <strong>admin</strong> / <strong>Admin123!</strong></p>
      </section>
    </main>
  )
}

function StatCard({ label, value, detail, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{tone === 'blue' ? icons.tasks : tone === 'green' ? '✓' : tone === 'orange' ? '◷' : '!'}</div><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></div>
}

function TaskModal({ task, categories, onClose, onSave }) {
  const [form, setForm] = useState(task || { titulo: '', descripcion: '', prioridad: 'media', estado: 'pendiente', fecha_limite: '', categoria_id: '' })
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault(); setError('')
    try { await onSave(form) } catch (err) { setError(err.message) }
  }
  return <div className="modal-backdrop"><div className="modal"><div className="modal-header"><div><p className="eyebrow">GESTIÓN DE TAREAS</p><h2>{task ? 'Editar tarea' : 'Nueva tarea'}</h2></div><button className="icon-button" onClick={onClose}>×</button></div>
    <form onSubmit={submit} className="modal-form">
      <label>Título<input required maxLength="200" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ej. Preparar exposición final" /></label>
      <label>Descripción<textarea rows="3" maxLength="1000" value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Agrega contexto o próximos pasos…" /></label>
      <div className="form-grid"><label>Prioridad<select value={form.prioridad} onChange={(e) => setForm({ ...form, prioridad: e.target.value })}><option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option></select></label><label>Estado<select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}><option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option></select></label></div>
      <div className="form-grid"><label>Fecha límite<input type="date" value={form.fecha_limite || ''} onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })} /></label><label>Categoría<select value={form.categoria_id || ''} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}><option value="">Sin categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}</select></label></div>
      {error && <div className="alert">{error}</div>}<div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancelar</button><button className="primary">{task ? 'Guardar cambios' : 'Crear tarea'}</button></div>
    </form></div></div>
}

function Dashboard({ stats }) {
  const completion = stats.total ? Math.round((stats.completadas / stats.total) * 100) : 0
  return <><div className="page-heading"><div><p className="eyebrow">RESUMEN GENERAL</p><h1>Tu productividad, en foco.</h1><p className="muted">Una visión clara de tus objetivos académicos.</p></div></div><div className="stats-grid"><StatCard label="Tareas totales" value={stats.total} detail="En tu espacio" tone="blue" /><StatCard label="Completadas" value={stats.completadas} detail={`${completion}% de avance`} tone="green" /><StatCard label="En progreso" value={stats.en_progreso} detail="Trabajando ahora" tone="orange" /><StatCard label="Pendientes" value={stats.pendientes} detail="Para organizar" tone="red" /></div><div className="dashboard-grid"><div className="panel progress-panel"><div className="panel-heading"><div><p className="eyebrow">RENDIMIENTO</p><h2>Progreso general</h2></div><span className="big-percent">{completion}%</span></div><div className="progress-track"><div style={{ width: `${completion}%` }} /></div><div className="progress-legend"><span><i className="dot green" />Completadas <b>{stats.completadas}</b></span><span><i className="dot orange" />En progreso <b>{stats.en_progreso}</b></span><span><i className="dot gray" />Pendientes <b>{stats.pendientes}</b></span></div></div><div className="panel quote-panel"><span className="quote-mark">“</span><p>El éxito es la suma de pequeños esfuerzos repetidos día tras día.</p><small>— Robert Collier</small></div></div></>
}

function Tasks({ tasks, categories, onCreate, onEdit, onDelete, onStatus }) {
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState('todos')
  const filtered = useMemo(() => tasks.filter((task) => (filter === 'todos' || task.estado === filter) && `${task.titulo} ${task.descripcion || ''}`.toLowerCase().includes(query.toLowerCase())), [tasks, filter, query])
  return <><div className="page-heading heading-row"><div><p className="eyebrow">PLANIFICACIÓN</p><h1>Mis tareas</h1><p className="muted">Convierte tus planes en logros concretos.</p></div><button className="primary" onClick={onCreate}>{icons.plus} Nueva tarea</button></div><div className="toolbar"><div className="search"><span>{icons.search}</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar tareas…" /></div><div className="filter-tabs">{[['todos', 'Todas'], ['pendiente', 'Pendientes'], ['en_progreso', 'En progreso'], ['completada', 'Completadas']].map(([value, label]) => <button className={filter === value ? 'active' : ''} key={value} onClick={() => setFilter(value)}>{label}</button>)}</div></div><div className="task-list">{filtered.length ? filtered.map((task) => <article className={`task-card ${task.estado === 'completada' ? 'done' : ''}`} key={task.id}><button className={`check ${task.estado === 'completada' ? 'checked' : ''}`} onClick={() => onStatus(task)}>{task.estado === 'completada' ? '✓' : ''}</button><div className="task-main"><div className="task-title-row"><h3>{task.titulo}</h3><span className={`priority ${task.prioridad}`}>{task.prioridad}</span></div><p>{task.descripcion || 'Sin descripción'}</p><div className="task-meta"><span>{icons.calendar} {formatDate(task.fecha_limite)}</span>{task.categoria_nombre && <span className="category-label" style={{ '--category-color': task.categoria_color }}>{task.categoria_nombre}</span>}<span className={`status ${task.estado}`}>{task.estado.replace('_', ' ')}</span></div></div><div className="task-actions"><button onClick={() => onEdit(task)}>Editar</button><button className="danger-text" onClick={() => onDelete(task)}>Eliminar</button></div></article>) : <div className="empty"><span>✓</span><h3>No hay tareas para mostrar</h3><p>Crea tu primera tarea y empieza a organizarte.</p></div>}</div></>
}

function AdminUsers({ users, onCreate }) {
  return <><div className="page-heading heading-row"><div><p className="eyebrow">ADMINISTRACIÓN</p><h1>Usuarios</h1><p className="muted">Gestiona los accesos de tu equipo.</p></div><button className="primary" onClick={onCreate}>{icons.plus} Nuevo usuario</button></div><div className="panel table-panel"><table><thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Registro</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><strong>{user.nombre_completo}</strong><small>@{user.nombre_usuario}</small></td><td>{user.correo_electronico}</td><td><span className="role">{user.rol}</span></td><td><span className="active-state"><i />Activo</span></td><td>{formatDate(String(user.fecha_creacion).slice(0, 10))}</td></tr>)}</tbody></table></div></>
}

function AdminCategories({ categories, onCreate, onDelete }) {
  return <><div className="page-heading heading-row"><div><p className="eyebrow">CONFIGURACIÓN</p><h1>Categorías</h1><p className="muted">Clasifica tus tareas con claridad.</p></div><button className="primary" onClick={onCreate}>{icons.plus} Nueva categoría</button></div><div className="panel table-panel"><table><thead><tr><th>Nombre</th><th>Descripción</th><th>Color</th><th>Acción</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td><strong>{category.nombre}</strong></td><td>{category.descripcion || 'Sin descripción'}</td><td><span className="category-label" style={{ '--category-color': category.color }}>{category.color}</span></td><td><button className="danger-text" onClick={() => onDelete(category)}>Eliminar</button></td></tr>)}</tbody></table></div></>
}

function AuditLog({ entries }) {
  return <><div className="page-heading"><p className="eyebrow">SEGURIDAD</p><h1>Auditoría</h1><p className="muted">Registro de actividad administrativa del sistema.</p></div><div className="panel table-panel"><table><thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Tabla</th><th>Detalle</th></tr></thead><tbody>{entries.length ? entries.map((entry) => <tr key={entry.id}><td>{formatDate(String(entry.fecha_creacion).slice(0, 10))}</td><td>{entry.nombre_usuario || 'Sistema'}</td><td><span className="role">{entry.accion}</span></td><td>{entry.tabla_afectada || '-'}</td><td>{entry.detalles || '-'}</td></tr>) : <tr><td colSpan="5">No hay actividad registrada.</td></tr>}</tbody></table></div></>
}

function UserModal({ onClose, onSave }) {
  const [form, setForm] = useState({ nombre_completo: '', nombre_usuario: '', correo_electronico: '', contrasena: '', rol: 'usuario' }); const [error, setError] = useState('')
  const submit = async (e) => { e.preventDefault(); try { await onSave(form) } catch (err) { setError(err.message) } }
  return <div className="modal-backdrop"><div className="modal"><div className="modal-header"><div><p className="eyebrow">ADMINISTRACIÓN</p><h2>Nuevo usuario</h2></div><button className="icon-button" onClick={onClose}>×</button></div><form onSubmit={submit} className="modal-form"><label>Nombre completo<input required value={form.nombre_completo} onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })} /></label><div className="form-grid"><label>Usuario<input required value={form.nombre_usuario} onChange={(e) => setForm({ ...form, nombre_usuario: e.target.value })} /></label><label>Correo<input required type="email" value={form.correo_electronico} onChange={(e) => setForm({ ...form, correo_electronico: e.target.value })} /></label></div><div className="form-grid"><label>Contraseña<input required type="password" minLength="8" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} /></label><label>Rol<select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}><option value="usuario">Usuario</option><option value="admin">Administrador</option></select></label></div>{error && <div className="alert">{error}</div>}<div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancelar</button><button className="primary">Crear usuario</button></div></form></div></div>
}

function CategoryModal({ onClose, onSave }) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', color: '#3B82F6' }); const [error, setError] = useState('')
  const submit = async (e) => { e.preventDefault(); try { await onSave(form) } catch (err) { setError(err.message) } }
  return <div className="modal-backdrop"><div className="modal"><div className="modal-header"><div><p className="eyebrow">CONFIGURACIÓN</p><h2>Nueva categoría</h2></div><button className="icon-button" onClick={onClose}>×</button></div><form onSubmit={submit} className="modal-form"><label>Nombre<input required maxLength="100" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label><label>Descripción<textarea rows="3" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></label><label>Color<input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></label>{error && <div className="alert">{error}</div>}<div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancelar</button><button className="primary">Crear categoría</button></div></form></div></div>
}

function App() {
  const [user, setUser] = useState(null); const [view, setView] = useState('dashboard'); const [stats, setStats] = useState({ total: 0, completadas: 0, pendientes: 0, en_progreso: 0 }); const [tasks, setTasks] = useState([]); const [categories, setCategories] = useState([]); const [users, setUsers] = useState([]); const [auditEntries, setAuditEntries] = useState([]); const [modal, setModal] = useState(null); const [toast, setToast] = useState(''); const [loading, setLoading] = useState(true)
  const notify = (message) => { setToast(message); setTimeout(() => setToast(''), 3000) }
  const load = async () => { setLoading(true); try { const [dashboard, taskResult, categoryResult] = await Promise.all([api('/dashboard'), api('/tareas'), api('/categorias')]); setStats(dashboard.data || dashboard); setTasks(taskResult.data || taskResult.tareas || taskResult); setCategories(categoryResult.data || categoryResult.categorias || categoryResult); if (user?.rol === 'admin') { const [usersResult, auditResult] = await Promise.all([api('/usuarios'), api('/dashboard/auditoria')]); setUsers(usersResult.data || usersResult.usuarios || usersResult); setAuditEntries(auditResult.data || []) } } catch (err) { if (err.message.toLowerCase().includes('token')) { localStorage.removeItem('task-university-token'); setUser(null) } else notify(err.message) } finally { setLoading(false) } }
  useEffect(() => {
    const token = localStorage.getItem('task-university-token')
    if (!token) { setLoading(false); return }
    api('/auth/me').then((result) => setUser(result.usuario || result.data)).catch(() => localStorage.removeItem('task-university-token')).finally(() => setLoading(false))
  }, [])
  useEffect(() => { if (user) load() }, [user])
  if (!user) return <Login onLogin={setUser} />
  const saveTask = async (form) => { const path = modal.task ? `/tareas/${modal.task.id}` : '/tareas'; await api(path, { method: modal.task ? 'PUT' : 'POST', body: JSON.stringify(form) }); setModal(null); await load(); notify(modal.task ? 'Tarea actualizada' : 'Tarea creada') }
  const deleteTask = async (task) => { if (!window.confirm(`¿Eliminar "${task.titulo}"?`)) return; await api(`/tareas/${task.id}`, { method: 'DELETE' }); await load(); notify('Tarea eliminada') }
  const statusTask = async (task) => { await api(`/tareas/${task.id}`, { method: 'PUT', body: JSON.stringify({ ...task, estado: task.estado === 'completada' ? 'pendiente' : 'completada', categoria_id: task.categoria_id || null }) }); await load(); }
  const saveUser = async (form) => { await api('/usuarios', { method: 'POST', body: JSON.stringify(form) }); setModal(null); await load(); notify('Usuario creado') }
  const saveCategory = async (form) => { await api('/categorias', { method: 'POST', body: JSON.stringify(form) }); setModal(null); await load(); notify('Categoría creada') }
  const deleteCategory = async (category) => { if (!window.confirm(`¿Eliminar "${category.nombre}"?`)) return; await api(`/categorias/${category.id}`, { method: 'DELETE' }); await load(); notify('Categoría eliminada') }
  const logout = async () => { try { await api('/auth/logout', { method: 'POST' }) } catch (_) {} finally { localStorage.removeItem('task-university-token'); setUser(null) } }
  return <div className="app-shell"><aside className="sidebar"><div className="brand-lockup"><div className="brand-mark small">TU</div><strong>Task<span>University</span></strong></div><div className="sidebar-label">ESPACIO DE TRABAJO</div><nav>{[['dashboard', icons.grid, 'Dashboard'], ['tasks', icons.tasks, 'Mis tareas'], ...(user.rol === 'admin' ? [['users', icons.users, 'Usuarios'], ['categories', icons.category, 'Categorías'], ['audit', icons.audit, 'Auditoría']] : [])].map(([id, icon, label]) => <button className={view === id ? 'selected' : ''} onClick={() => setView(id)} key={id}><span>{icon}</span>{label}</button>)}</nav><div className="sidebar-bottom"><div className="sidebar-label">CUENTA</div><button onClick={logout}><span>{icons.logout}</span>Cerrar sesión</button></div></aside><main className="main-content"><header className="topbar"><div className="mobile-brand"><div className="brand-mark small">TU</div><strong>Task<span>University</span></strong></div><div className="topbar-right"><span className="date-label">{new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</span><div className="avatar">{user.nombre_completo?.charAt(0) || 'A'}</div><div className="user-name"><strong>{user.nombre_completo}</strong><small>{user.rol === 'admin' ? 'Administrador' : 'Estudiante'}</small></div></div></header><div className="content">{loading ? <div className="loading">Cargando tu espacio…</div> : view === 'dashboard' ? <Dashboard stats={stats} /> : view === 'tasks' ? <Tasks tasks={tasks} categories={categories} onCreate={() => setModal({ type: 'task' })} onEdit={(task) => setModal({ type: 'task', task })} onDelete={deleteTask} onStatus={statusTask} /> : view === 'users' ? <AdminUsers users={users} onCreate={() => setModal({ type: 'user' })} /> : view === 'categories' ? <AdminCategories categories={categories} onCreate={() => setModal({ type: 'category' })} onDelete={deleteCategory} /> : <AuditLog entries={auditEntries} />}</div></main>{modal?.type === 'task' && <TaskModal task={modal.task} categories={categories} onClose={() => setModal(null)} onSave={saveTask} />}{modal?.type === 'user' && <UserModal onClose={() => setModal(null)} onSave={saveUser} />}{modal?.type === 'category' && <CategoryModal onClose={() => setModal(null)} onSave={saveCategory} />}{toast && <div className="toast">{toast}</div>}</div>
}

export default App
