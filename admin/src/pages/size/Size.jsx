import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Change this to your actual API base URL
const API_BASE = "http://localhost:8080/admin-api/sizes";

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

const emptyForm = {
  name: "",
  label: "",
  chest: "",
  waist: "",
  length: "",
  status: true,
};

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
          animation: "slideIn .2s ease",
          maxWidth: 320,
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

// ─── DRAWER FORM ──────────────────────────────────────────────────────────────
function SizeDrawer({ mode, initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        label: initial.label || "",
        chest: initial.measurements?.chest ?? "",
        waist: initial.measurements?.waist ?? "",
        length: initial.measurements?.length ?? "",
        status: initial.status ?? true,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const payload = {
      name: form.name.trim(),
      label: form.label.trim(),
      measurements: {
        chest: form.chest !== "" ? Number(form.chest) : undefined,
        waist: form.waist !== "" ? Number(form.waist) : undefined,
        length: form.length !== "" ? Number(form.length) : undefined,
      },
      status: form.status,
    };
    onSave(payload);
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
            {mode === "edit" ? "Edit Size" : "Add New Size"}
          </h2>
          <button onClick={onClose} style={{
            border: "none", background: "none", cursor: "pointer",
            fontSize: 22, color: "#9ca3af", lineHeight: 1,
          }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Field label="Size Name *">
            <input
              value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="e.g. XL" style={inputStyle}
            />
          </Field>

          <Field label="Label">
            <input
              value={form.label} onChange={e => set("label", e.target.value)}
              placeholder="e.g. Extra Large" style={inputStyle}
            />
          </Field>

          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 18 }}>
            <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".06em" }}>
              Measurements (cm)
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {["chest", "waist", "length"].map(k => (
                <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
                  <input
                    type="number" min="0" value={form[k]}
                    onChange={e => set(k, e.target.value)}
                    placeholder="—" style={inputStyle}
                  />
                </Field>
              ))}
            </div>
          </div>

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
              disabled={!form.name.trim() || saving}
              style={{ ...btnStyle("primary"), flex: 2, opacity: (!form.name.trim() || saving) ? .6 : 1 }}
            >
              {saving ? "Saving…" : mode === "edit" ? "Save Changes" : "Add Size"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb",
  borderRadius: 8, fontSize: 14, color: "#111827", outline: "none",
  boxSizing: "border-box", background: "#fafafa",
  transition: "border-color .15s",
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

// ─── BADGE ────────────────────────────────────────────────────────────────────
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
export default function SizeManagement() {
  const { toasts, push, remove } = useToast();
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [drawer, setDrawer] = useState(null); // null | { mode, data }
  const [confirm, setConfirm] = useState(null); // null | { msg, onConfirm }

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchSizes = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const data = await apiFetch(`${API_BASE}${params}`);
      setSizes(data.data);
    } catch (e) {
      push(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchSizes(); }, [fetchSizes]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = sizes.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.label || "").toLowerCase().includes(search.toLowerCase())
  );

  // ── Selection ──────────────────────────────────────────────────────────────
  const toggleSelect = id => setSelected(p => {
    const n = new Set(p);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map(s => s._id)));

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (drawer.mode === "edit") {
        await apiFetch(`${API_BASE}/${drawer.data._id}`, { method: "PUT", body: JSON.stringify(payload) });
        push("Size updated successfully");
      } else {
        await apiFetch(API_BASE, { method: "POST", body: JSON.stringify(payload) });
        push("Size added successfully");
      }
      setDrawer(null);
      fetchSizes();
    } catch (e) {
      push(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (size) => {
    try {
      await apiFetch(`${API_BASE}/${size._id}/toggle-status`, { method: "PATCH" });
      push(`Size marked as ${size.status ? "inactive" : "active"}`);
      fetchSizes();
    } catch (e) {
      push(e.message, "error");
    }
  };

  const handleDelete = (id) => {
    setConfirm({
      msg: "Delete this size? This action cannot be undone.",
      onConfirm: async () => {
        setConfirm(null);
        try {
          await apiFetch(`${API_BASE}/${id}`, { method: "DELETE" });
          push("Size deleted");
          setSelected(p => { const n = new Set(p); n.delete(id); return n; });
          fetchSizes();
        } catch (e) {
          push(e.message, "error");
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    setConfirm({
      msg: `Delete ${selected.size} selected size(s)? This cannot be undone.`,
      onConfirm: async () => {
        setConfirm(null);
        try {
          await apiFetch(API_BASE, { method: "DELETE", body: JSON.stringify({ ids: [...selected] }) });
          push(`${selected.size} size(s) deleted`);
          setSelected(new Set());
          fetchSizes();
        } catch (e) {
          push(e.message, "error");
        }
      },
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#111827" }}>
      <style>{`
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes drawerIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
        input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
        button:hover { filter: brightness(.93); }
        tr:hover td { background: #fafafa !important; }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Size Management</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6b7280" }}>
            {sizes.length} size{sizes.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => setDrawer({ mode: "add", data: null })}
          style={{ ...btnStyle("primary"), display: "flex", alignItems: "center", gap: 8 }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Size
        </button>
      </div>

      {/* ── Filters ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or label…"
          style={{ ...inputStyle, width: 240 }}
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

      {/* ── Table ──────────────────────────────────────────────────── */}
      <div style={{
        background: "#fff", borderRadius: 12,
        border: "1.5px solid #e5e7eb", overflow: "hidden",
      }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
            Loading sizes…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 56, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📏</div>
            <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
              {search ? "No sizes match your search." : "No sizes yet. Add your first one!"}
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1.5px solid #e5e7eb" }}>
                <Th style={{ width: 44 }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer" }} />
                </Th>
                <Th>Name</Th>
                <Th>Label</Th>
                <Th>Chest (cm)</Th>
                <Th>Waist (cm)</Th>
                <Th>Length (cm)</Th>
                <Th>Status</Th>
                <Th style={{ width: 100 }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((size, i) => (
                <tr key={size._id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  <Td>
                    <input
                      type="checkbox"
                      checked={selected.has(size._id)}
                      onChange={() => toggleSelect(size._id)}
                      style={{ cursor: "pointer" }}
                    />
                  </Td>
                  <Td>
                    <span style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{size.name}</span>
                  </Td>
                  <Td><span style={{ color: "#6b7280" }}>{size.label || "—"}</span></Td>
                  <Td>{size.measurements?.chest ?? "—"}</Td>
                  <Td>{size.measurements?.waist ?? "—"}</Td>
                  <Td>{size.measurements?.length ?? "—"}</Td>
                  <Td>
                    <div style={{ cursor: "pointer" }} onClick={() => handleToggle(size)}>
                      <Badge active={size.status} />
                    </div>
                  </Td>
                  <Td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        onClick={() => setDrawer({ mode: "edit", data: size })}
                        title="Edit"
                        style={{ ...btnStyle("icon"), fontSize: 16 }}
                      >✏️</button>
                      <button
                        onClick={() => handleDelete(size._id)}
                        title="Delete"
                        style={{ ...btnStyle("icon"), fontSize: 16 }}
                      >🗑️</button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Drawer ─────────────────────────────────────────────────── */}
      {drawer && (
        <SizeDrawer
          mode={drawer.mode}
          initial={drawer.data}
          onSave={handleSave}
          onClose={() => setDrawer(null)}
          saving={saving}
        />
      )}

      {/* ── Confirm ────────────────────────────────────────────────── */}
      {confirm && (
        <ConfirmDialog
          message={confirm.msg}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── Toasts ─────────────────────────────────────────────────── */}
      <Toast toasts={toasts} remove={remove} />
    </div>
  );
}

// ── Small table helpers ────────────────────────────────────────────────────────
function Th({ children, style }) {
  return (
    <th style={{
      padding: "12px 16px", textAlign: "left", fontSize: 12,
      fontWeight: 700, color: "#6b7280", textTransform: "uppercase",
      letterSpacing: ".05em", ...style,
    }}>
      {children}
    </th>
  );
}

function Td({ children }) {
  return (
    <td style={{ padding: "13px 16px", fontSize: 14, color: "#374151", verticalAlign: "middle" }}>
      {children}
    </td>
  );
}