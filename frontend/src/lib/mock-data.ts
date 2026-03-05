import type { Employee, DashboardData, FlightRiskFlag, AuditLog, PeerFeedback, Score } from '@/types';

const randomNames = [
  'Sarah Johnson', 'Marcus Reid', 'Priya Sharma', 'Alex Chen', 'Maria Lopez',
  'James Park', 'Emma Wilson', 'David Kim', 'Olivia Brown', 'Michael Davis',
  'Aisha Patel', 'Carlos Garcia', 'Jessica Lee', 'Ryan Thompson', 'Nicole Adams',
  'Daniel Martinez', 'Sophia Turner', 'Chris Anderson', 'Isabella Scott', 'Matthew White',
  'Zara Hussein', 'Tyler Robinson', 'Chloe Wright', 'Brandon Clark', 'Mia Rodriguez',
];

const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
const roles = [
  'Software Engineer', 'Senior Engineer', 'Product Manager', 'Designer', 'Marketing Lead',
  'Sales Rep', 'HR Specialist', 'Data Analyst', 'DevOps Engineer', 'Frontend Developer',
];

function randomId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function generateMockEmployees(count = 25): Employee[] {
  return Array.from({ length: count }, (_, i) => {
    const score = Math.floor(Math.random() * 60) + 40;
    const trend = +(Math.random() * 20 - 10).toFixed(1);
    const riskLevel = score < 60 ? 'high' : score < 75 ? 'medium' : 'low';
    return {
      id: randomId(),
      companyId: 'demo-company-id',
      role: roles[i % roles.length],
      department: departments[i % departments.length],
      tenureMonths: Math.floor(Math.random() * 60) + 3,
      missedCheckins: Math.floor(Math.random() * 5),
      notes: '',
      createdAt: new Date(Date.now() - Math.random() * 365 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
      name: randomNames[i % randomNames.length],
      latestScore: score,
      scoreTrend: trend,
      riskLevel: riskLevel as 'low' | 'medium' | 'high',
    };
  });
}

export function generateMockDashboard(): DashboardData {
  return {
    averageScore: 74.2,
    employeesAtRisk: 13,
    pendingRatings: 76,
    feedbackDue: 19,
    scoreTrends: Array.from({ length: 8 }, (_, i) => ({
      week: `W${i + 1}`,
      avg: 68 + Math.random() * 15,
      deptAvg: 65 + Math.random() * 18,
      atRisk: Math.floor(Math.random() * 8) + 8,
    })),
    scoreDistribution: [
      { name: 'Excellent (80-100)', value: 42, color: '#10b981' },
      { name: 'Good (60-79)', value: 35, color: '#3b82f6' },
      { name: 'Needs Attention (<60)', value: 23, color: '#ef4444' },
    ],
    recentActivity: generateMockAuditLogs(5),
    topPerformers: [
      { name: 'Sarah Johnson', score: 96, department: 'Engineering' },
      { name: 'Alex Chen', score: 93, department: 'Product' },
      { name: 'Emma Wilson', score: 91, department: 'Design' },
      { name: 'David Kim', score: 89, department: 'Engineering' },
      { name: 'Maria Lopez', score: 87, department: 'Marketing' },
    ],
  };
}

export function generateMockRiskFlags(): FlightRiskFlag[] {
  return [
    {
      id: 1,
      employeeId: randomId(),
      reason: 'Score dropped 18pts in 30 days (82 → 64). 3 missed check-ins this month. Negative keywords in notes: "burnout", "looking"',
      triggeredBy: 'system',
      resolvedStatus: false,
      severity: 'high',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      employee: { id: randomId(), companyId: 'demo', tenureMonths: 24, missedCheckins: 3, createdAt: '', updatedAt: '', name: 'Marcus Reid', role: 'Software Engineer', department: 'Engineering' },
    },
    {
      id: 2,
      employeeId: randomId(),
      reason: 'Low peer feedback score (2.1/5). Score trending downward for 3 consecutive months.',
      triggeredBy: 'system',
      resolvedStatus: false,
      severity: 'medium',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      employee: { id: randomId(), companyId: 'demo', tenureMonths: 18, missedCheckins: 1, createdAt: '', updatedAt: '', name: 'Priya Sharma', role: 'Product Manager', department: 'Product' },
    },
    {
      id: 3,
      employeeId: randomId(),
      reason: 'Missed 2 consecutive check-ins. New hire (<6 months tenure) with declining scores.',
      triggeredBy: 'system',
      resolvedStatus: false,
      severity: 'high',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      employee: { id: randomId(), companyId: 'demo', tenureMonths: 4, missedCheckins: 2, createdAt: '', updatedAt: '', name: 'Tyler Robinson', role: 'Frontend Developer', department: 'Engineering' },
    },
    {
      id: 4,
      employeeId: randomId(),
      reason: 'Score dropped 12pts. Keyword detected: "frustrated" in manager notes.',
      triggeredBy: 'system',
      resolvedStatus: false,
      severity: 'medium',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      employee: { id: randomId(), companyId: 'demo', tenureMonths: 36, missedCheckins: 0, createdAt: '', updatedAt: '', name: 'Jessica Lee', role: 'Designer', department: 'Design' },
    },
    {
      id: 5,
      employeeId: randomId(),
      reason: 'Peer feedback below threshold (2.3/5).',
      triggeredBy: 'system',
      resolvedStatus: false,
      severity: 'low',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      employee: { id: randomId(), companyId: 'demo', tenureMonths: 12, missedCheckins: 0, createdAt: '', updatedAt: '', name: 'Ryan Thompson', role: 'Sales Rep', department: 'Sales' },
    },
  ];
}

export function generateMockAuditLogs(count = 10): AuditLog[] {
  const events = [
    { tableName: 'scores', reason: 'Monthly score calculation' },
    { tableName: 'peer_feedback', reason: 'Peer feedback submitted' },
    { tableName: 'companies', reason: 'Formula configuration changed' },
    { tableName: 'flight_risk_flags', reason: 'Risk flag triggered' },
    { tableName: 'employees', reason: 'Employee profile updated' },
  ];
  return Array.from({ length: count }, (_, i) => {
    const event = events[i % events.length];
    return {
      id: i + 1,
      tableName: event.tableName,
      changedBy: randomNames[i % randomNames.length],
      employeeId: randomId(),
      oldValue: event.tableName === 'scores' ? { finalScore: 79 } : undefined,
      newValue: event.tableName === 'scores' ? { finalScore: 82 } : undefined,
      reason: event.reason,
      timestamp: new Date(Date.now() - i * 3600000 * Math.random() * 48).toISOString(),
      hash: 'sha256-' + randomId().slice(0, 16),
    };
  });
}

export function generateMockScores(months = 12): Score[] {
  return Array.from({ length: months }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (months - i - 1));
    return {
      id: i + 1,
      employeeId: randomId(),
      componentValues: { quality: 70 + Math.random() * 25, output: 65 + Math.random() * 30, feedback: 60 + Math.random() * 35 },
      finalScore: +(65 + Math.random() * 30).toFixed(1),
      formulaVersion: 1,
      month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      createdAt: d.toISOString(),
    };
  });
}

export function generatePayFairnessPoints(count = 50) {
  const depts = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales'];
  const deptColors: Record<string, string> = {
    Engineering: '#3b82f6',
    Product: '#8b5cf6',
    Design: '#06b6d4',
    Marketing: '#f59e0b',
    Sales: '#10b981',
  };
  return Array.from({ length: count }, (_, i) => {
    const dept = depts[i % depts.length];
    return {
      id: randomId(),
      name: randomNames[i % randomNames.length],
      role: roles[i % roles.length],
      department: dept,
      color: deptColors[dept],
      scorePercentile: Math.random() * 100,
      salaryPercentile: Math.random() * 100,
      tenure: Math.floor(Math.random() * 60) + 3,
    };
  });
}

export function generateMockFeedback(): PeerFeedback[] {
  return [
    { id: 1, fromEmployee: randomId(), toEmployee: randomId(), score: 4.2, timestamp: new Date().toISOString() },
    { id: 2, fromEmployee: randomId(), toEmployee: randomId(), score: 3.8, timestamp: new Date().toISOString() },
    { id: 3, fromEmployee: randomId(), toEmployee: randomId(), score: 4.5, timestamp: new Date().toISOString() },
  ];
}
