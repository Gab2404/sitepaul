import { useState } from "react";
import { T, F } from "../../lib/designSystem";
import { QUESTIONS, DEMO_PRESET } from "../../lib/questions";
import NormeBadge from "../ui/NormeBadge";

/**
 * ACTE 2 — Formulaire de diagnostic (10 questions).
 * 
 * À la validation de la dernière question, appelle l'API /api/calculate
 * en POST avec les réponses, puis transmet le profil calculé au parent.
 * 
 * Props:
 *   onComplete(profil) — appelé quand l'API répond avec succès
 */
export default function ActeDiagnostic({ onComplete, onFetchStart }) {
  const [step, setStep] = useState(0);
  const [reps, setReps] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = Math.round((step / total) * 100);

  const sections = [...new Set(QUESTIONS.map((q) => q.section))];
  const sectionColors = { Profil: T.moss, Environnement: T.fern, Social: T.amber, Gouvernance: T.slate };

  const setVal = (id, v) => setReps((r) => ({ ...r, [id]: v }));
  const toggleMulti = (id, v) => {
    setReps((r) => {
      const cur = r[id] || [];
      return { ...r, [id]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });
  };

  const canNext = () => {
    if (q.type === "text")  return (reps[q.id] || "").trim().length > 0;
    if (q.type === "choix") return !!reps[q.id];
    if (q.type === "multi") return (reps[q.id] || []).length > 0;
    return false;
  };

  // Appel API POST /api/calculate
  const submitToAPI = async (reponses) => {
    if (onFetchStart) onFetchStart(); // bascule le parent en "loading"
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reponses),
      });
      if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
      const json = await res.json();
      onComplete(json.data); // transmet le profil RSE calculé
    } catch (err) {
      setError("Impossible de contacter le serveur. Relancez npm run dev.");
      setLoading(false);
    }
  };

  const next = () => {
    if (!canNext()) return;
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      submitToAPI(reps);
    }
  };

  const handleDemo = () => {
    setReps(DEMO_PRESET);
    submitToAPI(DEMO_PRESET);
  };

  if (loading) return null; // Le parent affiche LoadingScreen pendant ce temps

  return (
    <div style={{ minHeight: "100vh", background: T.fog, display: "flex", flexDirection: "column" }}>

      {/* Barre de progression */}
      <div className="no-print" style={{
        background: T.white, borderBottom: `1px solid ${T.straw}`,
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 20,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 700, color: T.moss }}>🌿 RSE Pilotage BTP</div>
        <div style={{ flex: 1, height: 6, background: T.straw, borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: `linear-gradient(90deg,${T.moss},${T.leaf})`,
            borderRadius: 3, transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
          }} />
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 12, color: T.mineral, whiteSpace: "nowrap" }}>
          {step + 1} / {total}
        </div>
        {step === 0 && (
          <button className="btn-demo no-print" onClick={handleDemo}>
            ⚡ Remplissage rapide (Démo)
          </button>
        )}
      </div>

      {/* Onglets sections */}
      <div style={{ background: T.white, borderBottom: `1px solid ${T.straw}`, padding: "10px 32px", display: "flex", gap: 6 }}>
        {sections.map((s) => {
          const isActive = q.section === s;
          return (
            <div key={s} style={{
              padding: "6px 14px", borderRadius: 20,
              background: isActive ? sectionColors[s] : `${sectionColors[s]}12`,
              color: isActive ? T.white : sectionColors[s],
              border: `1px solid ${isActive ? sectionColors[s] : `${sectionColors[s]}30`}`,
              fontFamily: F.body, fontSize: 12, fontWeight: 700,
              transition: "all 0.3s ease",
            }}>{s}</div>
          );
        })}
      </div>

      {/* Question courante */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <div key={step} className="act-enter" style={{ maxWidth: 680, width: "100%" }}>

          {error && (
            <div style={{ background: "#FDECEA", border: "1px solid #FBBFAA", borderRadius: 12, padding: "12px 16px", marginBottom: 16, color: T.rust, fontFamily: F.body, fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ background: T.white, borderRadius: 24, border: `1.5px solid ${T.straw}`, boxShadow: "0 4px 32px rgba(30,18,8,0.08)", padding: "40px", marginBottom: 16 }}>

            {/* Header question */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `linear-gradient(135deg,${T.moss}15,${T.fern}25)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
                border: `1px solid ${T.mist}`,
              }}>{q.icone}</div>
              <div>
                <div style={{ fontSize: 11, color: T.mineral, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>
                  {q.section} — Q{step + 1}
                </div>
                <h2 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 700, color: T.ink, margin: 0 }}>{q.titre}</h2>
              </div>
            </div>

            <p style={{ fontFamily: F.body, fontSize: 16, color: T.bark, lineHeight: 1.65, marginBottom: 28 }}>{q.question}</p>

            {/* Input text */}
            {q.type === "text" && (
              <input
                autoFocus
                value={reps[q.id] || ""}
                onChange={(e) => setVal(q.id, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canNext() && next()}
                placeholder={q.placeholder}
                style={{
                  width: "100%", padding: "14px 18px", fontFamily: F.body, fontSize: 15, color: T.ink,
                  border: `2px solid ${reps[q.id] ? T.leaf : T.straw}`, borderRadius: 14,
                  outline: "none", background: T.cream, transition: "border-color 0.2s ease", boxSizing: "border-box",
                }}
              />
            )}

            {/* Choix unique */}
            {q.type === "choix" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {q.options.map((opt) => {
                  const sel = reps[q.id] === opt.v;
                  return (
                    <div key={opt.v} className="choice-option"
                      onClick={() => setVal(q.id, opt.v)}
                      style={{
                        padding: "16px 18px", borderRadius: 14,
                        border: `2px solid ${sel ? T.moss : T.straw}`,
                        background: sel ? `linear-gradient(135deg,${T.moss}10,${T.fern}15)` : T.cream,
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20 }}>{opt.e}</span>
                        <div>
                          <div style={{ fontFamily: F.body, fontSize: 14, fontWeight: 700, color: sel ? T.moss : T.ink }}>{opt.l}</div>
                          {opt.s && <div style={{ fontFamily: F.body, fontSize: 11, color: T.mineral, marginTop: 2 }}>{opt.s}</div>}
                        </div>
                        {sel && (
                          <div style={{
                            marginLeft: "auto", width: 18, height: 18, borderRadius: "50%",
                            background: T.moss, display: "flex", alignItems: "center", justifyContent: "center",
                            color: T.white, fontSize: 11, fontWeight: 800, flexShrink: 0,
                          }}>✓</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Choix multiple */}
            {q.type === "multi" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {q.options.map((opt) => {
                  const sel = (reps[q.id] || []).includes(opt.v);
                  return (
                    <div key={opt.v} className="choice-option"
                      onClick={() => toggleMulti(q.id, opt.v)}
                      style={{
                        padding: "14px 16px", borderRadius: 14, textAlign: "center",
                        border: `2px solid ${sel ? T.moss : T.straw}`,
                        background: sel ? `linear-gradient(135deg,${T.moss}12,${T.fern}18)` : T.cream,
                      }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{opt.e}</div>
                      <div style={{ fontFamily: F.body, fontSize: 12, fontWeight: 700, color: sel ? T.moss : T.ink }}>{opt.l}</div>
                      {sel && <div style={{ marginTop: 6, fontSize: 10, color: T.fern, fontWeight: 700 }}>✓ Sélectionné</div>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Explication normative */}
            {q.pourquoi && (
              <div style={{ marginTop: 20, padding: "12px 16px", background: `${T.moss}08`, border: `1px solid ${T.mist}`, borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: T.fern, fontFamily: F.body, fontWeight: 700, marginBottom: 4 }}>💡 Pourquoi cette question ?</div>
                <div style={{ fontSize: 12, color: T.clay, fontFamily: F.body, lineHeight: 1.6 }}>{q.pourquoi}</div>
                {q.normes.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                    {q.normes.map((n) => <NormeBadge key={n} id={n} small />)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {step > 0
              ? <button className="btn-ghost" onClick={() => setStep((s) => s - 1)}>← Précédent</button>
              : <div />
            }
            <button className="btn-primary" onClick={next} disabled={!canNext()}>
              {step < total - 1 ? <>Suivant <span>→</span></> : <>Générer le dashboard <span>🚀</span></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
