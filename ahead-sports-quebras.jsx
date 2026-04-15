import { useState, useMemo, useRef } from "react";

const COLORS = {
  navy: "#1b203d",
  navyLight: "#252b4d",
  navyMid: "#2d345a",
  yellow: "#fbb909",
  yellowLight: "#fdd44b",
  red: "#e52625",
  redLight: "#ff4444",
  white: "#ffffff",
  gray100: "#f4f5f7",
  gray200: "#e2e4e9",
  gray300: "#c4c7d0",
  gray500: "#7a7f94",
  gray700: "#3d4260",
  green: "#22c55e",
};

const GESTAO_PASSWORD = "ahead2026";

const DEFAULT_SETORES = [
  "Produção", "Logística", "Expedição", "Estoque",
  "Corte", "Costura", "Acabamento", "Qualidade", "Embalagem",
];
const DEFAULT_CENTROS_CUSTO = [
  "CC-001 Operações", "CC-002 Produção", "CC-003 Logística",
  "CC-004 Qualidade", "CC-005 Expedição", "CC-006 Manutenção",
];
const DEFAULT_MOTIVOS = [
  "Defeito de fabricação", "Erro operacional", "Transporte inadequado",
  "Armazenamento incorreto", "Material fora do padrão", "Falha de equipamento",
  "Erro de corte", "Contaminação", "Prazo expirado", "Outro",
];

const INITIAL_DATA = [
  { id: 1, centroCusto: "CC-002 Produção", setor: "Costura", custo: 1250.00, motivo: "Defeito de fabricação", pedido: "PED-2026-0451", acoes: "Retrabalho realizado. Treinamento agendado para equipe.", data: "2026-04-01" },
  { id: 2, centroCusto: "CC-003 Logística", setor: "Expedição", custo: 3800.00, motivo: "Transporte inadequado", pedido: "PED-2026-0389", acoes: "Troca de transportadora em análise.", data: "2026-04-02" },
  { id: 3, centroCusto: "CC-002 Produção", setor: "Corte", custo: 920.00, motivo: "Erro de corte", pedido: "PED-2026-0502", acoes: "Calibração da máquina realizada.", data: "2026-04-03" },
  { id: 4, centroCusto: "CC-004 Qualidade", setor: "Qualidade", custo: 5200.00, motivo: "Material fora do padrão", pedido: "PED-2026-0478", acoes: "Devolvido ao fornecedor. Nota de crédito solicitada.", data: "2026-04-05" },
  { id: 5, centroCusto: "CC-001 Operações", setor: "Estoque", custo: 680.00, motivo: "Armazenamento incorreto", pedido: "PED-2026-0515", acoes: "Revisão de procedimentos de armazenagem.", data: "2026-04-07" },
  { id: 6, centroCusto: "CC-002 Produção", setor: "Acabamento", custo: 2100.00, motivo: "Erro operacional", pedido: "PED-2026-0533", acoes: "Operador notificado. Supervisão reforçada.", data: "2026-04-08" },
  { id: 7, centroCusto: "CC-005 Expedição", setor: "Embalagem", custo: 450.00, motivo: "Erro operacional", pedido: "PED-2026-0540", acoes: "Embalagem refeita. Checklist implementado.", data: "2026-04-09" },
  { id: 8, centroCusto: "CC-006 Manutenção", setor: "Produção", custo: 7500.00, motivo: "Falha de equipamento", pedido: "PED-2026-0498", acoes: "Manutenção corretiva concluída. Preventiva agendada.", data: "2026-04-10" },
  { id: 9, centroCusto: "CC-002 Produção", setor: "Costura", custo: 1800.00, motivo: "Defeito de fabricação", pedido: "PED-2026-0560", acoes: "Lote segregado. Investigação em andamento.", data: "2026-04-12" },
  { id: 10, centroCusto: "CC-003 Logística", setor: "Logística", custo: 3200.00, motivo: "Transporte inadequado", pedido: "PED-2026-0571", acoes: "Seguro acionado. Nova embalagem de proteção aprovada.", data: "2026-04-14" },
];

const ALERTA_CUSTO = 3000;

const Icons = {
  Lock: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
  Unlock: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>),
  Plus: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Search: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Edit: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Trash: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  Alert: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  Chart: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  List: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
  Download: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  X: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Trophy: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>),
  Settings: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>),
  Logout: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
  Eye: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  EyeOff: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>),
};

const formatCurrency = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --navy:${COLORS.navy}; --navy-light:${COLORS.navyLight}; --navy-mid:${COLORS.navyMid}; --yellow:${COLORS.yellow}; --yellow-light:${COLORS.yellowLight}; --red:${COLORS.red}; --red-light:${COLORS.redLight}; --white:${COLORS.white}; --gray-100:${COLORS.gray100}; --gray-200:${COLORS.gray200}; --gray-300:${COLORS.gray300}; --gray-500:${COLORS.gray500}; --gray-700:${COLORS.gray700}; --green:${COLORS.green}; }
  body { font-family:'DM Sans',sans-serif; background:var(--gray-100); }
  .app { min-height:100vh; display:flex; flex-direction:column; }

  /* LOGIN */
  .login-screen { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--navy); position:relative; overflow:hidden; }
  .login-screen::before { content:''; position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(ellipse at 30% 20%,rgba(251,185,9,0.08) 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,rgba(229,38,37,0.06) 0%,transparent 50%); animation:bgPulse 8s ease-in-out infinite alternate; }
  @keyframes bgPulse { from{transform:scale(1) rotate(0deg)} to{transform:scale(1.05) rotate(2deg)} }
  .login-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:48px 40px; width:420px; max-width:90vw; backdrop-filter:blur(20px); position:relative; z-index:1; box-shadow:0 30px 80px rgba(0,0,0,0.4); }
  .login-logo { font-family:'Bebas Neue',sans-serif; font-size:38px; letter-spacing:4px; color:var(--yellow); text-align:center; margin-bottom:4px; }
  .login-subtitle { text-align:center; color:var(--gray-300); font-size:13px; letter-spacing:1.5px; text-transform:uppercase; font-weight:500; margin-bottom:40px; }
  .login-divider { display:flex; align-items:center; gap:16px; margin:28px 0; color:var(--gray-500); font-size:11px; text-transform:uppercase; letter-spacing:1px; }
  .login-divider::before,.login-divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.1); }
  .login-option { width:100%; padding:14px 20px; border-radius:12px; font-size:14px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.2s; border:none; }
  .login-option.consulta { background:rgba(255,255,255,0.06); color:var(--gray-300); border:1px solid rgba(255,255,255,0.1); }
  .login-option.consulta:hover { background:rgba(255,255,255,0.1); color:white; }
  .login-password-group { position:relative; margin-bottom:14px; }
  .login-password-input { width:100%; padding:14px 48px 14px 16px; border-radius:12px; border:1.5px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.06); color:white; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; transition:all 0.2s; }
  .login-password-input::placeholder { color:var(--gray-500); }
  .login-password-input:focus { border-color:var(--yellow); box-shadow:0 0 0 3px rgba(251,185,9,0.15); }
  .login-password-toggle { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--gray-500); cursor:pointer; display:flex; padding:4px; transition:color 0.15s; }
  .login-password-toggle:hover { color:var(--gray-300); }
  .login-option.gestao { background:var(--yellow); color:var(--navy); }
  .login-option.gestao:hover { background:var(--yellow-light); transform:translateY(-1px); }
  .login-option.gestao:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
  .login-error { background:rgba(229,38,37,0.12); border:1px solid rgba(229,38,37,0.25); color:var(--red-light); padding:10px 14px; border-radius:10px; font-size:13px; text-align:center; margin-bottom:14px; display:flex; align-items:center; justify-content:center; gap:8px; animation:shake 0.4s ease; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
  .login-hint { text-align:center; margin-top:20px; font-size:11px; color:var(--gray-500); line-height:1.6; }

  /* HEADER */
  .header { background:var(--navy); padding:0 24px; height:60px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; box-shadow:0 2px 12px rgba(0,0,0,0.3); }
  .header-left { display:flex; align-items:center; gap:16px; }
  .logo-text { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:3px; color:var(--yellow); line-height:1; }
  .logo-sub { font-size:11px; color:var(--gray-300); letter-spacing:1px; text-transform:uppercase; font-weight:500; }
  .header-right { display:flex; align-items:center; gap:10px; }
  .role-badge { display:flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:600; border:none; cursor:default; }
  .role-badge.gestao { background:var(--yellow); color:var(--navy); }
  .role-badge.usuario { background:rgba(255,255,255,0.12); color:var(--gray-300); border:1px solid rgba(255,255,255,0.15); }
  .btn-logout { display:flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:600; background:rgba(229,38,37,0.15); color:var(--red-light); border:1px solid rgba(229,38,37,0.2); cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
  .btn-logout:hover { background:rgba(229,38,37,0.25); }

  /* TABS */
  .tabs { background:var(--navy-light); display:flex; padding:0 24px; gap:4px; border-bottom:1px solid rgba(255,255,255,0.06); }
  .tab { padding:12px 20px; font-size:13px; font-weight:600; color:var(--gray-500); cursor:pointer; border:none; background:none; border-bottom:2px solid transparent; display:flex; align-items:center; gap:8px; transition:all 0.2s; letter-spacing:0.3px; font-family:'DM Sans',sans-serif; }
  .tab:hover { color:var(--gray-300); }
  .tab.active { color:var(--yellow); border-bottom-color:var(--yellow); }

  .main { flex:1; padding:24px; max-width:1400px; margin:0 auto; width:100%; }

  /* STAT CARDS */
  .stat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; margin-bottom:24px; }
  .stat-card { background:white; border-radius:12px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.06); border-left:4px solid var(--navy); transition:transform 0.15s; }
  .stat-card:hover { transform:translateY(-2px); }
  .stat-card.alert { border-left-color:var(--red); }
  .stat-card.yellow-border { border-left-color:var(--yellow); }
  .stat-card.green-border { border-left-color:var(--green); }
  .stat-label { font-size:11px; color:var(--gray-500); text-transform:uppercase; letter-spacing:1px; font-weight:600; margin-bottom:6px; }
  .stat-value { font-family:'Bebas Neue',sans-serif; font-size:32px; color:var(--navy); letter-spacing:1px; }
  .stat-value.red { color:var(--red); }
  .stat-sub { font-size:12px; color:var(--gray-500); margin-top:4px; }

  /* FILTERS */
  .filters-bar { background:white; border-radius:12px; padding:16px 20px; margin-bottom:20px; display:flex; flex-wrap:wrap; gap:12px; align-items:center; box-shadow:0 1px 3px rgba(0,0,0,0.06); }
  .filter-group { display:flex; flex-direction:column; gap:4px; }
  .filter-label { font-size:10px; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-500); font-weight:600; }
  .filter-select,.filter-input { padding:8px 12px; border:1px solid var(--gray-200); border-radius:8px; font-size:13px; font-family:'DM Sans',sans-serif; background:var(--gray-100); color:var(--navy); outline:none; min-width:160px; transition:border-color 0.2s; }
  .filter-select:focus,.filter-input:focus { border-color:var(--yellow); }
  .search-wrapper { position:relative; flex:1; min-width:200px; }
  .search-wrapper svg { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--gray-500); }
  .search-input { width:100%; padding:8px 12px 8px 36px; border:1px solid var(--gray-200); border-radius:8px; font-size:13px; font-family:'DM Sans',sans-serif; background:var(--gray-100); color:var(--navy); outline:none; }
  .search-input:focus { border-color:var(--yellow); }

  /* TABLE */
  .table-container { background:white; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06); }
  .table-header-bar { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--gray-200); }
  .table-title { font-family:'Bebas Neue',sans-serif; font-size:20px; color:var(--navy); letter-spacing:1.5px; }
  table { width:100%; border-collapse:collapse; }
  th { text-align:left; padding:12px 16px; font-size:11px; text-transform:uppercase; letter-spacing:0.8px; color:var(--gray-500); font-weight:600; background:var(--gray-100); border-bottom:1px solid var(--gray-200); white-space:nowrap; }
  td { padding:12px 16px; font-size:13px; color:var(--gray-700); border-bottom:1px solid var(--gray-100); vertical-align:top; }
  tr:hover td { background:rgba(251,185,9,0.04); }
  .custo-cell { font-weight:700; font-variant-numeric:tabular-nums; }
  .custo-cell.alto { color:var(--red); }
  .motivo-tag { display:inline-block; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; background:rgba(27,32,61,0.08); color:var(--navy); white-space:nowrap; }
  .alert-icon { color:var(--red); display:inline-flex; margin-left:6px; vertical-align:middle; }
  .acoes-text { max-width:250px; line-height:1.5; }
  .action-btns { display:flex; gap:6px; }
  .action-btn { padding:6px 8px; border:none; border-radius:6px; cursor:pointer; display:flex; align-items:center; transition:all 0.15s; }
  .action-btn.edit { background:rgba(251,185,9,0.12); color:var(--yellow); }
  .action-btn.edit:hover { background:rgba(251,185,9,0.25); }
  .action-btn.delete { background:rgba(229,38,37,0.08); color:var(--red); }
  .action-btn.delete:hover { background:rgba(229,38,37,0.18); }

  /* BUTTONS */
  .btn-primary { background:var(--yellow); color:var(--navy); border:none; padding:9px 18px; border-radius:8px; font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.15s; white-space:nowrap; }
  .btn-primary:hover { background:var(--yellow-light); transform:translateY(-1px); }
  .btn-primary:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
  .btn-secondary { background:var(--gray-100); color:var(--gray-700); border:1px solid var(--gray-200); padding:9px 18px; border-radius:8px; font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.15s; white-space:nowrap; }
  .btn-secondary:hover { background:var(--gray-200); }

  /* MODAL */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:200; backdrop-filter:blur(4px); animation:fadeIn 0.15s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal { background:white; border-radius:16px; width:90%; max-width:560px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.2); animation:slideUp 0.2s ease; }
  @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
  .modal-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--gray-200); }
  .modal-title { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--navy); letter-spacing:1.5px; }
  .modal-close { background:none; border:none; cursor:pointer; color:var(--gray-500); padding:4px; border-radius:6px; display:flex; transition:all 0.15s; }
  .modal-close:hover { background:var(--gray-100); color:var(--navy); }
  .modal-body { padding:24px; }
  .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
  .form-row.full { grid-template-columns:1fr; }
  .form-group { display:flex; flex-direction:column; gap:6px; }
  .form-label { font-size:12px; font-weight:600; color:var(--gray-700); text-transform:uppercase; letter-spacing:0.5px; }
  .form-input,.form-select,.form-textarea { padding:10px 14px; border:1.5px solid var(--gray-200); border-radius:8px; font-size:14px; font-family:'DM Sans',sans-serif; color:var(--navy); outline:none; transition:border-color 0.2s; background:white; }
  .form-input:focus,.form-select:focus,.form-textarea:focus { border-color:var(--yellow); box-shadow:0 0 0 3px rgba(251,185,9,0.12); }
  .form-textarea { resize:vertical; min-height:80px; }
  .modal-footer { display:flex; justify-content:flex-end; gap:10px; padding:16px 24px; border-top:1px solid var(--gray-200); }

  /* CHARTS */
  .charts-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px; }
  .chart-card { background:white; border-radius:12px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.06); }
  .chart-title { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--navy); letter-spacing:1.5px; margin-bottom:16px; }
  .bar-chart { display:flex; flex-direction:column; gap:10px; }
  .bar-row { display:flex; align-items:center; gap:12px; }
  .bar-label { font-size:12px; color:var(--gray-700); width:120px; text-align:right; flex-shrink:0; font-weight:500; }
  .bar-track { flex:1; background:var(--gray-100); border-radius:6px; height:28px; position:relative; overflow:hidden; }
  .bar-fill { height:100%; border-radius:6px; transition:width 0.6s ease; display:flex; align-items:center; justify-content:flex-end; padding-right:10px; }
  .bar-value { font-size:11px; font-weight:700; color:white; white-space:nowrap; }
  .bar-value-outside { font-size:11px; font-weight:600; color:var(--gray-700); margin-left:8px; white-space:nowrap; }

  .ranking-list { display:flex; flex-direction:column; gap:8px; }
  .ranking-item { display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--gray-100); border-radius:10px; transition:all 0.15s; }
  .ranking-item:hover { background:var(--gray-200); }
  .ranking-pos { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; }
  .ranking-pos.gold { background:var(--yellow); color:var(--navy); }
  .ranking-pos.silver { background:var(--gray-300); color:var(--navy); }
  .ranking-pos.bronze { background:#cd7f32; color:white; }
  .ranking-pos.default { background:var(--gray-200); color:var(--gray-700); }
  .ranking-info { flex:1; }
  .ranking-name { font-size:14px; font-weight:600; color:var(--navy); }
  .ranking-detail { font-size:11px; color:var(--gray-500); }
  .ranking-value { font-size:15px; font-weight:700; color:var(--red); font-variant-numeric:tabular-nums; }

  .alert-banner { background:linear-gradient(90deg,rgba(229,38,37,0.08),rgba(229,38,37,0.02)); border:1px solid rgba(229,38,37,0.15); border-radius:10px; padding:14px 20px; display:flex; align-items:center; gap:10px; margin-bottom:20px; color:var(--red); font-size:13px; font-weight:500; }
  .alert-banner strong { font-weight:700; }

  .empty-state { text-align:center; padding:60px 20px; color:var(--gray-500); }
  .empty-state-icon { font-size:48px; margin-bottom:12px; opacity:0.3; }
  .empty-state-text { font-size:14px; }

  .confirm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:300; backdrop-filter:blur(4px); }
  .confirm-box { background:white; border-radius:16px; padding:28px; max-width:400px; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.2); }
  .confirm-title { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--navy); margin-bottom:8px; letter-spacing:1px; }
  .confirm-msg { font-size:14px; color:var(--gray-500); margin-bottom:24px; line-height:1.5; }
  .confirm-btns { display:flex; gap:10px; justify-content:center; }
  .btn-danger { background:var(--red); color:white; border:none; padding:9px 22px; border-radius:8px; font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.15s; }
  .btn-danger:hover { background:var(--red-light); }

  /* CONFIG */
  .config-section { background:white; border-radius:12px; padding:24px; margin-bottom:20px; box-shadow:0 1px 3px rgba(0,0,0,0.06); }
  .config-section-title { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--navy); letter-spacing:1.5px; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
  .tag-list { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px; }
  .tag-item { display:flex; align-items:center; gap:6px; background:var(--gray-100); border:1px solid var(--gray-200); padding:6px 12px; border-radius:8px; font-size:13px; color:var(--navy); font-weight:500; }
  .tag-remove { background:none; border:none; cursor:pointer; color:var(--gray-500); display:flex; padding:2px; border-radius:4px; transition:all 0.15s; }
  .tag-remove:hover { color:var(--red); background:rgba(229,38,37,0.08); }
  .tag-remove svg { width:14px; height:14px; }
  .add-tag-row { display:flex; gap:8px; }
  .add-tag-input { flex:1; padding:8px 14px; border:1.5px solid var(--gray-200); border-radius:8px; font-size:13px; font-family:'DM Sans',sans-serif; color:var(--navy); outline:none; transition:border-color 0.2s; }
  .add-tag-input:focus { border-color:var(--yellow); }
  .add-tag-btn { background:var(--navy); color:white; border:none; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; display:flex; align-items:center; gap:4px; transition:all 0.15s; white-space:nowrap; }
  .add-tag-btn:hover { background:var(--navy-mid); }
  .config-hint { font-size:11px; color:var(--gray-500); margin-top:8px; font-style:italic; }
  .password-success { background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.2); color:var(--green); padding:8px 14px; border-radius:8px; font-size:13px; margin-top:10px; }
  .password-change-row { display:flex; gap:8px; align-items:flex-end; }
  .password-change-row .form-group { flex:1; }

  @media (max-width:768px) {
    .charts-grid { grid-template-columns:1fr; }
    .form-row { grid-template-columns:1fr; }
    .filters-bar { flex-direction:column; }
    .filter-select,.filter-input,.search-wrapper { min-width:100%; }
    .stat-grid { grid-template-columns:1fr 1fr; }
    th,td { padding:10px 12px; font-size:12px; }
    .header { padding:0 16px; }
    .main { padding:16px; }
    .acoes-text { max-width:150px; }
    .login-card { padding:32px 24px; }
    .password-change-row { flex-direction:column; }
  }
`;

function StatCard({ label, value, sub, variant }) {
  const cls = variant === "alert" ? "stat-card alert" : variant === "yellow" ? "stat-card yellow-border" : variant === "green" ? "stat-card green-border" : "stat-card";
  return (<div className={cls}><div className="stat-label">{label}</div><div className={`stat-value ${variant === "alert" ? "red" : ""}`}>{value}</div>{sub && <div className="stat-sub">{sub}</div>}</div>);
}

function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header"><div className="modal-title">{title}</div><button className="modal-close" onClick={onClose}><Icons.X /></button></div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="confirm-box">
        <div className="confirm-title">{title}</div>
        <div className="confirm-msg">{message}</div>
        <div className="confirm-btns"><button className="btn-secondary" onClick={onCancel}>Cancelar</button><button className="btn-danger" onClick={onConfirm}>Excluir</button></div>
      </div>
    </div>
  );
}

function BarChart({ data, color }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div className="bar-row" key={i}>
            <div className="bar-label">{d.label}</div>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.max(pct, 8)}%`, background: color || COLORS.navy }}>{pct > 25 && <span className="bar-value">{formatCurrency(d.value)}</span>}</div></div>
            {pct <= 25 && <span className="bar-value-outside">{formatCurrency(d.value)}</span>}
          </div>
        );
      })}
    </div>
  );
}

function EditableTagList({ items, onAdd, onRemove, placeholder, label }) {
  const [newItem, setNewItem] = useState("");
  const handleAdd = () => { const t = newItem.trim(); if (t && !items.includes(t)) { onAdd(t); setNewItem(""); } };
  return (
    <div className="config-section">
      <div className="config-section-title">{label}</div>
      <div className="tag-list">
        {items.map((item) => (<div className="tag-item" key={item}>{item}<button className="tag-remove" onClick={() => onRemove(item)} title="Remover"><Icons.X /></button></div>))}
        {items.length === 0 && <span style={{ color: COLORS.gray500, fontSize: 13 }}>Nenhum item cadastrado.</span>}
      </div>
      <div className="add-tag-row">
        <input className="add-tag-input" placeholder={placeholder} value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
        <button className="add-tag-btn" onClick={handleAdd}><Icons.Plus /> Adicionar</button>
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function App() {
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState("registros");
  const [data, setData] = useState(INITIAL_DATA);
  const [nextId, setNextId] = useState(11);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [setores, setSetores] = useState(DEFAULT_SETORES);
  const [centrosCusto, setCentrosCusto] = useState(DEFAULT_CENTROS_CUSTO);
  const [motivos, setMotivos] = useState(DEFAULT_MOTIVOS);

  const [password, setPassword] = useState(GESTAO_PASSWORD);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [filterSetor, setFilterSetor] = useState("");
  const [filterCC, setFilterCC] = useState("");
  const [filterMotivo, setFilterMotivo] = useState("");
  const [searchPedido, setSearchPedido] = useState("");

  const emptyForm = { centroCusto: "", setor: "", custo: "", motivo: "", pedido: "", acoes: "", data: new Date().toISOString().split("T")[0] };
  const [form, setForm] = useState(emptyForm);

  const isGestao = role === "gestao";

  const filtered = useMemo(() => {
    return data.filter(item => {
      if (filterSetor && item.setor !== filterSetor) return false;
      if (filterCC && item.centroCusto !== filterCC) return false;
      if (filterMotivo && item.motivo !== filterMotivo) return false;
      if (searchPedido && !item.pedido.toLowerCase().includes(searchPedido.toLowerCase())) return false;
      return true;
    });
  }, [data, filterSetor, filterCC, filterMotivo, searchPedido]);

  const totalCusto = useMemo(() => data.reduce((s, d) => s + d.custo, 0), [data]);
  const alertCount = useMemo(() => data.filter(d => d.custo >= ALERTA_CUSTO).length, [data]);
  const custoBySetor = useMemo(() => { const m = {}; data.forEach(d => { m[d.setor] = (m[d.setor] || 0) + d.custo; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })); }, [data]);
  const custoByMotivo = useMemo(() => { const m = {}; data.forEach(d => { m[d.motivo] = (m[d.motivo] || 0) + d.custo; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })); }, [data]);
  const countBySetor = useMemo(() => { const m = {}; data.forEach(d => { m[d.setor] = (m[d.setor] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); }, [data]);

  const handleLoginGestao = () => {
    if (loginPassword === password) { setRole("gestao"); setLoginError(""); setLoginPassword(""); setShowPw(false); }
    else { setLoginError("Senha incorreta. Tente novamente."); setLoginPassword(""); }
  };
  const handleLogout = () => { setRole(null); setActiveTab("registros"); setLoginPassword(""); setLoginError(""); setShowPw(false); };
  const handleChangePassword = () => {
    if (newPassword.trim().length >= 4) { setPassword(newPassword.trim()); setNewPassword(""); setPasswordSuccess(true); setTimeout(() => setPasswordSuccess(false), 3000); }
  };

  const openNew = () => { setForm(emptyForm); setEditingItem(null); setShowModal(true); };
  const openEdit = (item) => { setForm({ ...item, custo: String(item.custo) }); setEditingItem(item.id); setShowModal(true); };
  const handleSave = () => {
    if (!form.centroCusto || !form.setor || !form.custo || !form.motivo || !form.pedido) return;
    const record = { ...form, custo: parseFloat(form.custo) || 0 };
    if (editingItem) { setData(prev => prev.map(d => d.id === editingItem ? { ...record, id: editingItem } : d)); }
    else { setData(prev => [...prev, { ...record, id: nextId }]); setNextId(n => n + 1); }
    setShowModal(false);
  };
  const handleDelete = (id) => { setData(prev => prev.filter(d => d.id !== id)); setConfirmDelete(null); };
  const exportCSV = () => {
    const headers = ["Data","Centro de Custo","Setor","Custo","Motivo","Pedido","Ações Tomadas"];
    const rows = filtered.map(d => [d.data, d.centroCusto, d.setor, d.custo.toFixed(2), d.motivo, d.pedido, `"${d.acoes}"`]);
    const csv = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `quebras_${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  // ============ LOGIN SCREEN ============
  if (role === null) {
    return (
      <div className="login-screen">
        <style>{css}</style>
        <div className="login-card">
          <div className="login-logo">AHEAD SPORTS</div>
          <div className="login-subtitle">Controle de Quebras</div>

          <button className="login-option consulta" onClick={() => { setRole("usuario"); setLoginError(""); setLoginPassword(""); setShowPw(false); }}>
            <Icons.Eye /> Entrar como Consulta
          </button>

          <div className="login-divider">ou acesse como gestão</div>

          <div>
            {loginError && (<div className="login-error"><Icons.Alert /> {loginError}</div>)}
            <div className="login-password-group">
              <input
                type={showPw ? "text" : "password"}
                className="login-password-input"
                placeholder="Senha de gestão"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); setLoginError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLoginGestao()}
              />
              <button className="login-password-toggle" onClick={() => setShowPw(s => !s)} tabIndex={-1}>
                {showPw ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
            <button className="login-option gestao" onClick={handleLoginGestao} disabled={!loginPassword}>
              <Icons.Unlock /> Entrar como Gestão
            </button>
          </div>

          <div className="login-hint">Senha padrão: <strong>ahead2026</strong><br/>(pode ser alterada nas configurações)</div>
        </div>
      </div>
    );
  }

  // ============ MAIN APP ============
  return (
    <div className="app">
      <style>{css}</style>

      <header className="header">
        <div className="header-left"><div><div className="logo-text">AHEAD SPORTS</div><div className="logo-sub">Controle de Quebras</div></div></div>
        <div className="header-right">
          <div className={`role-badge ${isGestao ? "gestao" : "usuario"}`}>{isGestao ? <Icons.Unlock /> : <Icons.Lock />}{isGestao ? "Gestão" : "Consulta"}</div>
          <button className="btn-logout" onClick={handleLogout}><Icons.Logout /> Sair</button>
        </div>
      </header>

      <nav className="tabs">
        <button className={`tab ${activeTab === "registros" ? "active" : ""}`} onClick={() => setActiveTab("registros")}><Icons.List /> Registros</button>
        <button className={`tab ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}><Icons.Chart /> Dashboard</button>
        {isGestao && <button className={`tab ${activeTab === "config" ? "active" : ""}`} onClick={() => setActiveTab("config")}><Icons.Settings /> Configurações</button>}
      </nav>

      <main className="main">
        {alertCount > 0 && (<div className="alert-banner"><Icons.Alert /><span><strong>{alertCount} registro{alertCount > 1 ? "s" : ""}</strong> com custo acima de {formatCurrency(ALERTA_CUSTO)} — atenção redobrada!</span></div>)}

        <div className="stat-grid">
          <StatCard label="Total de Registros" value={data.length} sub={`${filtered.length} filtrado${filtered.length !== 1 ? "s" : ""}`} />
          <StatCard label="Prejuízo Total" value={formatCurrency(totalCusto)} variant="alert" sub="Acumulado" />
          <StatCard label="Custo Médio" value={formatCurrency(data.length ? totalCusto / data.length : 0)} variant="yellow" sub="Por registro" />
          <StatCard label="Setores Afetados" value={custoBySetor.length} variant="green" sub={`Maior: ${custoBySetor[0]?.label || "-"}`} />
        </div>

        {/* REGISTROS */}
        {activeTab === "registros" && (
          <>
            <div className="filters-bar">
              <div className="filter-group"><span className="filter-label">Setor</span><select className="filter-select" value={filterSetor} onChange={e => setFilterSetor(e.target.value)}><option value="">Todos</option>{setores.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div className="filter-group"><span className="filter-label">Centro de Custo</span><select className="filter-select" value={filterCC} onChange={e => setFilterCC(e.target.value)}><option value="">Todos</option>{centrosCusto.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="filter-group"><span className="filter-label">Motivo</span><select className="filter-select" value={filterMotivo} onChange={e => setFilterMotivo(e.target.value)}><option value="">Todos</option>{motivos.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
              <div className="filter-group" style={{ flex: 1, minWidth: 200 }}><span className="filter-label">Buscar Pedido</span><div className="search-wrapper"><Icons.Search /><input className="search-input" placeholder="Ex: PED-2026-0451" value={searchPedido} onChange={e => setSearchPedido(e.target.value)} /></div></div>
            </div>

            <div className="table-container">
              <div className="table-header-bar">
                <div className="table-title">Registros de Quebra ({filtered.length})</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-secondary" onClick={exportCSV}><Icons.Download /> CSV</button>
                  {isGestao && <button className="btn-primary" onClick={openNew}><Icons.Plus /> Nova Quebra</button>}
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead><tr><th>Data</th><th>Pedido</th><th>Setor</th><th>Centro Custo</th><th>Custo</th><th>Motivo</th><th>Ações Tomadas</th>{isGestao && <th style={{ width: 80 }}></th>}</tr></thead>
                  <tbody>
                    {filtered.length === 0 && (<tr><td colSpan={isGestao ? 8 : 7}><div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-text">Nenhum registro encontrado com os filtros atuais.</div></div></td></tr>)}
                    {filtered.map(item => (
                      <tr key={item.id}>
                        <td style={{ whiteSpace: "nowrap" }}>{item.data}</td>
                        <td style={{ fontWeight: 600, color: COLORS.navy, whiteSpace: "nowrap" }}>{item.pedido}</td>
                        <td>{item.setor}</td>
                        <td style={{ fontSize: 12 }}>{item.centroCusto}</td>
                        <td><span className={`custo-cell ${item.custo >= ALERTA_CUSTO ? "alto" : ""}`}>{formatCurrency(item.custo)}</span>{item.custo >= ALERTA_CUSTO && <span className="alert-icon"><Icons.Alert /></span>}</td>
                        <td><span className="motivo-tag">{item.motivo}</span></td>
                        <td><div className="acoes-text">{item.acoes}</div></td>
                        {isGestao && (<td><div className="action-btns"><button className="action-btn edit" onClick={() => openEdit(item)} title="Editar"><Icons.Edit /></button><button className="action-btn delete" onClick={() => setConfirmDelete(item.id)} title="Excluir"><Icons.Trash /></button></div></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="charts-grid">
            <div className="chart-card"><div className="chart-title">Custo por Setor</div><BarChart data={custoBySetor} color={COLORS.navy} /></div>
            <div className="chart-card"><div className="chart-title">Custo por Motivo</div><BarChart data={custoByMotivo} color={COLORS.red} /></div>
            <div className="chart-card">
              <div className="chart-title" style={{ display: "flex", alignItems: "center", gap: 8 }}><Icons.Trophy /> Ranking de Setores — Mais Quebras</div>
              <div className="ranking-list">
                {countBySetor.map(([setor, count], i) => {
                  const totalSetor = custoBySetor.find(s => s.label === setor)?.value || 0;
                  return (<div className="ranking-item" key={setor}><div className={`ranking-pos ${i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "default"}`}>{i + 1}</div><div className="ranking-info"><div className="ranking-name">{setor}</div><div className="ranking-detail">{count} ocorrência{count > 1 ? "s" : ""}</div></div><div className="ranking-value">{formatCurrency(totalSetor)}</div></div>);
                })}
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-title" style={{ color: COLORS.red, display: "flex", alignItems: "center", gap: 8 }}><Icons.Alert /> Alertas de Alto Custo (≥ {formatCurrency(ALERTA_CUSTO)})</div>
              <div className="ranking-list">
                {data.filter(d => d.custo >= ALERTA_CUSTO).sort((a, b) => b.custo - a.custo).map((item) => (
                  <div className="ranking-item" key={item.id}><div className="ranking-pos" style={{ background: "rgba(229,38,37,0.12)", color: COLORS.red, fontSize: 11, fontWeight: 700 }}>!</div><div className="ranking-info"><div className="ranking-name">{item.pedido}</div><div className="ranking-detail">{item.setor} · {item.motivo}</div></div><div className="ranking-value">{formatCurrency(item.custo)}</div></div>
                ))}
                {data.filter(d => d.custo >= ALERTA_CUSTO).length === 0 && (<div style={{ textAlign: "center", color: COLORS.gray500, padding: 20, fontSize: 13 }}>Nenhum registro acima do limite.</div>)}
              </div>
            </div>
          </div>
        )}

        {/* CONFIGURAÇÕES */}
        {activeTab === "config" && isGestao && (
          <>
            <EditableTagList label="Setores" items={setores} placeholder="Novo setor..." onAdd={(i) => setSetores(p => [...p, i])} onRemove={(i) => setSetores(p => p.filter(s => s !== i))} />
            <EditableTagList label="Centros de Custo" items={centrosCusto} placeholder="Ex: CC-007 Marketing" onAdd={(i) => setCentrosCusto(p => [...p, i])} onRemove={(i) => setCentrosCusto(p => p.filter(c => c !== i))} />
            <EditableTagList label="Motivos de Quebra" items={motivos} placeholder="Novo motivo..." onAdd={(i) => setMotivos(p => [...p, i])} onRemove={(i) => setMotivos(p => p.filter(m => m !== i))} />

            <div className="config-section">
              <div className="config-section-title"><Icons.Lock /> Alterar Senha de Gestão</div>
              <div className="password-change-row">
                <div className="form-group">
                  <label className="form-label">Nova Senha (mín. 4 caracteres)</label>
                  <input type="password" className="form-input" placeholder="Digite a nova senha..." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleChangePassword()} />
                </div>
                <button className="btn-primary" style={{ height: 42 }} onClick={handleChangePassword} disabled={newPassword.trim().length < 4}>Alterar Senha</button>
              </div>
              {passwordSuccess && <div className="password-success">Senha alterada com sucesso!</div>}
              <div className="config-hint">A senha protege o acesso ao modo Gestão. Guarde-a em local seguro.</div>
            </div>
          </>
        )}
      </main>

      {/* MODAL FORM */}
      {showModal && (
        <Modal title={editingItem ? "Editar Registro" : "Novo Registro de Quebra"} onClose={() => setShowModal(false)} footer={<><button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button><button className="btn-primary" onClick={handleSave}>{editingItem ? "Salvar Alterações" : "Cadastrar Quebra"}</button></>}>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Data</label><input type="date" className="form-input" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Pedido Vinculado *</label><input className="form-input" placeholder="PED-2026-XXXX" value={form.pedido} onChange={e => setForm(f => ({ ...f, pedido: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Setor *</label><select className="form-select" value={form.setor} onChange={e => setForm(f => ({ ...f, setor: e.target.value }))}><option value="">Selecione...</option>{setores.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Centro de Custo *</label><select className="form-select" value={form.centroCusto} onChange={e => setForm(f => ({ ...f, centroCusto: e.target.value }))}><option value="">Selecione...</option>{centrosCusto.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Custo (R$) *</label><input type="number" step="0.01" className="form-input" placeholder="0.00" value={form.custo} onChange={e => setForm(f => ({ ...f, custo: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Motivo *</label><select className="form-select" value={form.motivo} onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))}><option value="">Selecione...</option>{motivos.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          </div>
          <div className="form-row full">
            <div className="form-group"><label className="form-label">Ações Tomadas</label><textarea className="form-textarea" placeholder="Descreva as ações corretivas ou preventivas..." value={form.acoes} onChange={e => setForm(f => ({ ...f, acoes: e.target.value }))} /></div>
          </div>
          {form.custo && parseFloat(form.custo) >= ALERTA_CUSTO && (<div className="alert-banner" style={{ marginTop: 4, marginBottom: 0 }}><Icons.Alert /><span>Valor acima do limite de alerta ({formatCurrency(ALERTA_CUSTO)})</span></div>)}
        </Modal>
      )}

      {confirmDelete !== null && (
        <ConfirmDialog title="Confirmar Exclusão" message="Tem certeza que deseja excluir este registro de quebra? Essa ação não pode ser desfeita." onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />
      )}
    </div>
  );
}
