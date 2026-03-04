'use client';

import { useState, useEffect } from 'react';
import EmployeeTable from '@/components/employees/EmployeeTable';
import { generateMockEmployees } from '@/lib/mock-data';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';
import type { Employee } from '@/types';

export default function EmployeesPage() {
  const { user } = useAuthStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const { data } = await api.listEmployees({ page: 1, perPage: 100 });
        setEmployees(data);
        setDemoMode(false);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        // Fallback to mock data
        setEmployees(generateMockEmployees(50));
        setDemoMode(true);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchEmployees();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-accent-blue border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {demoMode && (
        <div className="glass-card p-4 border-l-4 border-warning">
          <p className="text-sm text-warning">
            ⚠️ Demo Mode: Backend unavailable. Showing mock data.
          </p>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Employees</h1>
        <p className="text-text-secondary">Manage and view employee scorecards</p>
      </div>

      <EmployeeTable employees={employees} onRowClick={setSelectedEmployee} />

      {/* Employee Detail Drawer - Placeholder */}
      {selectedEmployee && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end"
          onClick={() => setSelectedEmployee(null)}
        >
          <div
            className="w-full max-w-2xl h-full bg-bg-layer2 border-l border-white/[0.06] p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-2xl font-bold text-white">
                  {selectedEmployee.name?.[0]?.toUpperCase() || 'E'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">{selectedEmployee.name}</h2>
                  <p className="text-text-secondary">{selectedEmployee.role} · {selectedEmployee.department}</p>
                  <p className="text-sm text-text-muted mt-1">
                    Tenure: {Math.floor(selectedEmployee.tenureMonths / 12)}y {selectedEmployee.tenureMonths % 12}m
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Score Overview */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Score Overview</h3>
                <div className="text-5xl font-mono font-bold text-text-primary mb-2">
                  {selectedEmployee.latestScore || 'N/A'}
                </div>
                <div className="text-sm text-text-muted">Last updated: {new Date(selectedEmployee.updatedAt).toLocaleDateString()}</div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      // Navigate to forms page with employee pre-selected
                      window.location.href = `/forms?employeeId=${selectedEmployee.id}`;
                    }}
                    className="px-4 py-3 rounded-lg bg-accent-blue hover:bg-accent-blue/90 text-white text-sm font-medium transition-colors"
                  >
                    Rate Now
                  </button>
                  <button 
                    onClick={() => {
                      alert(`Schedule 1:1 with ${selectedEmployee.name}\n\nThis would open a calendar integration.`);
                    }}
                    className="px-4 py-3 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors"
                  >
                    Schedule 1:1
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm(`Flag ${selectedEmployee.name} as at-risk?`)) {
                        try {
                          // In real implementation, call API to create risk flag
                          alert('Risk flag created successfully!');
                        } catch (error) {
                          alert('Failed to create risk flag');
                        }
                      }
                    }}
                    className="px-4 py-3 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors"
                  >
                    Flag Risk
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const blob = await api.exportPdf(selectedEmployee.id);
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${selectedEmployee.name}-scorecard.pdf`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      } catch (error) {
                        alert('PDF export not available in demo mode');
                      }
                    }}
                    className="px-4 py-3 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
