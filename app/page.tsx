'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownUp,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Crosshair,
  Database,
  HeartPulse,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  RefreshCw,
  ShieldCheck,
  Siren,
  Stethoscope,
  Target,
  TimerReset,
  UserCheck,
  UserRound,
  Users,
  X,
  Zap,
} from 'lucide-react'

type Role = 'Commander' | 'NCO / Roster' | 'Soldier' | 'Leave Authority' | 'Medical Team'
type Soldier = {
  id: string
  name: string
  initials: string
  rank: string
  badges: string[]
  readiness: number
  status: string
  reason: string
}
type TableARow = Soldier & { ors: number; lpi: number; startTime: string; endTime: string }
type TableBRow = { soldierId: string; name: string; startTime: string; endTime: string }

const soldierNames = [
  'Arjun Singh', 'Vikram Rao', 'Rohit Sharma', 'Amit Kumar', 'Suresh Yadav', 'Manoj Verma',
  'Rajesh Thakur', 'Karan Mehta', 'Nikhil Joshi', 'Deepak Chauhan', 'Anil Pawar', 'Prakash Das',
  'Harish Nair', 'Ravi Shekhawat', 'Aditya Menon', 'Vivek Reddy', 'Gaurav Bhat', 'Sanjay Patil',
  'Pankaj Saini', 'Mohit Kapoor', 'Ajay Rawat', 'Yash Mishra', 'Rakesh Tiwari', 'Sameer Khan',
  'Imran Ansari', 'Faizan Ali', 'Surya Pratap', 'Dinesh Gurung', 'Mukul Sethi', 'Naveen Pillai',
  'Abhishek Jha', 'Tarun Negi', 'Varun Malhotra', 'Siddharth Iyer', 'Akash Gupta', 'Bharat Solanki',
  'Devendra Singh', 'Shivam Dubey', 'Manish Arora', 'Ankit Dutta', 'Rajat Bansal', 'Lokesh Yadav',
  'Vishal Tomar', 'Raghav Bedi', 'Kartik Deshmukh', 'Omkar Shinde', 'Himanshu Gill', 'Aarav Bedi',
  'Chirag Sood', 'Mohan Bisht', 'Sandeep Bora',
]

const badgeCycle = [
  ['Team Leader', 'Rifleman'],
  ['Driver'],
  ['Rifleman'],
  ['LMG Support'],
  ['Section Commander'],
  ['Radio Operator'],
  ['Marksman'],
  ['Mission Leader'],
  ['Pointman / Scout'],
  ['Combat Medic'],
  ['Convoy Commander', 'Gunner'],
]

const soldiers: Soldier[] = soldierNames.map((name, index) => {
  const initials = name.split(' ').map(part => part[0]).join('')
  const badges = badgeCycle[index % badgeCycle.length]
  const readiness = Math.max(61, 98 - ((index * 7) % 35))
  return {
    id: `A-${String(index + 1).padStart(3, '0')}`,
    name,
    initials,
    rank: index % 5 === 0 ? 'SGT' : index % 3 === 0 ? 'CPL' : 'RFL',
    badges,
    readiness,
    status: index % 13 === 0 ? 'Unavailable' : 'Available',
    reason: index % 13 === 0 ? 'Recovery window · 18h' : 'Ready for assignment',
  }
})

const tableA: TableARow[] = soldiers.map((soldier, index) => ({
  ...soldier,
  ors: soldier.readiness,
  lpi: [94, 88, 76, 71, 62, 54][index] ?? 50,
  startTime: '—',
  endTime: '—',
}))

const getClockStamp = (day: number) => {
  const date = new Date(2026, 8, 7 + day)
  return `${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()} · 14:32 Z`
}

const roleMeta: Record<Role, { code: string; label: string; icon: typeof Target }> = {
  Commander: { code: 'CMD-01', label: 'Command deck', icon: Target },
  'NCO / Roster': { code: 'NCO-04', label: 'Roster operations', icon: ClipboardCheck },
  Soldier: { code: 'SOL-014', label: 'Soldier view', icon: UserRound },
  'Leave Authority': { code: 'LVA-02', label: 'Leave authority', icon: ShieldCheck },
  'Medical Team': { code: 'MED-07', label: 'Medical team', icon: Stethoscope },
}

function Panel({ children, className = '', title, eyebrow, action }: { children: React.ReactNode; className?: string; title?: string; eyebrow?: string; action?: React.ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      {(title || eyebrow || action) && (
        <div className="panel-head">
          <div>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {title && <h2>{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

function StatusPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`status-pill ${tone}`}><span className="status-dot" />{children}</span>
}

function Kpi({ label, value, detail, tone = '', icon: Icon }: { label: string; value: string; detail: string; tone?: string; icon: typeof Activity }) {
  return (
    <div className={`kpi ${tone}`}>
      <div className="kpi-icon"><Icon size={16} /></div>
      <div>
        <div className="kpi-label">{label}</div>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </div>
  )
}

function Readiness({ value }: { value: number }) {
  const tone = value >= 85 ? 'good' : value >= 75 ? 'warn' : 'danger'
  return (
    <div className="readiness">
      <div className="readiness-bar"><span className={tone} style={{ width: `${value}%` }} /></div>
      <strong className={tone}>{value}</strong>
    </div>
  )
}

function Person({ soldier }: { soldier: Soldier }) {
  return (
    <div className="person">
      <div className="avatar small">{soldier.initials}</div>
      <div>
        <strong>{soldier.name}</strong>
        <span>{soldier.rank} · {soldier.id}</span>
      </div>
    </div>
  )
}

const accountMeta: Record<Role, { name: string; post: string }> = {
  Commander: { name: 'CAPT. KIM', post: 'ASSISTANT COMMANDANT' },
  'NCO / Roster': { name: 'HAV. SINGH', post: 'NCO' },
  Soldier: { name: '—', post: 'SOLDIER' },
  'Leave Authority': { name: 'COL. SHARMA', post: 'COMMANDANT' },
  'Medical Team': { name: 'MEDICAL TEAM', post: '' },
}

function Header({ role, onMenu, day, setDay }: { role: Role; onMenu: () => void; day: number; setDay: (d: number) => void }) {
  const meta = roleMeta[role]
  const account = accountMeta[role]
  const date = new Date(2026, 8, 7 + day)
  const stamp = `${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} · 14:32 Z`
  return (
    <>
      <header className="topbar">
        <button className="mobile-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button>
        <div className="brand">
          <div className="brand-mark"><Crosshair size={19} /></div>
          <div><strong>KAVACH</strong><span>decision support network</span></div>
        </div>
        <div className="top-context">
          <span className="live"><span />LIVE NETWORK</span>
          <span className="divider" />
          <span>FOB NORTHSTAR</span>
          <span className="divider" />
          <span>{stamp}</span>
        </div>
        <div className="top-actions">
          <button className="icon-btn" aria-label="Refresh"><RefreshCw size={16} /></button>
          <div className="profile">
            <div className="avatar">AK</div>
            <div><strong>{account.name}</strong><span>{account.post || meta.code}</span></div>
          </div>
        </div>
      </header>
      <div className="timebar">
        <div><Clock3 size={15} /><strong>SIMULATED OPERATING TIME</strong><span>{stamp}</span></div>
        <button onClick={() => setDay(0)} className={day === 0 ? 'active' : ''}>NOW</button>
        <button onClick={() => setDay(Math.max(0, day - 1))}>− 1D</button>
        <input aria-label="Scroll simulated date" type="range" min="0" max="3" value={day} onChange={e => setDay(Number(e.target.value))} />
        <button onClick={() => setDay(Math.min(3, day + 1))}>+ 1D</button>
        <span className="time-limit">T+{day} DAYS</span>
      </div>
    </>
  )
}

function Sidebar({ role, setRole, open, close }: { role: Role; setRole: (r: Role) => void; open: boolean; close: () => void }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="side-label">AUTHORIZED VIEWS <button onClick={close}><X size={15} /></button></div>
      {Object.entries(roleMeta).map(([key, meta]) => {
        const Icon = meta.icon
        const item = key as Role
        return (
          <button key={key} className={`nav-item ${role === item ? 'active' : ''}`} onClick={() => { setRole(item); close() }}>
            <Icon size={17} />
            <span>{meta.label}</span>
          </button>
        )
      })}
      <div className="side-spacer" />
      <div className="secure-box">
        <LockKeyhole size={16} />
        <div><strong>SECURE CHANNEL</strong><span>All events audited</span></div>
      </div>
      <div className="build">FIELD//OS v0.9.0<br /><span>PROTOTYPE / SIMULATION</span></div>
    </aside>
  )
}

const missionSkeletons: Record<string, { label: string; code: string; roles: string[]; summary: string }> = {
  'CUSTOM // FREE HAND': {
    label: 'CUSTOM // FREE HAND (Unconstrained)',
    code: 'CUSTOM',
    roles: ['Rifleman', 'Rifleman', 'Rifleman', 'Rifleman'],
    summary: 'Unconstrained Manual Selection · Pick or Swap Any Available Personnel',
  },
  'AREA PATROL // AP-01': {
    label: 'AREA PATROL // AP-01',
    code: 'AP-01',
    roles: ['Section Commander', 'Radio Operator', 'Marksman', 'Rifleman', 'Rifleman', 'Rifleman'],
    summary: '1x Section Cmdr · 1x Radio Operator · 1x Marksman · 3x Riflemen',
  },
  'BORDER PATROL // BP-02': {
    label: 'BORDER PATROL // BP-02',
    code: 'BP-02',
    roles: ['Team Leader', 'Driver', 'Rifleman', 'Rifleman', 'Rifleman'],
    summary: '1x Team Leader · 1x Driver · 3x Riflemen',
  },
  'QUICK REACTION // QRF-03': {
    label: 'QUICK REACTION // QRF-03',
    code: 'QRF-03',
    roles: ['Team Leader', 'Driver', 'LMG Support', 'Rifleman'],
    summary: '1x Team Leader · 1x Driver · 1x LMG Support · 1x Rifleman',
  },
  'RECONNAISSANCE // REC-04': {
    label: 'RECONNAISSANCE // REC-04',
    code: 'REC-04',
    roles: ['Mission Leader', 'Pointman / Scout', 'Combat Medic', 'Rifleman', 'Rifleman'],
    summary: '1x Mission Leader · 1x Pointman/Scout · 1x Combat Medic · 2x Riflemen',
  },
  'CONVOY ESCORT // CE-05': {
    label: 'CONVOY ESCORT // CE-05',
    code: 'CE-05',
    roles: ['Convoy Commander', 'Driver', 'Driver', 'Gunner'],
    summary: '1x Convoy Cmdr · 2x Drivers · 1x Gunner',
  },
}

function CommanderView({ dispatch, dispatched, tableA }: { dispatch: (ids: string[]) => void; dispatched: string[]; tableA: TableARow[] }) {
  const [formationKey, setFormationKey] = useState('AREA PATROL // AP-01')
  const [overrides, setOverrides] = useState<Record<number, string>>({})
  const [swappingSlot, setSwappingSlot] = useState<{ slotIndex: number; role: string } | null>(null)
  const [customSlots, setCustomSlots] = useState<string[]>(['Rifleman', 'Rifleman', 'Rifleman', 'Rifleman'])

  const skeleton = missionSkeletons[formationKey] ?? missionSkeletons['AREA PATROL // AP-01']

  const handleFormationChange = (key: string) => {
    setFormationKey(key)
    setOverrides({})
    setSwappingSlot(null)
  }

  const rolesToFill = formationKey === 'CUSTOM // FREE HAND' ? customSlots : skeleton.roles

  // Dynamic sorting for Left Table A based on active Swap Mode
  const sortedTableA = useMemo(() => {
    const baseList = [...tableA]
    if (!swappingSlot) {
      return baseList.sort((a, b) => b.ors - a.ors)
    }

    const targetRole = swappingSlot.role

    return baseList.sort((a, b) => {
      // Available soldiers first
      if (a.status === 'Available' && b.status !== 'Available') return -1
      if (a.status !== 'Available' && b.status === 'Available') return 1

      // Matching target badge first
      const aHasRole = a.badges.includes(targetRole)
      const bHasRole = b.badges.includes(targetRole)
      if (aHasRole && !bHasRole) return -1
      if (!aHasRole && bHasRole) return 1

      // Sorted by Readiness / ORS descending
      return b.ors - a.ors
    })
  }, [swappingSlot])

  // Squad assignments calculation
  const squadAssignments = useMemo(() => {
    const picked: { slotIndex: number; soldierId: string; role: string }[] = []

    rolesToFill.forEach((roleNeeded, slotIdx) => {
      if (overrides[slotIdx]) {
        picked.push({ slotIndex: slotIdx, soldierId: overrides[slotIdx], role: roleNeeded })
        return
      }

      const available = sortedTableA.filter(s => s.status === 'Available' && !picked.some(p => p.soldierId === s.id))
      const match = available.find(s => s.badges.includes(roleNeeded)) ?? available.find(s => s.badges.includes('Rifleman')) ?? available[0]

      if (match) {
        picked.push({ slotIndex: slotIdx, soldierId: match.id, role: roleNeeded })
      }
    })

    return picked
  }, [rolesToFill, overrides, sortedTableA])

  const selectedIds = squadAssignments.map(a => a.soldierId)

  const handleSelectReplacement = (soldierId: string) => {
    if (!swappingSlot) return
    setOverrides(prev => ({ ...prev, [swappingSlot.slotIndex]: soldierId }))
    setSwappingSlot(null)
  }

  const toggleSwapSlot = (slotIndex: number, role: string) => {
    if (swappingSlot?.slotIndex === slotIndex) {
      setSwappingSlot(null)
    } else {
      setSwappingSlot({ slotIndex, role })
    }
  }

  const addCustomSlot = () => setCustomSlots(prev => [...prev, 'Rifleman'])
  const removeCustomSlot = (idx: number) => {
    setCustomSlots(prev => prev.filter((_, i) => i !== idx))
    setOverrides(prev => {
      const next = { ...prev }
      delete next[idx]
      return next
    })
  }

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">COMMANDER / COMPANY 04</div>
          <h1>Command deck</h1>
          <p>Table A access is company scoped. Select mission formation to evaluate unit readiness.</p>
        </div>
        <StatusPill tone={dispatched.length ? 'good' : 'neutral'}>
          {dispatched.length ? `${dispatched.length} dispatched` : 'Formation ready'}
        </StatusPill>
      </div>

      <div className="kpi-grid">
  <Kpi label="Company strength" value={`${tableA.filter(row => row.status === 'Available').length} / ${tableA.length}`} detail={`${tableA.filter(row => row.status !== 'Available').length} unavailable`} icon={Users} />
  <Kpi label="ORS ≥ 90" value={`${tableA.filter(row => row.ors >= 90).length}`} detail="Ready personnel" tone="good" icon={Activity} />
  <Kpi label="On duty" value={`${dispatched.length}`} detail={`${dispatched.length ? 'Current dispatch' : 'No active dispatch'}`} tone="warn" icon={Crosshair} />
        <Kpi label="Model signal" value="STABLE" detail="Last run 02:00 Z" icon={Zap} />
      </div>

      <div className="content-grid commander-grid">
        {/* LEFT PANEL: PERSONNEL READINESS */}
        <Panel
          className="roster-panel"
          eyebrow="TABLE A / COMPANY 04"
          title="Personnel readiness"
          action={
            swappingSlot ? (
              <button className="button danger small-button" onClick={() => setSwappingSlot(null)}>
                <X size={14} /> Cancel Swap Mode
              </button>
            ) : (
              <button className="filter-button"><ArrowDownUp size={14} /> Sort: ORS</button>
            )
          }
        >
          {swappingSlot && (
            <div style={{ padding: '8px 12px', marginBottom: '12px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', color: '#93c5fd', fontWeight: 600 }}>
                SELECT REPLACEMENT FOR: <span style={{ color: '#fff', textDecoration: 'underline' }}>{swappingSlot.role}</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#93c5fd' }}>
                Sorted by matching badge &amp; highest ORS
              </span>
            </div>
          )}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Personnel</th>
                  <th>Status</th>
                  <th>ORS</th>
                  <th>Badges</th>
                  <th>{swappingSlot ? 'Action' : 'Duty window'}</th>
                </tr>
              </thead>
              <tbody>
                {sortedTableA.map(s => {
                  const isCurrentlyInSquad = selectedIds.includes(s.id)
                  const hasMatchingBadge = swappingSlot ? s.badges.includes(swappingSlot.role) : false
                  const isAvailable = s.status === 'Available'

                  return (
                    <tr
                      key={s.id}
                      className={`${isCurrentlyInSquad ? 'selected-row' : ''} ${hasMatchingBadge && swappingSlot ? 'matching-badge-row' : ''}`}
                      style={{
                        backgroundColor: hasMatchingBadge && swappingSlot ? 'rgba(34, 197, 94, 0.08)' : undefined
                      }}
                    >
                      <td><Person soldier={s} /></td>
                      <td>
                        <StatusPill tone={s.status === 'Available' ? 'good' : 'danger'}>{s.status}</StatusPill>
                        <small>{s.reason}</small>
                      </td>
                      <td><Readiness value={s.ors} /></td>
                      <td>
                        <div className="badge-list">
                          {s.badges.map(b => (
                            <span
                              key={b}
                              style={swappingSlot && b === swappingSlot.role ? { border: '1px solid #22c55e', color: '#4ade80', fontWeight: 'bold' } : {}}
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        {swappingSlot ? (
                          <button
                            disabled={!isAvailable}
                            className={`button small-button ${hasMatchingBadge ? 'success' : 'primary'}`}
                            onClick={() => handleSelectReplacement(s.id)}
                            style={{ padding: '4px 10px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                          >
                            <UserCheck size={13} style={{ marginRight: '4px' }} />
                            Select
                          </button>
                        ) : (
                          `${s.startTime} — ${s.endTime}`
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* RIGHT PANEL: MISSION FORMATION & SQUAD PREVIEW */}
        <Panel className="formation-panel" eyebrow="FORMATION BUILDER" title="Mission formation" action={<button className="button primary small-button" onClick={() => dispatch(selectedIds)} disabled={!selectedIds.length} title="Send the matched squad to Roster Operations for verification"><Crosshair size={14} /> DISPATCH SQUAD</button>}>
          <div className="formation-select-container">
            <div className="eyebrow">FORMATION SKELETON</div>
            <div className="tactical-select-wrapper">
              <select
                value={formationKey}
                onChange={e => handleFormationChange(e.target.value)}
                className="tactical-select"
              >
                {Object.entries(missionSkeletons).map(([key, skel]) => (
                  <option key={key} value={key}>
                    {skel.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="select-arrow" />
            </div>

            {/* REQUIRED BADGES & COMPOSITION BREAKDOWN */}
            <div style={{ marginTop: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="eyebrow" style={{ fontSize: '0.68rem', marginBottom: '4px', color: '#8a99ad' }}>
                REQUIRED BADGES &amp; SQUAD COMPOSITION
              </div>
              <div style={{ fontSize: '0.82rem', color: '#d1d5db', fontWeight: 500 }}>
                {skeleton.summary}
              </div>
            </div>
          </div>

          <div className="formation-preview" style={{ marginTop: '16px' }}>
            <div className="eyebrow-sub" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span>{skeleton.code} / MATCHED SQUAD PREVIEW</span>
              {formationKey === 'CUSTOM // FREE HAND' && (
                <button className="button ghost small-button" onClick={addCustomSlot} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  + Add Slot
                </button>
              )}
            </div>

            {squadAssignments.map(({ slotIndex, soldierId, role }) => {
              const s = soldiers.find(x => x.id === soldierId)!
              const isSwapping = swappingSlot?.slotIndex === slotIndex

              return (
                <div
                  key={`${slotIndex}-${role}`}
                  style={{
                    marginBottom: '8px',
                    padding: '8px',
                    borderRadius: '4px',
                    background: isSwapping ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: isSwapping ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 140px', minWidth: 0 }}>
                      <Person soldier={s} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge-list" style={{ margin: 0 }}>
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px' }}>{role}</span>
                      </span>
                      <Readiness value={s.readiness} />

                      {/* SWAP BUTTON */}
                      <button
                        className={`button ${isSwapping ? 'primary' : 'ghost'} small-button`}
                        onClick={() => toggleSwapSlot(slotIndex, role)}
                        style={{ fontSize: '0.72rem', padding: '3px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}
                      >
                        <RefreshCw size={12} style={{ marginRight: '3px' }} />
                        {isSwapping ? 'Cancel' : 'Swap'}
                      </button>

                      {formationKey === 'CUSTOM // FREE HAND' && squadAssignments.length > 1 && (
                        <button
                          className="button danger small-button"
                          onClick={() => removeCustomSlot(slotIndex)}
                          style={{ padding: '3px 6px', flexShrink: 0 }}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="formation-action-footer">
            <button className="button full primary" onClick={() => dispatch(selectedIds)}>
              <Crosshair size={15} /> DISPATCH {skeleton.code} SQUAD
            </button>
            {dispatched.length > 0 && (
              <small className="dispatch-note">
                <Check size={13} /> Active squad transferred to Roster &amp; Soldier View.
              </small>
            )}
          </div>
        </Panel>
      </div>
    </>
  )
}

function NcoView({ dispatched, checkedIn, checkIn, tableB, markReturn, day }: { dispatched: string[]; checkedIn: string[]; checkIn: (id: string) => void; tableB: TableBRow[]; markReturn: (id: string) => void; day: number }) {
  const active = dispatched.map(id => soldiers.find(s => s.id === id)!).filter(Boolean)
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">NCO / ROSTER OPERATIONS</div>
          <h1>Duty control</h1>
          <p>Only commander-dispatched personnel appear here. Check-in creates a Table B row.</p>
        </div>
        <StatusPill tone="good">Clock synchronized · T+{day}d</StatusPill>
      </div>
      <div className="kpi-grid">
        <Kpi label="Dispatched squad" value={`${active.length}`} detail="Commander handoff" tone="warn" icon={Clock3} />
        <Kpi label="Checked in" value={`${checkedIn.length}`} detail="Table B rows created" icon={Database} />
        <Kpi label="Returns" value={`${tableB.filter(r => r.endTime !== '—').length}`} detail="End time uses clock" tone="good" icon={TimerReset} />
        <Kpi label="Phone notices" value={`${checkedIn.length}`} detail="Soldier logs requested" icon={Zap} />
      </div>
      <Panel eyebrow="COMMANDER HANDOFF / DISPATCHED ONLY" title="Check-in zone" action={<StatusPill tone="warn">LEVEL 02 · STANDARD</StatusPill>}>
        <div className="check-list">
          {active.length ? (
            active.map(s => {
              const row = tableB.find(r => r.soldierId === s.id)
              const isIn = checkedIn.includes(s.id)
              const isReturned = row?.endTime !== '—'
              return (
                <div className={`check-row ${isIn ? 'done' : ''}`} key={s.id}>
                  <Person soldier={s} />
                  <div className="check-meta">
                    <span>{isIn ? `START ${row?.startTime}` : 'Awaiting check-in'}</span>
                    {isIn && !isReturned && <small className="phone-notice"><Zap size={11} /> Phone notification sent</small>}
                  </div>
                  {!isIn ? (
                    <button className="button primary small-button" onClick={() => checkIn(s.id)}>Check in</button>
                  ) : !isReturned ? (
                    <button className="button ghost small-button" onClick={() => markReturn(s.id)}>Record return</button>
                  ) : (
                    <StatusPill tone="good">Returned {row?.endTime}</StatusPill>
                  )}
                </div>
              )
            })
          ) : (
            <div className="empty-state"><p>No dispatch received. Dispatch a squad from Command deck first.</p></div>
          )}
        </div>
      </Panel>
    </>
  )
}

function SoldierView({ dispatched, checkedIn, tableB, day }: { dispatched: string[]; checkedIn: string[]; tableB: TableBRow[]; day: number }) {
  const active = dispatched.map(id => soldiers.find(s => s.id === id)).filter((s): s is Soldier => Boolean(s))
  const [logs, setLogs] = useState<Record<string, boolean>>({})
  const [sleep, setSleep] = useState<Record<string, string>>({})
  const [meals, setMeals] = useState<Record<string, string>>({})

  if (!active.length) {
    return (
      <>
        <div className="page-title">
          <div>
            <div className="eyebrow">SOLDIER / PRIVATE VIEWS</div>
            <h1>Soldier view</h1>
            <p>Profiles are created only when the commander dispatches a soldier.</p>
          </div>
          <StatusPill>Awaiting dispatch</StatusPill>
        </div>
        <Panel className="empty-state" eyebrow="SECURE PERSONNEL VIEW" title="No active soldier profiles">
          <p>Undispatched personnel remain hidden here.</p>
        </Panel>
      </>
    )
  }

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">SOLDIER / PRIVATE VIEWS</div>
          <h1>Soldier view</h1>
          <p>{active.length} separate private interfaces created from the live dispatch.</p>
        </div>
        <StatusPill tone="good">Phone-linked</StatusPill>
      </div>
      <div className="soldier-stack">
        {active.map(s => {
          const row = tableB.find(r => r.soldierId === s.id)
          const isChecked = checkedIn.includes(s.id)
          return (
            <Panel className="soldier-card" key={s.id} eyebrow={`PRIVATE INTERFACE / ${s.id}`} title={s.name} action={<StatusPill tone={isChecked ? 'good' : 'neutral'}>{isChecked ? 'On duty' : 'Pending check-in'}</StatusPill>}>
              <div className="assignment-hero">
                <div className="mission-icon"><Crosshair size={25} /></div>
                <div>
                  <span>ASSIGNMENT</span>
                  <strong>SECTOR C / EAST · LEVEL 02</strong>
                  <small>{isChecked ? `Duty started ${row?.startTime}` : 'Waiting for roster confirmation'}</small>
                </div>
              </div>
              <div className="field-grid">
                <label>
                  Sleep hours
                  <input type="number" min="0" max="24" value={sleep[s.id] ?? ''} onChange={e => setSleep({ ...sleep, [s.id]: e.target.value })} placeholder="0–24" />
                </label>
                <label>
                  Meals while on duty
                  <input type="number" min="0" max="10" value={meals[s.id] ?? ''} onChange={e => setMeals({ ...meals, [s.id]: e.target.value })} placeholder="0–10" />
                </label>
              </div>
              <button className={`button full ${logs[s.id] ? 'success' : 'primary'}`} onClick={() => setLogs({ ...logs, [s.id]: true })}>
                {logs[s.id] ? <><Check size={15} /> Daily log saved to Table B</> : <>Submit daily log</>}
              </button>
            </Panel>
          )
        })}
      </div>
      <small className="dispatch-note">The unified clock is T+{day}d. NCO return stamps set each Table B end time from this clock.</small>
    </>
  )
}

function LeaveView({ tableA, onDecision }: { tableA: TableARow[]; onDecision: (soldierId: string, decision: 'Approved' | 'Rejected') => void }) {
  const [decisions, setDecisions] = useState<Record<string, string>>({})
  const requests = tableA.slice(0, 3).map((s, i) => ({ id: `LV-${104 + i * 3}`, name: s.name, dates: ['12—16 SEP', '19—24 SEP', '22—25 SEP'][i], score: s.lpi, soldier: s }))
  const pendingCount = requests.filter(r => !decisions[r.id]).length
  const approvedCount = Object.values(decisions).filter(value => value === 'Approved').length
  const quotaTotal = 12
  const quotaUsed = 8 + approvedCount
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">LEAVE AUTHORITY / QUEUE</div>
          <h1>Leave review</h1>
          <p>Only leave signals and roster status are visible. Operational readiness is withheld.</p>
        </div>
        <div className="quota">
          <span>MONTHLY QUOTA</span>
          <strong>{quotaUsed} <small>/ {quotaTotal}</small></strong>
        </div>
      </div>
      <div className="kpi-grid">
        <Kpi label="Pending applications" value={String(pendingCount)} detail={`${pendingCount} awaiting decision`} tone="warn" icon={Users} />
        <Kpi label="Quota remaining" value={String(Math.max(0, quotaTotal - quotaUsed))} detail="September cycle" icon={ShieldCheck} />
        <Kpi label="Approved this cycle" value={String(quotaUsed)} detail="Last approved 05 SEP" tone="good" icon={CheckCircle2} />
        <Kpi label="Screen last opened" value="NOW" detail="Live review session" icon={Clock3} />
      </div>
      <Panel eyebrow="TABLE A / LEAVE FIELDS ONLY" title="Pending applications">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Badges</th>
                <th>LPI</th>
                <th>Status</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td><Person soldier={r.soldier} /><small>{r.id} · {r.dates}</small></td>
                  <td><div className="badge-list">{r.soldier.badges.map(b => <span key={b}>{b}</span>)}</div></td>
                  <td><Readiness value={r.score} /></td>
                  <td>{r.soldier.status}</td>
                  <td>
                    {decisions[r.id] ? (
                      <StatusPill tone={decisions[r.id] === 'Approved' ? 'good' : 'danger'}>{decisions[r.id]}</StatusPill>
                    ) : (
                      <div className="decision-actions">
                        <button className="button success small-button" onClick={() => { setDecisions({ ...decisions, [r.id]: 'Approved' }); onDecision(r.soldier.id, 'Approved') }}>Approve</button>
                        <button className="button danger small-button" onClick={() => { setDecisions({ ...decisions, [r.id]: 'Rejected' }); onDecision(r.soldier.id, 'Rejected') }}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

function MedicalView() {
  const [resolved, setResolved] = useState<string[]>([])
  const cases = [
    { id: 'MED-201', name: 'D. Morgan', issue: 'Lower back strain', level: 'RESTRICTED' },
    { id: 'MED-204', name: 'T. Williams', issue: 'Knee impact assessment', level: 'REVIEW' },
    { id: 'MED-198', name: 'K. Rivera', issue: 'Sleep deficit trend', level: 'MONITOR' },
  ]
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">MEDICAL TEAM / COMPANY 04</div>
          <h1>Health coverage</h1>
          <p>Scoped medical view. Operational and leave data are withheld.</p>
        </div>
        <StatusPill tone="good">3 active cases</StatusPill>
      </div>
      <div className="kpi-grid">
        <Kpi label="Company health" value="92%" detail="+1.8 this week" tone="good" icon={HeartPulse} />
        <Kpi label="Urgent review" value="01" detail="Clinical attention" tone="danger" icon={Siren} />
        <Kpi label="Restricted duty" value="03" detail="Across 2 platoons" tone="warn" icon={ShieldCheck} />
        <Kpi label="Follow-ups due" value="05" detail="Next 72 hours" icon={Clock3} />
      </div>
      <Panel eyebrow="CASEBOARD / COMPANY 04" title="Active health cases">
        <div className="case-list">
          {cases.map(c => (
            <div className="case-card" key={c.id}>
              <div className="case-head">
                <span className="case-code">{c.id}</span>
                <StatusPill tone={c.level === 'REVIEW' ? 'danger' : 'warn'}>{c.level}</StatusPill>
              </div>
              <div className="case-body">
                <div className="avatar">{c.name.split(' ').map(x => x[0])}</div>
                <div>
                  <strong>{c.name}</strong>
                  <span>{c.issue}</span>
                  <small>Scoped clinical detail available</small>
                </div>
              </div>
              <button className={`button full ${resolved.includes(c.id) ? 'success' : 'ghost'}`} onClick={() => setResolved(x => [...x, c.id])}>
                {resolved.includes(c.id) ? <><Check size={15} /> Follow-up logged</> : <><Stethoscope size={15} /> Log treatment update</>}
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

export default function Page() {
  const [role, setRole] = useState<Role>('Commander')
  const [menuOpen, setMenuOpen] = useState(false)
  const [day, setDay] = useState(0)
  const [dispatched, setDispatched] = useState<string[]>([])
  const [checkedIn, setCheckedIn] = useState<string[]>([])
  const [tableB, setTableB] = useState<TableBRow[]>([])
  const [tableARows, setTableARows] = useState<TableARow[]>(tableA)

  const nowLabel = `07 SEP 2026 · 14:32 Z +${day}D`
  const handleLeaveDecision = (soldierId: string, decision: 'Approved' | 'Rejected') => {
    setTableARows(rows => rows.map(row => row.id === soldierId
      ? { ...row, status: decision === 'Approved' ? 'Unavailable' : row.status, reason: decision === 'Approved' ? 'Leave approved' : row.reason }
      : row))
  }
  const checkIn = (id: string) => {
    if (checkedIn.includes(id)) return
    const soldier = soldiers.find(s => s.id === id)!
    setCheckedIn(x => [...x, id])
    setTableB(rows => [...rows, { soldierId: id, name: soldier.name, startTime: nowLabel, endTime: '—' }])
  }
  const markReturn = (id: string) => setTableB(rows => rows.map(row => row.soldierId === id ? { ...row, endTime: nowLabel } : row))

  const View = role === 'Commander' ? CommanderView : role === 'NCO / Roster' ? NcoView : role === 'Soldier' ? SoldierView : role === 'Leave Authority' ? LeaveView : MedicalView

  return (
    <main className="app-shell">
      <Header role={role} onMenu={() => setMenuOpen(true)} day={day} setDay={setDay} />
      <Sidebar role={role} setRole={setRole} open={menuOpen} close={() => setMenuOpen(false)} />
      <div className="main">
        <div className="role-switcher">
          <span>PROTOTYPE VIEW</span>
          {Object.keys(roleMeta).map(item => (
            <button key={item} className={role === item ? 'active' : ''} onClick={() => setRole(item as Role)}>
              {item === 'NCO / Roster' ? 'NCO' : item === 'Leave Authority' ? 'LEAVE' : item === 'Medical Team' ? 'MED' : item.toUpperCase()}
            </button>
          ))}
        </div>
        <View {...(role === 'Commander' ? { dispatch: (ids: string[]) => setDispatched(ids), dispatched, tableA: tableARows } : role === 'NCO / Roster' ? { dispatched, checkedIn, checkIn, tableB, markReturn, day } : role === 'Soldier' ? { dispatched, checkedIn, tableB, day } : role === 'Leave Authority' ? { tableA: tableARows, onDecision: handleLeaveDecision } : {}) as never} />
      </div>
      <div className="scanline" />
    </main>
  )
}
