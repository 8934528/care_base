import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  Card,
  Button,
  Badge,
  PageHeader,
  LoadingSpinner,
  EmptyState
} from "../../components/common";

interface NoteItem {
  id: number;
  noteContent: string;
  noteType: string;
  authorName?: string;
  authorRole?: string;
  createdAt: string;
}

export default function DoctorNurseNotes() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState(user?.role === "Nurse" ? "Nursing" : "Doctor");

  const fetchNotes = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const res = await api.get(`/notes/${patientId}`);
      setNotes(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Unable to load clinical notes.", "danger");
    } finally {
      setLoading(false);
    }
  }, [patientId, showToast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      await api.post("/notes", {
        noteContent: newNote.trim(),
        patientId: Number(patientId),
        noteType: noteType
      });
      showToast("Clinical note added.", "success");
      setNewNote("");
      fetchNotes();
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      showToast(errObj.response?.data?.message || "Failed to add clinical note.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cb-page container-fluid px-0">
      <PageHeader
        title="Clinical & Nursing Notes"
        subtitle={`Patient #${patientId} • Multidisciplinary care documentation`}
        actions={
          <Button variant="outline" icon="bi-arrow-left" onClick={() => navigate("/patients")}>
            Back
          </Button>
        }
      />

      <div className="row g-3">
        {/* Note Composer */}
        <div className="col-12 col-lg-5">
          <Card title="Add Clinical Note">
            <form onSubmit={handleAddNote}>
              <div className="mb-3">
                <label className="form-label" htmlFor="noteType">Note Type</label>
                <select
                  id="noteType"
                  className="form-select cb-form-select"
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value)}
                >
                  <option value="Doctor">Doctor Progress Note</option>
                  <option value="Nursing">Nursing Assessment / Vitals</option>
                  <option value="Triage">Triage Note</option>
                  <option value="Administrative">Administrative Note</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="noteContent">Documentation Note *</label>
                <textarea
                  id="noteContent"
                  rows={5}
                  className="form-control cb-form-control"
                  placeholder="Document patient observations, nursing care delivered, or clinical directives..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit" loading={submitting} icon="bi-check2">
                  Save Note
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Notes Stream */}
        <div className="col-12 col-lg-7">
          <Card title="Patient Notes Log" subtitle={`${notes.length} notes recorded`}>
            {loading ? (
              <LoadingSpinner message="Loading notes..." />
            ) : notes.length === 0 ? (
              <EmptyState
                icon="bi-journal-text"
                title="No notes logged"
                message="No clinical or nursing notes have been added for this patient yet."
              />
            ) : (
              <div className="d-flex flex-column gap-3">
                {notes.map((n) => (
                  <div key={n.id} className="p-3 border rounded bg-white">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold">{n.authorName || "Clinical Staff"}</span>
                        {n.authorRole && (
                          <span className="small text-muted">({n.authorRole})</span>
                        )}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge status={n.noteType} />
                        <span className="small text-muted">
                          {new Date(n.createdAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="m-0 small text-dark" style={{ whiteSpace: "pre-line" }}>
                      {n.noteContent}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
