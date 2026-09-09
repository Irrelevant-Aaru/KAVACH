'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownUp,
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Crosshair,
  Database,
  Download,
  FileKey2,
  Filter,
  GripVertical,
  HeartPulse,
  Layers3,
  LockKeyhole,
  MapPin,
  Menu,
  Moon,
  MoreHorizontal,
  Network,
  Plus,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  Target,
  TimerReset,
  UserRound,
  Users,
  X,
  Zap,
} from 'lucide-react'

type Role = 'Commander' | 'NCO / Roster' | 'Soldier' | 'Leave Authority' | 'Medical Team' | 'System Map'

type Soldier = {
  id: string
  name: string
  initials: string
  rank: string
  badges: string[]
  readiness: number
  status: string
  reason: string
  duty?: string
}

const soldiersSeed: Soldier[] = [
  { id: 'A-014', name: 'M. Alvarez', initials: 'MA', rank: 'SGT', badges: ['Leader', 'Rifleman'], readiness: 96, status: 'Available', reason: 'Ready for assignment' },
  { id: 'A-022', name: 'J. Okafor', initials: 'JO', rank: 'CPL', badges: ['Heavy Driver'], readiness: 91, status: 'Available', reason: 'Ready for assignment' },
  { id: 'A-031', name: 'R. Chen', initials: 'RC', rank: 'PFC', badges: ['Rifleman', 'Medic'], readiness: 88, status: 'Available', reason: 'Ready for assignment' },
  { id: 'A-008', name: 'D. Morgan', initials: 'DM', rank: 'SPC', badges: ['Heavy Driver'], readiness: 74, status: 'Unavailable', reason: 'Recovery window · 18h' },
  { id: 'A-019', name: 'S. Patel', initials: 'SP', rank: 'PFC', badges: ['Rifleman'], readiness: 82, status: 'Available', reason: 'Ready for assignment' },
  { id: 'A-027', name: 'T. Williams', initials: 'TW', rank: 'CPL', badges: ['Leader'], readiness: 67, status: 'Unavailable', reason: 'Medical review · 02d' },
]

const roleMeta: Record<Role, { code: string; title: string; subtitle: string; icon: typeof ShieldCheck }> = {
  Commander: { code: 'CMD-01', title: 'Company command', subtitle: 'Formation & readiness control', icon: Target },
  'NCO / Roster': { code: 'NCO-04', title: 'Roster operations', subtitle: 'Duty check-in / check-out', icon: ClipboardCheck },
  Soldier: { code: 'SOL-014', title: 'Personal mission view', subtitle: 'Verify assignment & report', icon: UserRound },
  'Leave Authority': { code: 'LVA-02', title: 'Leave authority', subtitle: 'Review deservedness queue', icon: FileKey2 },
  'Medical Team': { code: 'MED-07', title: 'Medical operations', subtitle: 'Company health coverage', icon: Stethoscope },
  'System Map': { code: 'SYS-ARCH', title: 'System architecture', subtitle: 'Data boundaries & flow', icon: Network },
}

function Panel({ children, className = '', title, eyebrow, action }: { children: React.ReactNode; className?: string; title?: string; eyebrow?: string; action?: React.ReactNode }) {
  return <section className={`panel ${className}`}>
    {(title || eyebrow || action) && <div className="panel-head"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}{title && <h2>{title}</h2>}</div>{action}</div>}
    {children}
  </section>
}

function StatusPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'danger' }) {
  return <span className={`status-pill ${tone}`}><span className="status-dot" />{children}</span>
}

function Header({ role, setRole, onMenu }: { role: Role; setRole: (role: Role) => void; onMenu: () => void }) {
  const meta = roleMeta[role]
  return <header className="topbar">
    <div className="brand"><div className="brand-mark"><Crosshair size={19} /></div><div><strong>FIELD//OS</strong><span>decision support network</span></div></div>
    <button className="mobile-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button>
    <div className="top-context"><span className="live"><span />LIVE NETWORK</span><span className="divider" /><MapPin size={14} /> <span>FOB NORTHSTAR</span><span className="divider" /><span>07 SEP 2026 · 14:32 Z</span></div>
    <div className="top-actions"><button className="icon-btn" aria-label="Refresh"><RefreshCw size={16} /></button><button className="icon-btn has-alert" aria-label="Alerts"><Siren size={16} /></button><div className="profile"><div className="avatar">AK</div><div><strong>CAPT. KIM</strong><span>{meta.code}</span></div><ChevronRight size={15} /></div></div>
  </header>
}

function Sidebar({ role, setRole, open, close }: { role: Role; setRole: (role: Role) => void; open: boolean; close: () => void }) {
  const items: { role: Role; icon: typeof Target; label: string }[] = [
    { role: 'Commander', icon: Target, label: 'Command deck' }, { role: 'NCO / Roster', icon: ClipboardCheck, label: 'Roster operations' }, { role: 'Soldier', icon: UserRound, label: 'Soldier view' }, { role: 'Leave Authority', icon: FileKey2, label: 'Leave authority' }, { role: 'Medical Team', icon: Stethoscope, label: 'Medical team' },
  ]
  return <aside className={`sidebar ${open ? 'open' : ''}`}><div className="side-label">AUTHORIZED VIEWS <button onClick={close}><X size={15} /></button></div>{items.map(({ role: itemRole, icon: Icon, label }) => <button key={itemRole} className={`nav-item ${role === itemRole ? 'active' : ''}`} onClick={() => { setRole(itemRole); close() }}><Icon size={17} /><span>{label}</span>{role === itemRole && <ArrowRight size={14} />}</button>)}<div className="side-spacer" /><div className="side-label">SYSTEM</div><button className={`nav-item ${role === 'System Map' ? 'active' : ''}`} onClick={() => { setRole('System Map'); close() }}><Network size={17} /><span>Architecture map</span></button><div className="secure-box"><LockKeyhole size={16} /><div><strong>SECURE CHANNEL</strong><span>All events audited</span></div></div><div className="build">FIELD//OS v0.8.4<br /><span>PROTOTYPE / SIMULATION</span></div></aside>
}

function Kpi({ label, value, detail, tone = 'default', icon: Icon }: { label: string; value: string; detail: string; tone?: string; icon: typeof Activity }) {
  return <div className={`kpi ${tone}`}><div className="kpi-icon"><Icon size={16} /></div><div><div className="kpi-label">{label}</div><strong>{value}</strong><span>{detail}</span></div></div>
}

function Readiness({ value }: { value: number }) {
  const tone = value >= 85 ? 'good' : value >= 75 ? 'warn' : 'danger'
  return <div className="readiness"><div className="readiness-bar"><span className={tone} style={{ width: `${value}%` }} /></div><strong className={tone}>{value}</strong></div>
}

function CommanderView() {
  const [soldiers, setSoldiers] = useState(soldiersSeed)
  const [sort, setSort] = useState<'readiness' | 'name'>('readiness')
  const [formation, setFormation] = useState('ALPHA // 03')
  const [selected, setSelected] = useState(['A-014', 'A-022', 'A-031'])
  const [saved, setSaved] = useState(false)
  const sorted = useMemo(() => [...soldiers].sort((a, b) => sort === 'readiness' ? b.readiness - a.readiness : a.name.localeCompare(b.name)), [soldiers, sort])
  const formationPeople = selected.map((id) => soldiers.find((s) => s.id === id)).filter(Boolean) as Soldier[]
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id])
  return <>
    <div className="page-title"><div><div className="eyebrow">COMMANDER / COMPANY 04</div><h1>Command deck</h1><p>Readiness overview and formation control. Table A access: company scoped.</p></div><div className="title-actions"><button className="button ghost"><Download size={15} /> Export brief</button><button className="button primary" onClick={() => setSaved(true)}><Plus size={15} /> New formation</button></div></div>
    <div className="kpi-grid"><Kpi label="Company strength" value="42 / 48" detail="6 unavailable" icon={Users} /><Kpi label="Avg readiness" value="84.6" detail="+2.4 since 00:00" tone="good" icon={Activity} /><Kpi label="On duty" value="18" detail="3 formations active" tone="warn" icon={Crosshair} /><Kpi label="Model signal" value="STABLE" detail="Last run 02:00 Z" icon={BrainCircuit} /></div>
    <div className="content-grid commander-grid"><Panel className="roster-panel" eyebrow="TABLE A / COMPANY 04" title="Personnel readiness" action={<div className="panel-actions"><button className="filter-button" onClick={() => setSort(sort === 'readiness' ? 'name' : 'readiness')}><ArrowDownUp size={14} /> Sort: {sort === 'readiness' ? 'readiness' : 'name'}</button><button className="icon-btn"><Filter size={15} /></button></div>}>
      <div className="table-wrap"><table><thead><tr><th>Personnel</th><th>Availability</th><th>Readiness</th><th>Capability badges</th><th /></tr></thead><tbody>{sorted.map((soldier) => <tr key={soldier.id} className={selected.includes(soldier.id) ? 'selected-row' : ''}><td><div className="person"><div className="avatar small">{soldier.initials}</div><div><strong>{soldier.name}</strong><span>{soldier.rank} · {soldier.id}</span></div></div></td><td><StatusPill tone={soldier.status === 'Available' ? 'good' : 'danger'}>{soldier.status}</StatusPill><small className="subtext">{soldier.reason}</small></td><td><Readiness value={soldier.readiness} /></td><td><div className="badges">{soldier.badges.map((badge) => <span key={badge}>{badge}</span>)}</div></td><td><button className={`select-btn ${selected.includes(soldier.id) ? 'checked' : ''}`} onClick={() => toggle(soldier.id)} aria-label={`Select ${soldier.name}`}>{selected.includes(soldier.id) ? <Check size={14} /> : <Plus size={14} />}</button></td></tr>)}</tbody></table></div>
      <div className="table-foot"><span><span className="status-dot good-bg" /> Showing 6 of 48 personnel</span><button className="text-button">View unavailable reasons <ArrowRight size={13} /></button></div>
    </Panel><Panel className="formation-panel" eyebrow="FORMATION BUILDER" title="Mission formation" action={<button className="icon-btn"><MoreHorizontal size={16} /></button>}>
      <div className="formation-select"><label>FORMATION SKELETON</label><select value={formation} onChange={(e) => setFormation(e.target.value)}><option>ALPHA // 03</option><option>BRAVO // 05</option><option>CHARLIE // 08</option></select><span>Last saved 06 SEP · 18:40 Z</span></div><div className="mission-band"><div><span>WORK PROFILE</span><strong>LEVEL 02 · STANDARD</strong></div><div><span>STRENGTH</span><strong>{selected.length.toString().padStart(2, '0')} / 03</strong></div></div><div className="formation-list">{formationPeople.length ? formationPeople.map((person, index) => <div className="formation-row" draggable key={person.id}><GripVertical size={15} className="grip" /><span className="slot">0{index + 1}</span><div className="avatar small">{person.initials}</div><div className="formation-person"><strong>{person.name}</strong><span>{person.badges[0]} · readiness {person.readiness}</span></div><ChevronRight size={14} /></div>) : <div className="empty-state">Select personnel from the roster to build a formation.</div>}</div><div className="formation-foot"><button className="button ghost" onClick={() => setSelected([])}>Clear</button><button className="button primary" onClick={() => setSaved(true)}><BadgeCheck size={15} /> {saved ? 'Formation saved' : 'Save skeleton'}</button></div>
    </Panel></div>
    <div className="notice"><Sparkles size={16} /><div><strong>MODEL RECOMMENDATION</strong><span>Formation ALPHA // 03 meets the selected Level 02 profile with 96% predicted mission readiness.</span></div><button className="text-button">Review signal <ArrowRight size={13} /></button></div>
  </>
}

function NcoView() {
  const [checked, setChecked] = useState<string[]>([])
  const [returned, setReturned] = useState<string[]>([])
  const pending = soldiersSeed.slice(0, 4)
  return <><div className="page-title"><div><div className="eyebrow">NCO / ROSTER OPERATIONS</div><h1>Duty control</h1><p>Receive commander formations, confirm movement, and close active duty records.</p></div><div className="live-card"><span className="status-dot good-bg" /> ROSTER SYNCED <span>14:31:58 Z</span></div></div><div className="kpi-grid"><Kpi label="Pending check-in" value={`${pending.length}`} detail="Formation ALPHA // 03" tone="warn" icon={Clock3} /><Kpi label="Active duty" value="18" detail="Across 3 formations" icon={Crosshair} /><Kpi label="Return due" value="04" detail="Next window 18:00 Z" tone="danger" icon={TimerReset} /><Kpi label="Records today" value="27" detail="Table B writes: 27" icon={Database} /></div><div className="content-grid nco-grid"><Panel eyebrow="COMMANDER HANDOFF" title="Formation ALPHA // 03" action={<StatusPill tone="warn">Awaiting movement</StatusPill>}><div className="mission-detail"><div><span className="kpi-label">MISSION PROFILE</span><strong>LEVEL 02 · STANDARD</strong></div><div><span className="kpi-label">ORIGIN</span><strong>CMD-01 · 14:18 Z</strong></div><div><span className="kpi-label">DESTINATION</span><strong>SECTOR C / EAST</strong></div></div><div className="check-list">{pending.map((soldier) => <div className={`check-row ${checked.includes(soldier.id) ? 'done' : ''}`} key={soldier.id}><div className="person"><div className="avatar small">{soldier.initials}</div><div><strong>{soldier.name}</strong><span>{soldier.id} · {soldier.badges.join(' / ')}</span></div></div><button className={`button ${checked.includes(soldier.id) ? 'success' : 'primary'}`} onClick={() => setChecked((x) => x.includes(soldier.id) ? x : [...x, soldier.id])}>{checked.includes(soldier.id) ? <><CheckCircle2 size={15} /> Checked in</> : <><ClipboardCheck size={15} /> Check in</>}</button></div>)}</div><div className="panel-foot"><span>{checked.length} of {pending.length} confirmed · writes to Table A + Table B</span><button className="button ghost" disabled={checked.length !== pending.length}><ArrowRight size={15} /> Start duty record</button></div></Panel><Panel eyebrow="ACTIVE ASSIGNMENTS" title="Close duty record" action={<button className="filter-button"><Filter size={14} /> Filter</button>}><div className="active-list">{soldiersSeed.slice(0, 3).map((soldier, i) => <div className="active-row" key={soldier.id}><div className="person"><div className="avatar small muted-avatar">{soldier.initials}</div><div><strong>{soldier.name}</strong><span>LEVEL 0{i + 1} · started {12 + i}:2{i} Z</span></div></div><button className={`button ${returned.includes(soldier.id) ? 'success' : 'ghost'}`} onClick={() => setReturned((x) => [...x, soldier.id])}>{returned.includes(soldier.id) ? <><Check size={14} /> Closed</> : 'Record return'}</button></div>)}</div><div className="table-foot"><span><span className="status-dot warn-bg" /> End time required before model run</span></div></Panel></div></>
}

function SoldierView() {
  const [verified, setVerified] = useState(false); const [submitted, setSubmitted] = useState(false)
  return <><div className="page-title"><div><div className="eyebrow">SOLDIER / A-014</div><h1>Mission brief</h1><p>Private personnel view. Only your current assignment and personal logs are visible.</p></div><StatusPill tone="good">Identity verified</StatusPill></div><div className="content-grid soldier-grid"><Panel className="assignment-panel" eyebrow="ACTIVE ASSIGNMENT" title="Sector C / East" action={<StatusPill tone="warn">On duty</StatusPill>}><div className="assignment-hero"><div className="mission-icon"><Crosshair size={28} /></div><div><span>FORMATION ALPHA // 03</span><strong>LEVEL 02 · STANDARD</strong><small>Assigned by CMD-01 · checked in 14:24 Z</small></div></div><div className="assignment-grid"><div><span>ROLE</span><strong>Lead rifleman</strong></div><div><span>SHIFT</span><strong>14:30 — 18:00 Z</strong></div><div><span>STATUS</span><strong className="amber-text">Verification pending</strong></div></div><button className={`button ${verified ? 'success' : 'primary'} full`} onClick={() => setVerified(true)}>{verified ? <><CheckCircle2 size={16} /> Mission verified</> : <><BadgeCheck size={16} /> Verify assignment</>}</button></Panel><Panel eyebrow="WEARABLE LINK" title="Health telemetry" action={<span className="telemetry"><span /> STREAMING</span>}><div className="health-ring"><div><strong>87</strong><span>HEALTH INDEX</span></div></div><div className="health-stats"><div><HeartPulse size={15} /><span>Heart rate</span><strong>72 <small>BPM</small></strong></div><div><Moon size={15} /><span>Sleep last 24h</span><strong>7.2 <small>HRS</small></strong></div><div><BatteryCharging size={15} /><span>Device battery</span><strong>84 <small>%</small></strong></div></div></Panel><Panel className="log-panel" eyebrow="TABLE B / PERSONAL ENTRY" title="Daily log" action={<span className="date-label">07 SEP 2026</span>}><div className="form-grid"><label>Sleep hours<input defaultValue="7.2" type="number" /></label><label>Active shift hours<input defaultValue="0" type="number" /></label><label>Meals completed<select defaultValue="2"><option>0</option><option>1</option><option>2</option><option>3</option></select></label><label>Health note<input placeholder="Optional note" /></label></div><button className={`button ${submitted ? 'success' : 'primary'}`} onClick={() => setSubmitted(true)}>{submitted ? <><Check size={15} /> Log submitted</> : <><Download size={15} /> Submit daily log</>}</button><small className="privacy-note"><LockKeyhole size={12} /> This entry updates your active duty record only.</small></Panel></div></>
}

function LeaveView() {
  const [decisions, setDecisions] = useState<Record<string, string>>({})
  const requests = [{ id: 'LV-104', name: 'J. Okafor', dates: '12—16 SEP', reason: 'Family event', score: 94, last: '18 JUN 2026', rejected: 0 }, { id: 'LV-107', name: 'S. Patel', dates: '19—24 SEP', reason: 'Recovery / rest', score: 88, last: '02 AUG 2026', rejected: 1 }, { id: 'LV-110', name: 'R. Chen', dates: '22—25 SEP', reason: 'Personal', score: 76, last: '14 MAY 2026', rejected: 2 }]
  return <><div className="page-title"><div><div className="eyebrow">LEAVE AUTHORITY / QUEUE</div><h1>Leave review</h1><p>Decision support for deservedness review. Readiness and operational data are withheld.</p></div><div className="quota"><span>MONTHLY QUOTA</span><strong>08 <small>/ 12</small></strong></div></div><div className="kpi-grid"><Kpi label="Pending applications" value="07" detail="3 high deservedness" tone="warn" icon={FileKey2} /><Kpi label="Quota remaining" value="04" detail="September cycle" icon={Layers3} /><Kpi label="Approved this cycle" value="08" detail="Last approved 05 SEP" tone="good" icon={CheckCircle2} /><Kpi label="Review SLA" value="18h" detail="Oldest request LV-104" icon={Clock3} /></div><Panel eyebrow="QUEUE / SORTED BY MODEL SIGNAL" title="Pending applications" action={<button className="filter-button"><SlidersHorizontal size={14} /> Sort: deservedness</button>}><div className="leave-table table-wrap"><table><thead><tr><th>Applicant</th><th>Requested dates</th><th>Model deservedness</th><th>Prior context</th><th>Decision</th></tr></thead><tbody>{requests.map((request) => <tr key={request.id}><td><div className="person"><div className="avatar small">{request.name.split(' ').map((x) => x[0]).join('')}</div><div><strong>{request.name}</strong><span>{request.id} · {request.reason}</span></div></div></td><td><strong>{request.dates}</strong><small className="subtext">7 days requested</small></td><td><Readiness value={request.score} /><span className="subtext">Priority signal</span></td><td><span className="subtext">Last leave {request.last}</span><span className="subtext">{request.rejected} prior rejection{request.rejected !== 1 ? 's' : ''}</span></td><td><div className="decision-actions">{decisions[request.id] ? <StatusPill tone={decisions[request.id] === 'Approved' ? 'good' : 'danger'}>{decisions[request.id]}</StatusPill> : <><button className="button success small-button" onClick={() => setDecisions({ ...decisions, [request.id]: 'Approved' })}><Check size={14} /> Approve</button><button className="button danger small-button" onClick={() => setDecisions({ ...decisions, [request.id]: 'Rejected' })}><X size={14} /> Reject</button></>}</div></td></tr>)}</tbody></table></div><div className="panel-foot"><span><BrainCircuit size={14} /> Model signal is advisory. Final decision remains with authority.</span><button className="text-button">View decision policy <ArrowRight size={13} /></button></div></Panel></>
}

function MedicalView() {
  const [resolved, setResolved] = useState<string[]>([])
  const cases = [{ id: 'MED-201', name: 'D. Morgan', level: 'RESTRICTED', issue: 'Lower back strain', detail: 'Recovery window · 18h remaining', tone: 'warn' }, { id: 'MED-204', name: 'T. Williams', level: 'REVIEW', issue: 'Knee impact assessment', detail: 'Awaiting clinical review', tone: 'danger' }, { id: 'MED-198', name: 'K. Rivera', level: 'MONITOR', issue: 'Sleep deficit trend', detail: 'Follow-up due 08 SEP', tone: 'good' }]
  return <><div className="page-title"><div><div className="eyebrow">MEDICAL TEAM / COMPANY 04</div><h1>Health coverage</h1><p>Scoped medical view for assigned company. Operational and leave data are withheld.</p></div><StatusPill tone="good">3 active cases</StatusPill></div><div className="kpi-grid"><Kpi label="Company health" value="92%" detail="+1.8 this week" tone="good" icon={HeartPulse} /><Kpi label="Urgent review" value="01" detail="T. Williams · MED-204" tone="danger" icon={Siren} /><Kpi label="Restricted duty" value="03" detail="Across 2 platoons" tone="warn" icon={ShieldCheck} /><Kpi label="Follow-ups due" value="05" detail="Next 72 hours" icon={Clock3} /></div><div className="content-grid medical-grid"><Panel eyebrow="CASEBOARD / COMPANY 04" title="Active health cases" action={<button className="filter-button"><Filter size={14} /> All statuses</button>}><div className="case-list">{cases.map((item) => <div className={`case-card ${item.tone}`} key={item.id}><div className="case-head"><div className="case-code">{item.id}</div><StatusPill tone={item.tone === 'danger' ? 'danger' : item.tone === 'warn' ? 'warn' : 'good'}>{item.level}</StatusPill></div><div className="case-body"><div className="avatar">{item.name.split(' ').map((x) => x[0]).join('')}</div><div><strong>{item.name}</strong><span>{item.issue}</span><small>{item.detail}</small></div></div><button className={`button full ${resolved.includes(item.id) ? 'success' : 'ghost'}`} onClick={() => setResolved((x) => [...x, item.id])}>{resolved.includes(item.id) ? <><Check size={15} /> Follow-up logged</> : <><Stethoscope size={15} /> Log treatment update</>}</button></div>)}</div></Panel><Panel eyebrow="CARE METRICS" title="Company pulse"><div className="pulse-chart"><div className="chart-line" /><div className="chart-labels"><span>01 SEP</span><span>03 SEP</span><span>05 SEP</span><span>07 SEP</span></div></div><div className="metric-list"><div><span>Sleep health</span><strong>88%</strong><div className="mini-bar"><i style={{ width: '88%' }} /></div></div><div><span>Injury recovery</span><strong>94%</strong><div className="mini-bar"><i style={{ width: '94%' }} /></div></div><div><span>Stress markers</span><strong>Low</strong><div className="mini-bar"><i className="amber" style={{ width: '32%' }} /></div></div></div><div className="privacy-note"><LockKeyhole size={13} /> Medical notes remain isolated from command and leave views.</div></Panel></div></>
}

function RedesignedSystemMap() {
  const stages = [
    { n: '01', title: 'Select mission formation', actor: 'Company Commander', tech: 'Next.js App Router · RBAC · Table A lookup', detail: 'Company-scoped soldiers are ranked by readiness, capability badges, and availability. The commander saves or tweaks a mission skeleton.', icon: Target },
    { n: '02', title: 'Check in & open duty record', actor: 'Chittha Writer / NCO', tech: 'Server Action · PostgreSQL transaction · audit event', detail: 'Departure and mission level update the Personnel State Index, then create an open duty row in the 30-Day Activity Ledger.', icon: ClipboardCheck },
    { n: '03', title: 'Verify & capture field signals', actor: 'Soldier + wearable', tech: 'Encrypted API · Webhooks · schema validation', detail: 'The soldier verifies the assignment. Sleep, shift, meals, health, and recovery inputs append to the same duty record from three trusted sources.', icon: Activity },
    { n: '04', title: 'Close duty & trigger inference', actor: 'Chittha Writer / NCO', tech: 'Event queue · idempotent workflow · observability', detail: 'Return time closes the record in both tables and emits one model-run event. No human role can browse raw activity logs.', icon: TimerReset },
    { n: '05', title: 'Score, age & route outcomes', actor: 'Autonomous ML Pipeline', tech: 'Python service · feature window · model registry', detail: 'The engine reads only the last 30 days, fits recovery curves, updates readiness and leave deservedness, and routes health risk to Medical.', icon: BrainCircuit },
  ]
  const stores = [
    { title: 'Personnel State Index', alias: 'Table A · fast human lookup', tech: 'PostgreSQL · LTREE · row-level security', access: 'Human interfaces read scoped projections', icon: Database, tone: 'blue' },
    { title: '30-Day Activity Ledger', alias: 'Table B · raw time-series log', tech: 'PostgreSQL partition · TTL purge · encrypted at rest', access: 'Model pipeline only · zero human browsing', icon: BookOpen, tone: 'amber' },
  ]
  return <>
    <div className="page-title map-title"><div><div className="eyebrow">SYSTEM ARCHITECTURE / LEAST PRIVILEGE</div><h1>Readiness decision system</h1><p>A staged operating model for secure handoffs, protected records, and explainable decision support.</p></div><StatusPill tone="good">Flow validated</StatusPill></div>
    <div className="map-legend"><span><i className="legend-dot blue" /> Human-scoped read</span><span><i className="legend-dot amber" /> Automated write / trigger</span><span><LockKeyhole size={13} /> Table B never exposed</span><span><ShieldCheck size={13} /> Every event audited</span></div>
    <section className="architecture-v2">
      <div className="map-section-heading"><div><span className="eyebrow">CONTROL PLANE</span><h2>From mission intent to model feedback</h2></div><span className="map-caption">ONE DIRECTIONAL FLOW · FIVE GATED HANDOFFS</span></div>
      <div className="stage-grid">{stages.map(({ n, title, actor, tech, detail, icon: Icon }, index) => <div className="flow-stage" key={n}><div className="stage-top"><span className="stage-number">{n}</span><Icon size={19} /><span className="stage-actor">{actor}</span></div><h3>{title}</h3><p>{detail}</p><code>{tech}</code>{index < stages.length - 1 && <ArrowRight className="stage-arrow" size={18} />}</div>)}</div>
      <div className="map-section-heading store-heading"><div><span className="eyebrow">DATA PLANE</span><h2>Two records, deliberately different access</h2></div><span className="map-caption">A = HUMAN PROJECTION · B = MODEL FEATURE WINDOW</span></div>
      <div className="store-grid">{stores.map(({ title, alias, tech, access, icon: Icon, tone }) => <div className={`store-card ${tone}`} key={title}><div className="store-icon"><Icon size={22} /></div><div><span className="eyebrow">{alias}</span><h3>{title}</h3><p>{access}</p><code>{tech}</code></div><div className="store-rule" /><div className="store-meta"><span>{tone === 'blue' ? 'READ PROJECTION' : 'RESTRICTED SOURCE'}</span><StatusPill tone={tone === 'blue' ? 'good' : 'warn'}>{tone === 'blue' ? 'Scoped' : 'Backend only'}</StatusPill></div></div>)}</div>
      <div className="security-strip"><LockKeyhole size={19} /><div><strong>LTREE branch isolation</strong><span>Every soldier carries a hidden organizational path. Commander, Commandant, Medical, and Leave views receive only the minimum projection for their branch and purpose.</span></div><div className="security-tags"><span>RBAC</span><span>RLS</span><span>AUDIT LOG</span></div></div>
      <div className="map-section-heading"><div><span className="eyebrow">OUTCOME ROUTING</span><h2>Role interfaces receive decisions, not raw evidence</h2></div></div>
      <div className="role-map-grid">{[['Commander','Formation skeleton + readiness'],['NCO / Roster','Check-in/out + duty level'],['Soldier','Private mission + self logs'],['Commandant','Leave queue + quota signals'],['Medical / Welfare','Risk alerts + care dispatch']].map(([role, outcome], index) => <div className="role-map-card" key={role}><span>{String(index + 1).padStart(2, '0')}</span><strong>{role}</strong><small>{outcome}</small><ArrowRight size={14} /></div>)}</div>
      <div className="nightly-row"><RefreshCw size={17} /><div><strong>Nightly maintenance window · 00:00 Z</strong><span>Recovery curve aging increases resting personnel readiness; activity records older than 30 days are purged before the next inference window.</span></div><code>CRON · WORKFLOW · TTL</code></div>
    </section>
  </>
}

function SystemMap() {
  return <><div className="page-title"><div><div className="eyebrow">SYSTEM ARCHITECTURE / LEAST PRIVILEGE</div><h1>Data flow map</h1><p>Human interfaces exchange authorized outcomes. No human role accesses raw Table B.</p></div><StatusPill tone="good">Audit trail active</StatusPill></div><div className="architecture"><div className="arch-row top"><div className="data-node table-a"><Database size={20} /><div><span>TABLE A</span><strong>Personnel state</strong><small>Soldier · availability · readiness · badges · leave deservedness</small></div><StatusPill tone="good">Human read</StatusPill></div><div className="flow-arrow"><ArrowRight size={18} /><span>predictions append</span></div><div className="data-node model-node"><BrainCircuit size={20} /><div><span>AUTOMATED MODEL</span><strong>Decision support engine</strong><small>30-day window · nightly refresh · no human interface</small></div><StatusPill tone="warn">Backend only</StatusPill></div></div><div className="vertical-flow"><ArrowDownUp size={18} /><span>Table B logs feed model</span></div><div className="arch-row"><div className="data-node table-b"><BookOpen size={20} /><div><span>TABLE B</span><strong>Roster logbook</strong><small>Duty records · sleep · shift · meals · wearable health</small></div><div className="no-human"><LockKeyhole size={12} /> NO DIRECT HUMAN ACCESS</div></div><div className="flow-notes"><div><span>RETENTION</span><strong>30 DAYS</strong><small>Midnight purge of expired logs</small></div><div><span>TRIGGER</span><strong>END TIME</strong><small>Checkout triggers model run</small></div></div></div><div className="role-flows"><div className="role-flow-header"><span>AUTHORIZED INTERFACE BOUNDARIES</span><span>scope isolation enforced</span></div><div className="role-flow-grid">{(['Commander', 'NCO / Roster', 'Soldier', 'Leave Authority', 'Medical Team'] as Role[]).map((item) => { const meta = roleMeta[item]; const Icon = meta.icon; return <div className="role-flow" key={item}><div className="role-icon"><Icon size={16} /></div><div><strong>{item}</strong><span>{item === 'Commander' ? 'Table A · company roster' : item === 'NCO / Roster' ? 'Duty write events' : item === 'Soldier' ? 'Own active log only' : item === 'Leave Authority' ? 'Leave queue only' : 'Health cases only'}</span></div><ArrowRight size={14} /></div> })}</div></div></div><div className="notice"><ShieldCheck size={16} /><div><strong>INFORMATION CONTROL</strong><span>Each interface receives a purpose-built projection. Raw roster history, medical notes, readiness, and leave data do not cross role boundaries.</span></div></div></>
}

export default function Page() {
  const [role, setRole] = useState<Role>('Commander'); const [menuOpen, setMenuOpen] = useState(false)
  const View = role === 'Commander' ? CommanderView : role === 'NCO / Roster' ? NcoView : role === 'Soldier' ? SoldierView : role === 'Leave Authority' ? LeaveView : role === 'Medical Team' ? MedicalView : RedesignedSystemMap
  return <main className="app-shell"><Header role={role} setRole={setRole} onMenu={() => setMenuOpen(true)} /><Sidebar role={role} setRole={setRole} open={menuOpen} close={() => setMenuOpen(false)} /><div className="main"><div className="role-switcher"><span>PROTOTYPE VIEW</span>{Object.keys(roleMeta).map((item) => <button key={item} className={role === item ? 'active' : ''} onClick={() => setRole(item as Role)}>{item === 'NCO / Roster' ? 'NCO' : item === 'Leave Authority' ? 'LEAVE' : item === 'Medical Team' ? 'MED' : item === 'System Map' ? 'MAP' : item.toUpperCase()}</button>)}</div><View /></div><div className="scanline" /></main>
}
