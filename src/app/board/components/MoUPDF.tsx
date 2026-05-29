import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MoUPDFProps = {
  mouNumber: string;
  date: string;
  partyA: {
    name: string;
    representative: string;
    position: string;
  };
  partyB: {
    name: string;
    representative: string;
    position: string;
  };
  clauses: { id: string; title: string; content: string }[];
  mouMode?: "guided" | "manual";
  manualContent?: string;
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
      ? manualContent
          .split("\n\n")
          .filter((p) => p.trim())
          .map((p, i) => ({
            id: `manual-${i}`,
            title: "",
            content: p,
          }))
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
    const isRoles =
      clause.title.toLowerCase().includes("roles") ||
      clause.title.toLowerCase().includes("responsibility");
    const isFinance =
      clause.title.toLowerCase().includes("financial") ||
      clause.title.toLowerCase().includes("payment schedule");

    if (isRoles) {
      const providerPoints = clause.content.split("\n\n")[0]?.split("\n").length - 1 || 0;
      const clientPoints = clause.content.split("\n\n")[1]?.split("\n").length - 1 || 0;
      const maxPoints = Math.max(providerPoints, clientPoints);
      weight = 110 + maxPoints * 28;
    } else if (isFinance) {
      weight = 190;
    } else {
      const lines = Math.ceil(clause.content.length / 85);
      weight = 35 + lines * 28;
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
    <div className="bg-white mx-auto relative flex flex-col gap-4" style={{ width: "794px" }}>
      {pages.map((pageClauses, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === pages.length - 1;

        return (
          <div
            key={pageIndex}
            className="relative overflow-hidden shrink-0 pdf-page-canvas"
            style={{
              width: "794px",
              height: `${PAGE_HEIGHT_TOTAL}px`,
              pageBreakAfter: "always",
              pageBreakInside: "avoid",
            }}
          >
            <div className="absolute inset-x-0 bottom-0 z-0 h-[1123px] w-full pointer-events-none">
              <Image
                src="/Assets/Invoice/Background.png"
                alt="Background"
                fill
                className="object-cover object-bottom"
                priority
                unoptimized
              />
            </div>
            <div
              className="absolute z-0 bg-black rounded-full pointer-events-none"
              style={{ width: "600px", height: "600px", left: "-200px", top: "-200px", filter: "blur(120px)", opacity: 1 }}
            />
            <div
              className="absolute z-0 bg-black rounded-full pointer-events-none"
              style={{ width: "600px", height: "600px", left: "-200px", bottom: "-200px", filter: "blur(120px)", opacity: 1 }}
            />

            <div className={`relative z-10 px-16 flex flex-col h-full pb-[110px] ${isFirstPage ? "pt-12" : "pt-20"}`}>
              {isFirstPage && (
                <div className="mb-4">
                  <Image src="/Assets/Invoice/Logo.png" alt="Logo" width={140} height={38} priority unoptimized />
                </div>
              )}

              {isFirstPage && (
                <div className="mb-8 pl-1">
                  <h1 className="text-[36px] tracking-tight text-white font-black leading-tight mb-4">
                    MEMORANDUM OF UNDERSTANDING
                  </h1>
                  <div className="flex items-end gap-16 border-b border-white pb-4">
                    <div>
                      <p className="text-white font-light tracking-widest text-[10px] mb-1 uppercase">Reference Number</p>
                      <p className="text-lg text-white font-bold">{mouNumber || "MOU/2026/001"}</p>
                    </div>
                    <div>
                      <p className="text-white font-light tracking-widest text-[10px] mb-1 uppercase">Date</p>
                      <p className="text-lg text-white font-bold">{date}</p>
                    </div>
                  </div>
                </div>
              )}

              {isFirstPage && (
                <div className="grid grid-cols-2 gap-8 mb-8 pl-1">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">FIRST PARTY</h3>
                    <div className="bg-white/5 border border-white p-3 rounded-xl backdrop-blur-sm">
                      <p className="text-white font-bold text-base mb-1">{partyA.name}</p>
                      <p className="text-white text-[12px] font-medium leading-tight">{partyA.representative}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">SECOND PARTY</h3>
                    <div className="bg-white/5 border border-white p-3 rounded-xl backdrop-blur-sm">
                      <p className="text-white font-bold text-base mb-1">{partyB.name || "Client Name"}</p>
                      <p className="text-white text-[12px] font-medium leading-tight">{partyB.representative || "Representative"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pl-1 space-y-6">
                {pageClauses.map((clause, idx) => {
                  const articleNum = clauses.findIndex((c) => c.id === clause.id) + 1;
                  const isRoles =
                    clause.title.toLowerCase().includes("roles") ||
                    clause.title.toLowerCase().includes("responsibility");
                  const isFinance =
                    clause.title.toLowerCase().includes("financial") ||
                    clause.title.toLowerCase().includes("payment schedule");

                  let totalFeeStr = "",
                    depositAmountStr = "",
                    finalAmountStr = "",
                    depositPercent = "",
                    finalPercent = "",
                    dueDateStr = "";
                  if (isFinance) {
                    totalFeeStr = clause.content.match(/Total Project Fee: (Rp[0-9.,]+)/)?.[1] || "";
                    depositAmountStr = clause.content.match(/Deposit: \d+% \((Rp[0-9.,]+)\)/)?.[1] || "";
                    finalAmountStr = clause.content.match(/Final Payment: \d+% \((Rp[0-9.,]+)\)/)?.[1] || "";
                    depositPercent = clause.content.match(/Deposit: (\d+)%/)?.[1] || "";
                    finalPercent = clause.content.match(/Final Payment: (\d+)%/)?.[1] || "";
                    dueDateStr = clause.content.match(/due on ([\d/]+)/)?.[1] || "";
                  }

                  return (
                    <div key={idx} className="space-y-3">
                      {clause.title && (
                        <h4 className="text-white font-bold text-lg flex items-center gap-3">
                          <span className="bg-white text-blue-900 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black">
                            {articleNum}
                          </span>
                          {clause.title}
                        </h4>
                      )}

                      {isRoles ? (
                        <div className="grid grid-cols-2 gap-3 pl-8 mt-6">
                          <div className="bg-white/5 border border-white rounded-xl p-3 flex flex-col gap-2">
                            <p className="text-white font-black text-[12px] tracking-widest border-b border-white pb-1.5">Provider Role</p>
                            <div className="space-y-1">
                              {clause.content.split("\n\n")[0]?.split("\n").slice(1).map((p, i) => (
                                <div key={i} className="text-white text-sm font-light leading-relaxed flex gap-2">
                                  <span className="text-white mt-0.5 shrink-0">•</span>
                                  <div className="flex-1">
                                    <ReactMarkdown>{p.replace(/^- /, "")}</ReactMarkdown>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-white/5 border border-white rounded-xl p-3 flex flex-col gap-2">
                            <p className="text-white font-black text-[12px] tracking-widest border-b border-white pb-1.5">Client/Partner Role</p>
                            <div className="space-y-1">
                              {clause.content.split("\n\n")[1]?.split("\n").slice(1).map((p, i) => (
                                <div key={i} className="text-white text-sm font-light leading-relaxed flex gap-2">
                                  <span className="text-white mt-0.5 shrink-0">•</span>
                                  <div className="flex-1">
                                    <ReactMarkdown>{p.replace(/^- /, "")}</ReactMarkdown>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : isFinance ? (
                        <div className="pl-8 space-y-3 mt-2">
                          <div className="bg-white/10 border border-white rounded-lg py-2 px-4 flex justify-between items-center shadow-lg shadow-black/5">
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white/70 tracking-widest uppercase">Total Project Investment</span>
                                <span className="text-xl text-white font-black">{totalFeeStr}</span>
                              </div>
                              <div className="w-px h-5 bg-white/10" />
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-white/70 tracking-widest uppercase">Payment Terms</span>
                                <span className="text-xs text-white font-bold tracking-tight italic">Net 4 Days</span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 border border-white rounded-lg p-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-[8px] text-blue-900 font-bold">1</span>
                                <div>
                                  <p className="text-[12px] font-black text-white tracking-widest leading-none">Deposit</p>
                                  <p className="text-base text-white font-bold leading-none mt-1">{depositAmountStr}</p>
                                </div>
                              </div>
                              <p className="text-[12px] text-white font-bold">{depositPercent}%</p>
                            </div>
                            <div className="bg-white/5 border border-white rounded-lg p-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-[8px] text-blue-900 font-bold">2</span>
                                <div>
                                  <p className="text-[12px] font-black text-white tracking-widest leading-none">Final</p>
                                  <p className="text-base text-white font-bold leading-none mt-1">{finalAmountStr}</p>
                                </div>
                              </div>
                              <p className="text-[12px] text-white font-bold">Due {dueDateStr}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`text-white font-light text-base leading-relaxed ${clause.title ? "pl-8" : "pl-1"} markdown-content`}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                              ul: ({ ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                              ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                              li: ({ ...props }) => <li className="mb-1" {...props} />,
                              strong: ({ ...props }) => <strong className="font-bold text-white uppercase tracking-tight" {...props} />,
                              em: ({ ...props }) => <em className="italic" {...props} />,
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

              {isLastPage && (
                <div className="mt-4">
                  <p className="text-white text-base font-medium italic mb-4 pl-1 leading-relaxed border-l-2 border-white/20 pl-4">
                    By signing below, both parties confirm their agreement to abide by all the terms and conditions set forth in this Memorandum of Understanding.
                  </p>
                  <div className="grid grid-cols-2 gap-8 pl-1">
                    <div className="flex flex-col items-center">
                      <p className="text-white font-black text-[10px] tracking-widest uppercase mb-4 opacity-70">FIRST PARTY</p>
                      <div className="border border-white rounded-xl w-[160px] h-[100px] bg-white relative overflow-hidden flex items-center justify-center p-2 mb-2" />
                      <p className="text-white font-bold text-base">{partyA.representative || "Daffa Yordan"}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-white font-black text-[10px] tracking-widest uppercase mb-4 opacity-70">SECOND PARTY</p>
                      <div className="w-[160px] h-[100px] mb-2 border border-white border-dashed rounded-xl flex items-center justify-center bg-white" />
                      <p className="text-white font-bold text-base">{partyB.representative || "Second Party"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-3 -left-[20px] w-[834px]">
              <Image src="/Assets/Invoice/Footer.png" alt="Footer" width={834} height={79} className="w-full h-auto object-bottom" unoptimized />
            </div>
          </div>
        );
      })}
    </div>
  );
}
