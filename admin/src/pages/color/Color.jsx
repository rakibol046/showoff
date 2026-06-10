import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:8080/admin-api/colors";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

const isValidHex = (hex) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);

const emptyForm = { name: "", value: "", hex: "#000000", status: true };

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => remove(t.id)} style={{
          background: t.type === "error" ? "#ef4444" : t.type === "warn" ? "#f59e0b" : "#10b981",
          color: "#fff", padding: "10px 16px", borderRadius: 8,
          fontSize: 13, fontWeight: 500, cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,.15)",
          animation: "slideIn .2s ease", maxWidth: 320,
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, push, remove };
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: "28px 32px",
        maxWidth: 380, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,.2)",
      }}>
        <p style={{ margin: "0 0 20px", fontSize: 15, color: "#374151", lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={btnStyle("ghost")}>Cancel</button>
          <button onClick={onConfirm} style={btnStyle("danger")}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── COLOR PICKER INPUT ───────────────────────────────────────────────────────
function ColorPickerField({ value, onChange }) {
  const [inputVal, setInputVal] = useState(value);

  useEffect(() => { setInputVal(value); }, [value]);

  const handleTextChange = (v) => {
    setInputVal(v);
    if (isValidHex(v)) onChange(v);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <input
          type="color"
          value={isValidHex(value) ? value : "#000000"}
          onChange={e => { onChange(e.target.value); setInputVal(e.target.value); }}
          style={{
            width: 44, height: 44, padding: 2, border: "1.5px solid #e5e7eb",
            borderRadius: 8, cursor: "pointer", background: "none",
          }}
        />
      </div>
      <input
        type="text"
        value={inputVal}
        onChange={e => handleTextChange(e.target.value)}
        placeholder="#000000"
        maxLength={7}
        style={{
          ...inputStyle, flex: 1,
          borderColor: isValidHex(inputVal) ? "#e5e7eb" : "#ef4444",
        }}
      />
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: isValidHex(value) ? value : "#e5e7eb",
        border: "1.5px solid #e5e7eb",
      }} />
    </div>
  );
}

// ─── DRAWER FORM ──────────────────────────────────────────────────────────────
function ColorDrawer({ mode, initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        value: initial.value || "",
        hex: initial.hex || "#000000",
        status: initial.status ?? true,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initial]);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.hex.trim()) e.hex = "Hex code is required";
    else if (!isValidHex(form.hex)) e.hex = "Invalid hex (e.g. #FF0000)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      name: form.name.trim(),
      value: form.value.trim(),
      hex: form.hex,
      status: form.status,
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
      display: "flex", justifyContent: "flex-end", zIndex: 500,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", width: "min(440px, 100vw)", height: "100%",
        overflowY: "auto", padding: "28px 28px 40px",
        boxShadow: "-8px 0 40px rgba(0,0,0,.12)",
        animation: "drawerIn .22s ease",
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {mode === "edit" ? "Edit Color" : "Add New Color"}
          </h2>
          <button onClick={onClose} style={{
            border: "none", background: "none", cursor: "pointer",
            fontSize: 22, color: "#9ca3af", lineHeight: 1,
          }}>×</button>
        </div>

        {/* Color preview banner */}
        <div style={{
          height: 80, borderRadius: 10, marginBottom: 24,
          background: isValidHex(form.hex) ? form.hex : "#e5e7eb",
          border: "1.5px solid #e5e7eb",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .2s",
        }}>
          <span style={{
            fontSize: 13, fontWeight: 600, padding: "4px 12px",
            borderRadius: 20, background: "rgba(255,255,255,.7)",
            color: "#374151", backdropFilter: "blur(4px)",
          }}>
            {form.name || "Color preview"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Field label="Color Name *" error={errors.name}>
            <input
              value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="e.g. Midnight Blue"
              style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : "#e5e7eb" }}
            />
          </Field>

          <Field label="Value / Code" error={errors.value}>
            <input
              value={form.value} onChange={e => set("value", e.target.value)}
              placeholder="e.g. midnight-blue (optional)"
              style={inputStyle}
            />
          </Field>

          <Field label="Hex Color *" error={errors.hex}>
            <ColorPickerField
              value={form.hex}
              onChange={v => set("hex", v)}
            />
            {errors.hex && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{errors.hex}</p>
            )}
          </Field>

          <Field label="Status">
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div
                onClick={() => set("status", !form.status)}
                style={{
                  width: 44, height: 24, borderRadius: 12,
                  background: form.status ? "#6366f1" : "#d1d5db",
                  position: "relative", transition: "background .2s", cursor: "pointer",
                }}
              >
                <span style={{
                  position: "absolute", top: 3, left: form.status ? 23 : 3,
                  width: 18, height: 18, borderRadius: "50%", background: "#fff",
                  transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)",
                }} />
              </div>
              <span style={{ fontSize: 14, color: "#374151" }}>
                {form.status ? "Active" : "Inactive"}
              </span>
            </label>
          </Field>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={onClose} style={{ ...btnStyle("ghost"), flex: 1 }}>Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{ ...btnStyle("primary"), flex: 2, opacity: saving ? .6 : 1 }}
            >
              {saving ? "Saving…" : mode === "edit" ? "Save Changes" : "Add Color"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, error }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {error && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{error}</p>}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb",
  borderRadius: 8, fontSize: 14, color: "#111827", outline: "none",
  boxSizing: "border-box", background: "#fafafa", transition: "border-color .15s",
};

function btnStyle(variant) {
  const base = {
    padding: "9px 18px", borderRadius: 8, border: "none",
    cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all .15s",
  };
  if (variant === "primary") return { ...base, background: "#6366f1", color: "#fff" };
  if (variant === "danger")  return { ...base, background: "#ef4444", color: "#fff" };
  if (variant === "ghost")   return { ...base, background: "#f3f4f6", color: "#374151" };
  if (variant === "icon")    return { ...base, background: "none", padding: "6px 10px", color: "#6b7280" };
  return base;
}

// ─── COLOR SWATCH ─────────────────────────────────────────────────────────────
function ColorSwatch({ hex, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 6,
      background: isValidHex(hex) ? hex : "#e5e7eb",
      border: "1.5px solid rgba(0,0,0,.08)",
      flexShrink: 0,
    }} title={hex} />
  );
}

function Badge({ active }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: active ? "#ecfdf5" : "#fef2f2",
      color: active ? "#059669" : "#dc2626",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ColorManagement() {
  const { toasts, push, remove } = useToast();
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [drawer, setDrawer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"

  const fetchColors = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const data = await apiFetch(`${API_BASE}${params}`);
      setColors(data.data);
    } catch (e) {
      push(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchColors(); }, [fetchColors]);

  const filtered = colors.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.value || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.hex || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = id => setSelected(p => {
    const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map(c => c._id)));

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (drawer.mode === "edit") {
        await apiFetch(`${API_BASE}/${drawer.data._id}`, { method: "PUT", body: JSON.stringify(payload) });
        push("Color updated successfully");
      } else {
        await apiFetch(API_BASE, { method: "POST", body: JSON.stringify(payload) });
        push("Color added successfully");
      }
      setDrawer(null);
      fetchColors();
    } catch (e) {
      push(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (color) => {
    try {
      await apiFetch(`${API_BASE}/${color._id}/toggle-status`, { method: "PATCH" });
      push(`Color marked as ${color.status ? "inactive" : "active"}`);
      fetchColors();
    } catch (e) { push(e.message, "error"); }
  };

  const handleDelete = (id) => {
    setConfirm({
      msg: "Delete this color? This action cannot be undone.",
      onConfirm: async () => {
        setConfirm(null);
        try {
          await apiFetch(`${API_BASE}/${id}`, { method: "DELETE" });
          push("Color deleted");
          setSelected(p => { const n = new Set(p); n.delete(id); return n; });
          fetchColors();
        } catch (e) { push(e.message, "error"); }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    setConfirm({
      msg: `Delete ${selected.size} selected color(s)? This cannot be undone.`,
      onConfirm: async () => {
        setConfirm(null);
        try {
          await apiFetch(API_BASE, { method: "DELETE", body: JSON.stringify({ ids: [...selected] }) });
          push(`${selected.size} color(s) deleted`);
          setSelected(new Set());
          fetchColors();
        } catch (e) { push(e.message, "error"); }
      },
    });
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#111827" }}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes drawerIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
        input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
        button:hover { filter: brightness(.93); }
        tr:hover td { background: #fafafa !important; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Color Management</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6b7280" }}>
            {colors.length} color{colors.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {/* View toggle */}
          <div style={{ display: "flex", border: "1.5px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
            {["table", "grid"].map(m => (
              <button key={m} onClick={() => setViewMode(m)} style={{
                padding: "7px 14px", border: "none", cursor: "pointer", fontSize: 13,
                fontWeight: 500, background: viewMode === m ? "#6366f1" : "#fff",
                color: viewMode === m ? "#fff" : "#6b7280", transition: "all .15s",
              }}>
                {m === "table" ? "☰ Table" : "⊞ Grid"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setDrawer({ mode: "add", data: null })}
            style={{ ...btnStyle("primary"), display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Color
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, value or hex…"
          style={{ ...inputStyle, width: 260 }}
        />
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ ...inputStyle, width: 140, cursor: "pointer" }}
        >
          <option value="all">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        {selected.size > 0 && (
          <button onClick={handleBulkDelete} style={btnStyle("danger")}>
            Delete {selected.size} selected
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ padding: 48, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>Loading colors…</div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: "#fff", borderRadius: 12, border: "1.5px solid #e5e7eb",
          padding: 56, textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎨</div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            {search ? "No colors match your search." : "No colors yet. Add your first one!"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* ── Grid View ── */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {filtered.map(color => (
            <div key={color._id} style={{
              background: "#fff", borderRadius: 12, border: "1.5px solid #e5e7eb",
              overflow: "hidden", transition: "box-shadow .15s",
            }}>
              {/* Swatch */}
              <div style={{
                height: 100, background: isValidHex(color.hex) ? color.hex : "#e5e7eb",
                position: "relative",
              }}>
                <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6 }}>
                  <button onClick={() => setDrawer({ mode: "edit", data: color })}
                    style={{ padding: "4px 8px", background: "rgba(255,255,255,.85)", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>✏️</button>
                  <button onClick={() => handleDelete(color._id)}
                    style={{ padding: "4px 8px", background: "rgba(255,255,255,.85)", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>🗑️</button>
                </div>
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{color.name}</span>
                  <div onClick={() => handleToggle(color)} style={{ cursor: "pointer" }}>
                    <Badge active={color.status} />
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>{color.hex}</p>
                {color.value && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{color.value}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Table View ── */
        <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1.5px solid #e5e7eb" }}>
                <Th style={{ width: 44 }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer" }} />
                </Th>
                <Th style={{ width: 56 }}>Color</Th>
                <Th>Name</Th>
                <Th>Value</Th>
                <Th>Hex</Th>
                <Th>Status</Th>
                <Th style={{ width: 100 }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((color, i) => (
                <tr key={color._id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  <Td>
                    <input type="checkbox" checked={selected.has(color._id)} onChange={() => toggleSelect(color._id)} style={{ cursor: "pointer" }} />
                  </Td>
                  <Td>
                    <ColorSwatch hex={color.hex} size={34} />
                  </Td>
                  <Td>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{color.name}</span>
                  </Td>
                  <Td><span style={{ color: "#6b7280", fontSize: 13 }}>{color.value || "—"}</span></Td>
                  <Td>
                    <code style={{
                      fontSize: 12, background: "#f3f4f6", padding: "3px 8px",
                      borderRadius: 4, color: "#374151",
                    }}>{color.hex}</code>
                  </Td>
                  <Td>
                    <div style={{ cursor: "pointer" }} onClick={() => handleToggle(color)}>
                      <Badge active={color.status} />
                    </div>
                  </Td>
                  <Td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => setDrawer({ mode: "edit", data: color })} title="Edit" style={{ ...btnStyle("icon"), fontSize: 16 }}>✏️</button>
                      <button onClick={() => handleDelete(color._id)} title="Delete" style={{ ...btnStyle("icon"), fontSize: 16 }}>🗑️</button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {drawer && (
        <ColorDrawer
          mode={drawer.mode}
          initial={drawer.data}
          onSave={handleSave}
          onClose={() => setDrawer(null)}
          saving={saving}
        />
      )}

      {confirm && (
        <ConfirmDialog
          message={confirm.msg}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <Toast toasts={toasts} remove={remove} />
    </div>
  );
}

function Th({ children, style }) {
  return (
    <th style={{
      padding: "12px 16px", textAlign: "left", fontSize: 12,
      fontWeight: 700, color: "#6b7280", textTransform: "uppercase",
      letterSpacing: ".05em", ...style,
    }}>{children}</th>
  );
}

function Td({ children }) {
  return (
    <td style={{ padding: "13px 16px", fontSize: 14, color: "#374151", verticalAlign: "middle" }}>
      {children}
    </td>
  );
}