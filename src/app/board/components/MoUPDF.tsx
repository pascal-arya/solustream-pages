import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MoUPDFProps = {
    mouNumber: string;
    date: string;
    partyA: { name: string; representative: string; position: string };
    partyB: { name: string; representative: string; position: string };
    clauses: { id: string; title: string; content: string }[];
    mouMode?: "guided" | "manual";
    manualContent?: string;
};

const pageBase: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    flexShrink: 0,
    width: "794px",
    height: "1123px",
    pageBreakAfter: "always",
    pageBreakInside: "avoid",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
};

export default function MoUPDF({
    mouNumber,
    date,
    partyA,
    partyB,
    clauses: guidedClauses,
    mouMode = "guided",
    manualContent = "",
}: MoUPDFProps) {
    const clauses =
        mouMode === "manual"
            ? manualContent.split("\n\n").filter((p) => p.trim()).map((p, i) => ({ id: `manual-${i}`, title: "", content: p }))
            : guidedClauses;

    const PAGE_HEIGHT_TOTAL = 1123;
    const FOOTER_START = 1024;
    const BUFFER = 10;
    const FIRST_PAGE_CONTENT_LIMIT = FOOTER_START - BUFFER - 430;
    const SUBSEQUENT_PAGE_LIMIT = FOOTER_START - BUFFER - 60;

    const pages: { id: string; title: string; content: string }[][] = [];
    let currentPage: { id: string; title: string; content: string }[] = [];
    let currentHeight = 0;

    clauses.forEach((clause) => {
        const isFirstPage = pages.length === 0;
        const limit = isFirstPage ? FIRST_PAGE_CONTENT_LIMIT : SUBSEQUENT_PAGE_LIMIT;
        let weight = 45;
        const isRoles = clause.title.toLowerCase().includes("roles") || clause.title.toLowerCase().includes("responsibility");
        const isFinance = clause.title.toLowerCase().includes("financial") || clause.title.toLowerCase().includes("payment schedule");
        if (isRoles) {
            const providerPoints = clause.content.split("\n\n")[0]?.split("\n").length - 1 || 0;
            const clientPoints = clause.content.split("\n\n")[1]?.split("\n").length - 1 || 0;
            weight = 110 + Math.max(providerPoints, clientPoints) * 28;
        } else if (isFinance) {
            weight = 190;
        } else {
            weight = 35 + Math.ceil(clause.content.length / 85) * 28;
        }
        if (currentHeight + weight > limit) {
            pages.push(currentPage);
            currentPage = [clause];
            currentHeight = weight;
        } else {
            currentPage.push(clause);
            currentHeight += weight;
        }
    });
    if (currentPage.length > 0) pages.push(currentPage);
    if (pages.length === 0) pages.push([]);

    return (
        <div style={{ background: "white", margin: "0 auto", position: "relative", display: "flex", flexDirection: "column", gap: "16px", width: "794px" }}>
            {pages.map((pageClauses, pageIndex) => {
                const isFirstPage = pageIndex === 0;
                const isLastPage = pageIndex === pages.length - 1;

                return (
                    <div key={pageIndex} className="pdf-page-canvas" style={{ ...pageBase, height: `${PAGE_HEIGHT_TOTAL}px` }}>
                        {/* Background */}
                        <div style={{ position: "absolute", inset: 0, zIndex: 0, height: "1123px", width: "100%", pointerEvents: "none" }}>
                            <Image src="/Assets/Invoice/Background.png" alt="Background" fill style={{ objectFit: "cover", objectPosition: "bottom" }} priority unoptimized />
                        </div>
                        <div style={{ position: "absolute", zIndex: 0, background: "black", borderRadius: "50%", pointerEvents: "none", width: "600px", height: "600px", left: "-200px", top: "-200px", filter: "blur(120px)", opacity: 1 }} />
                        <div style={{ position: "absolute", zIndex: 0, background: "black", borderRadius: "50%", pointerEvents: "none", width: "600px", height: "600px", left: "-200px", bottom: "-200px", filter: "blur(120px)", opacity: 1 }} />

                        {/* Content */}
                        <div style={{ position: "relative", zIndex: 10, paddingLeft: "64px", paddingRight: "64px", paddingBottom: "110px", paddingTop: isFirstPage ? "48px" : "80px", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
                            {/* Logo */}
                            {isFirstPage && (
                                <div style={{ marginBottom: "12px" }}>
                                    <Image src="/Assets/Invoice/Logo.png" alt="Logo" width={88} height={88} priority style={{ objectFit: "contain", objectPosition: "left" }} unoptimized />
                                </div>
                            )}

                            {/* MoU Header */}
                            {isFirstPage && (
                                <div style={{ marginBottom: "32px", paddingLeft: "4px" }}>
                                    <h1 style={{ fontSize: "36px", letterSpacing: "-0.02em", color: "#fff", fontWeight: 900, lineHeight: 1.2, marginBottom: "16px", margin: "0 0 16px" }}>
                                        MEMORANDUM OF UNDERSTANDING
                                    </h1>
                                    <div style={{ display: "flex", alignItems: "flex-end", gap: "64px", borderBottom: "1px solid white", paddingBottom: "16px" }}>
                                        <div>
                                            <p style={{ color: "#fff", fontWeight: 300, letterSpacing: "0.1em", fontSize: "10px", marginBottom: "4px", textTransform: "uppercase" as const, margin: "0 0 4px" }}>Reference Number</p>
                                            <p style={{ fontSize: "18px", color: "#fff", fontWeight: 700, margin: 0 }}>{mouNumber || "MOU/2026/001"}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: "#fff", fontWeight: 300, letterSpacing: "0.1em", fontSize: "10px", marginBottom: "4px", textTransform: "uppercase" as const, margin: "0 0 4px" }}>Date</p>
                                            <p style={{ fontSize: "18px", color: "#fff", fontWeight: 700, margin: 0 }}>{date}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Parties */}
                            {isFirstPage && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px", paddingLeft: "4px" }}>
                                    {[
                                        { label: "FIRST PARTY", party: partyA },
                                        { label: "SECOND PARTY", party: partyB },
                                    ].map(({ label, party }) => (
                                        <div key={label} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                            <h3 style={{ color: "#fff", fontWeight: 900, fontSize: "12px", textTransform: "uppercase" as const, letterSpacing: "0.2em", margin: 0 }}>{label}</h3>
                                            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid white", padding: "12px", borderRadius: "12px" }}>
                                                <p style={{ color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "4px", margin: "0 0 4px" }}>{party.name || (label === "SECOND PARTY" ? "Client Name" : "Solustream Digital")}</p>
                                                <p style={{ color: "#fff", fontSize: "12px", fontWeight: 500, lineHeight: "tight", margin: 0 }}>{party.representative || (label === "SECOND PARTY" ? "Representative" : "Daffa Yordan")}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Clauses */}
                            <div style={{ paddingLeft: "4px", display: "flex", flexDirection: "column", gap: "24px" }}>
                                {pageClauses.map((clause, idx) => {
                                    const articleNum = clauses.findIndex((c) => c.id === clause.id) + 1;
                                    const isRoles = clause.title.toLowerCase().includes("roles") || clause.title.toLowerCase().includes("responsibility");
                                    const isFinance = clause.title.toLowerCase().includes("financial") || clause.title.toLowerCase().includes("payment schedule");

                                    let totalFeeStr = "", depositAmountStr = "", finalAmountStr = "", depositPercent = "", dueDateStr = "";
                                    if (isFinance) {
                                        totalFeeStr = clause.content.match(/Total Project Fee: (Rp[0-9.,]+)/)?.[1] || "";
                                        depositAmountStr = clause.content.match(/Deposit: \d+% \((Rp[0-9.,]+)\)/)?.[1] || "";
                                        finalAmountStr = clause.content.match(/Final Payment: \d+% \((Rp[0-9.,]+)\)/)?.[1] || "";
                                        depositPercent = clause.content.match(/Deposit: (\d+)%/)?.[1] || "";
                                        dueDateStr = clause.content.match(/due on ([\d/]+)/)?.[1] || "";
                                    }

                                    return (
                                        <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            {clause.title && (
                                                <h4 style={{ color: "#fff", fontWeight: 700, fontSize: "18px", display: "flex", alignItems: "center", gap: "12px", margin: 0 }}>
                                                    <span style={{ background: "white", color: "#1e3a8a", width: "20px", height: "20px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 900, flexShrink: 0 }}>
                                                        {articleNum}
                                                    </span>
                                                    {clause.title}
                                                </h4>
                                            )}

                                            {isRoles ? (
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", paddingLeft: "32px", marginTop: "24px" }}>
                                                    {[
                                                        { label: "Provider Role", lines: clause.content.split("\n\n")[0]?.split("\n").slice(1) || [] },
                                                        { label: "Client/Partner Role", lines: clause.content.split("\n\n")[1]?.split("\n").slice(1) || [] },
                                                    ].map(({ label, lines }) => (
                                                        <div key={label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid white", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                                            <p style={{ color: "#fff", fontWeight: 900, fontSize: "12px", letterSpacing: "0.1em", borderBottom: "1px solid white", paddingBottom: "6px", margin: "0 0 6px", textTransform: "uppercase" as const }}>{label}</p>
                                                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                                {lines.map((p, i) => (
                                                                    <div key={i} style={{ color: "#fff", fontSize: "14px", fontWeight: 300, lineHeight: "relaxed", display: "flex", gap: "8px" }}>
                                                                        <span style={{ color: "#fff", marginTop: "2px", flexShrink: 0 }}>•</span>
                                                                        <span>{p.replace(/^- /, "")}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : isFinance ? (
                                                <div style={{ paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                                                    <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid white", borderRadius: "8px", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                                                <span style={{ fontSize: "10px", fontWeight: 900, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Total Project Investment</span>
                                                                <span style={{ fontSize: "20px", color: "#fff", fontWeight: 900 }}>{totalFeeStr}</span>
                                                            </div>
                                                            <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.1)" }} />
                                                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                                                <span style={{ fontSize: "10px", fontWeight: 900, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Payment Terms</span>
                                                                <span style={{ fontSize: "12px", color: "#fff", fontWeight: 700, fontStyle: "italic" }}>Net 4 Days</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                                        {[
                                                            { num: "1", label: "Deposit", amount: depositAmountStr, right: `${depositPercent}%` },
                                                            { num: "2", label: "Final", amount: finalAmountStr, right: `Due ${dueDateStr}` },
                                                        ].map(({ num, label, amount, right }) => (
                                                            <div key={num} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid white", borderRadius: "8px", padding: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                                    <span style={{ width: "16px", height: "16px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: "#1e3a8a", fontWeight: 700, flexShrink: 0 }}>{num}</span>
                                                                    <div>
                                                                        <p style={{ fontSize: "12px", fontWeight: 900, color: "#fff", letterSpacing: "0.1em", lineHeight: 1, margin: "0 0 4px", textTransform: "uppercase" as const }}>{label}</p>
                                                                        <p style={{ fontSize: "16px", color: "#fff", fontWeight: 700, lineHeight: 1, margin: 0 }}>{amount}</p>
                                                                    </div>
                                                                </div>
                                                                <p style={{ fontSize: "12px", color: "#fff", fontWeight: 700, margin: 0 }}>{right}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ color: "#fff", fontWeight: 300, fontSize: "16px", lineHeight: "relaxed", paddingLeft: clause.title ? "32px" : "4px" }}>
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            p: ({ ...props }) => <p style={{ marginBottom: "16px" }} {...props} />,
                                                            ul: ({ ...props }) => <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginBottom: "16px" }} {...props} />,
                                                            ol: ({ ...props }) => <ol style={{ listStyleType: "decimal", paddingLeft: "20px", marginBottom: "16px" }} {...props} />,
                                                            li: ({ ...props }) => <li style={{ marginBottom: "4px" }} {...props} />,
                                                            strong: ({ ...props }) => <strong style={{ fontWeight: 700, color: "#fff", textTransform: "uppercase" as const }} {...props} />,
                                                            em: ({ ...props }) => <em style={{ fontStyle: "italic" }} {...props} />,
                                                        }}
                                                    >
                                                        {clause.content}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Signatures on last page */}
                            {isLastPage && (
                                <div style={{ marginTop: "16px" }}>
                                    <p style={{ color: "#fff", fontSize: "16px", fontWeight: 500, fontStyle: "italic", marginBottom: "16px", paddingLeft: "16px", borderLeft: "2px solid rgba(255,255,255,0.2)", lineHeight: "relaxed" }}>
                                        By signing below, both parties confirm their agreement to abide by all the terms and conditions set forth in this Memorandum of Understanding.
                                    </p>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", paddingLeft: "4px" }}>
                                        {[
                                            { label: "FIRST PARTY", name: partyA.representative || "Daffa Yordan", showSig: true },
                                            { label: "SECOND PARTY", name: partyB.representative || "Second Party", showSig: false },
                                        ].map(({ label, name, showSig }) => (
                                            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <p style={{ color: "#fff", fontWeight: 900, fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "16px", opacity: 0.7, margin: "0 0 16px" }}>{label}</p>
                                                <div style={{ border: showSig ? "1px solid white" : "1px dashed white", borderRadius: "12px", width: "160px", height: "100px", background: "white", marginBottom: "8px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    {showSig && <Image src="/Assets/Invoice/Signature.png" alt="Signature" fill style={{ objectFit: "contain", padding: "8px" }} unoptimized />}
                                                </div>
                                                <p style={{ color: "#fff", fontWeight: 700, fontSize: "16px", margin: 0 }}>{name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{ position: "absolute", bottom: "12px", left: "5px", width: "784px" }}>
                            <Image src="/Assets/Invoice/Footer.png" alt="Footer" width={784} height={74} style={{ width: "100%", height: "auto" }} unoptimized />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
