'use client';

import { useState, useEffect } from 'react';
import { Save, History, GripVertical } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';

interface FormulaComponent {
  id: string;
  name: string;
  icon: string;
  weight: number;
}

export default function ConfigPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [components, setComponents] = useState<FormulaComponent[]>([
    { id: '1', name: 'Quality Score', icon: '📊', weight: 40 },
    { id: '2', name: 'Output/Volume', icon: '📦', weight: 35 },
    { id: '3', name: 'Peer Feedback', icon: '💬', weight: 25 },
  ]);

  const [scale, setScale] = useState<5 | 10 | 100>(100);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly');

  useEffect(() => {
    async function fetchConfig() {
      if (!user?.companyId) return;

      try {
        const { config } = await api.getConfig(user.companyId);
        if (config.formula) {
          // Map backend formula to components
          const mappedComponents = config.formula.components.map((comp, idx) => ({
            id: String(idx + 1),
            name: comp.name,
            icon: '📊',
            weight: comp.weight || 0,
          }));
          if (mappedComponents.length > 0) {
            setComponents(mappedComponents);
          }
          if (config.formula.components[0]?.scale) {
            setScale(config.formula.components[0].scale);
          }
        }
        setDemoMode(false);
      } catch (error) {
        console.error('Failed to fetch config:', error);
        setDemoMode(true);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchConfig();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-accent-blue border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading configuration...</p>
        </div>
      </div>
    );
  }

  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
  const isValid = totalWeight === 100;
  const [saving, setSaving] = useState(false);

  const handleWeightChange = (id: string, newWeight: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, weight: newWeight } : c))
    );
  };

  const handleSave = async () => {
    if (!isValid || !user?.companyId) return;
    
    setSaving(true);
    try {
      const formulaConfig = {
        components: components.map(c => ({
          name: c.name,
          weight: c.weight,
          scale: scale
        })),
        frequency: frequency,
      };
      
      await api.updateFormula(user.companyId, formulaConfig, 'Updated formula weights');
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Failed to save config:', error);
      alert('Failed to save configuration. Using demo mode.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {demoMode && (
        <div className="glass-card p-4 border-l-4 border-warning">
          <p className="text-sm text-warning">
            ⚠️ Demo Mode: Backend unavailable. Showing mock data.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">⚙️ Scorecard Configuration</h1>
          <p className="text-text-secondary">Define formula components and weights</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || saving}
            className="px-4 py-2 rounded-lg bg-accent-blue hover:bg-accent-blue/90 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component Library */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Component Library</h3>
          <p className="text-sm text-text-muted mb-4">Drag components to formula canvas</p>
          <div className="space-y-2">
            {[
              { name: 'Quality Score', icon: '📊' },
              { name: 'Output/Volume', icon: '📦' },
              { name: 'Peer Feedback', icon: '💬' },
              { name: 'Attendance', icon: '📅' },
              { name: 'Goal Achievement', icon: '🎯' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] cursor-move transition-colors flex items-center gap-2"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-text-secondary">{item.name}</span>
              </div>
            ))}
            <button className="w-full p-3 rounded-lg border border-dashed border-white/[0.2] hover:bg-white/[0.04] text-accent-blue text-sm transition-colors">
              + Custom Component
            </button>
          </div>
        </div>

        {/* Formula Canvas */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Formula Canvas</h3>
          <p className="text-sm text-text-muted mb-6">Adjust weights to define scoring formula</p>

          <div className="space-y-4 mb-6">
            {components.map((component) => (
              <div key={component.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-3">
                  <GripVertical className="w-4 h-4 text-text-muted cursor-move" />
                  <span className="text-xl">{component.icon}</span>
                  <span className="text-sm font-medium text-text-primary flex-1">{component.name}</span>
                  <span className="text-lg font-mono font-bold text-accent-blue">{component.weight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={component.weight}
                  onChange={(e) => handleWeightChange(component.id, Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Total Weight Indicator */}
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Total Weight</span>
              <span className={`text-lg font-mono font-bold ${isValid ? 'text-success' : 'text-danger'}`}>
                {totalWeight}%
              </span>
            </div>
            <div className="relative h-3 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                  isValid ? 'bg-success' : 'bg-danger'
                }`}
                style={{ width: `${Math.min(totalWeight, 100)}%` }}
              />
            </div>
            {!isValid && (
              <p className="text-xs text-danger mt-2">Total must equal 100%</p>
            )}
            {isValid && (
              <p className="text-xs text-success mt-2 flex items-center gap-1">
                ✓ Formula is valid
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
            <div className="text-xs font-medium text-accent-blue mb-1">Formula Preview</div>
            <div className="text-sm text-text-primary font-mono">
              {components.map((c, idx) => (
                <span key={c.id}>
                  {c.name} ({c.weight}%)
                  {idx < components.length - 1 && ' + '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Scale</label>
            <div className="flex gap-2">
              {[5, 10, 100].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s as 5 | 10 | 100)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scale === s
                      ? 'bg-accent-blue/20 border border-accent-blue/30 text-accent-blue'
                      : 'border border-white/[0.1] text-text-secondary hover:bg-white/[0.04]'
                  }`}
                >
                  1–{s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'weekly' | 'monthly' | 'quarterly')}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary outline-none focus:border-accent-blue/40"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Overrides */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Team Overrides</h3>
        <p className="text-sm text-text-muted mb-4">Pending approval requests from team managers</p>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-medium text-text-primary">Engineering Team</div>
                <div className="text-xs text-text-muted mt-1">Quality: +5% · Output: -5%</div>
              </div>
              <span className="px-2 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium">
                Pending ⏳
              </span>
            </div>
            <div className="text-xs text-text-muted mb-3">
              Requested by: Mike R. · 2h ago
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-success hover:bg-success/90 text-white text-xs font-medium transition-colors">
                ✅ Approve
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-danger hover:bg-danger/90 text-white text-xs font-medium transition-colors">
                ❌ Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
