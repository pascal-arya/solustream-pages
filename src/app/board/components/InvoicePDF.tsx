import React from "react";
import Image from "next/image";

export type InvoiceItem = {
  id: string;
  name: string;
  description: string;
  rate: number;
  quantity: number;
};

type InvoicePDFProps = {
  invoiceNumber: string;
  clientName: string;
  clientPhone: string;
  items: InvoiceItem[];
  bankAccount: string;
  bankUser: string;
  subtotal: number;
  discountAmount: number;
  grandTotal: number;
};

const S = {
  page: {
    position: "relative" as const,
    overflow: "hidden",
    flexShrink: 0,
    width: "794px",
    height: "1123px",
    pageBreakAfter: "always" as const,
    pageBreakInside: "avoid" as const,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  } as React.CSSProperties,
  bgWrap: {
    position: "absolute" as const,
    inset: 0,
    bottom: 0,
    zIndex: 0,
    height: "1123px",
    width: "100%",
    pointerEvents: "none" as const,
  },
  blurTop: {
    position: "absolute" as const,
    zIndex: 0,
    background: "black",
    borderRadius: "50%",
    pointerEvents: "none" as const,
    width: "600px",
    height: "600px",
    left: "-200px",
    top: "-200px",
    filter: "blur(120px)",
    opacity: 1,
  },
  blurBottom: {
    position: "absolute" as const,
    zIndex: 0,
    background: "black",
    borderRadius: "50%",
    pointerEvents: "none" as const,
    width: "600px",
    height: "600px",
    left: "-200px",
    bottom: "-200px",
    filter: "blur(120px)",
    opacity: 1,
  },
  content: {
    position: "relative" as const,
    zIndex: 10,
    paddingTop: "48px",
    paddingLeft: "64px",
    paddingRight: "64px",
    paddingBottom: "100px",
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
    boxSizing: "border-box" as const,
  },
  white: { color: "#ffffff" },
  whiteMuted: { color: "rgba(255,255,255,0.7)" },
  white80: { color: "rgba(255,255,255,0.8)" },
};

export default function InvoicePDF({
  invoiceNumber,
  clientName,
  clientPhone,
  items,
  bankAccount,
  bankUser,
  subtotal,
  discountAmount,
  grandTotal,
}: InvoicePDFProps) {
  const getItemWeight = (item: InvoiceItem) => {
    const desc = item.description || "Item description";
    const descLines = Math.max(1, Math.ceil(desc.length / 45));
    return 1 + descLines;
  };

  const MAX_WEIGHT_FIRST_PAGE = 12;
  const MAX_WEIGHT_SUBSEQUENT_PAGE = 20;

  const pages: InvoiceItem[][] = [];
  let currentPage: InvoiceItem[] = [];
  let currentWeight = 0;

  items.forEach((item) => {
    const weight = getItemWeight(item);
    const isFirstPage = pages.length === 0;
    const maxWeight = isFirstPage ? MAX_WEIGHT_FIRST_PAGE : MAX_WEIGHT_SUBSEQUENT_PAGE;
    if (currentWeight + weight > maxWeight && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [item];
      currentWeight = weight;
    } else {
      currentPage.push(item);
      currentWeight += weight;
    }
  });
  if (currentPage.length > 0) pages.push(currentPage);

  const lastPageItems = pages[pages.length - 1] || [];
  const isOnlyOnePage = pages.length === 1;
  const lastPageWeight = lastPageItems.reduce((acc, item) => acc + getItemWeight(item), 0);
  const overflowTnC = isOnlyOnePage ? lastPageWeight > 11 : lastPageWeight > 18;

  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };
  const today = new Date();
  const invoiceDate = formatDate(today);
  const dueDateObj = new Date(today);
  dueDateObj.setDate(today.getDate() + 4);
  const dueDate = formatDate(dueDateObj);

  return (
    <div style={{ background: "white", margin: "0 auto", position: "relative", display: "flex", flexDirection: "column", gap: "16px", width: "794px" }}>
      {pages.map((pageItems, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === pages.length - 1;
        return (
          <div key={pageIndex} style={S.page}>
            {/* Background */}
            <div style={S.bgWrap}>
              <Image src="/Assets/Invoice/Background.png" alt="Background" fill style={{ objectFit: "cover", objectPosition: "bottom" }} priority unoptimized />
            </div>
            <div style={S.blurTop} />
            <div style={S.blurBottom} />

            {/* Content */}
            <div style={S.content}>
              {/* Logo */}
              {isFirstPage && (
                <div style={{ marginBottom: "12px" }}>
                  <Image src="/Assets/Invoice/Logo.png" alt="Solustream Logo" width={88} height={88} priority style={{ objectFit: "contain", objectPosition: "left" }} unoptimized />
                </div>
              )}

              {/* Header */}
              {isFirstPage && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", width: "100%", paddingLeft: "4px", paddingRight: "8px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h1 style={{ fontSize: "44px", letterSpacing: "-0.02em", color: "#fff", fontWeight: 900, lineHeight: 1, margin: "0 0 4px" }}>INVOICE</h1>
                    <p style={{ fontSize: "20px", color: "#fff", fontWeight: 300, letterSpacing: "0.1em", margin: "0 0 20px" }}>
                      {invoiceNumber || "SOLU26-027"}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "16px", lineHeight: 1, margin: 0 }}>Invoice to:</h3>
                      <p style={{ color: "#fff", fontSize: "22px", fontWeight: 800, lineHeight: 1, margin: 0 }}>{clientName || "Raka Sanjaya"}</p>
                      <p style={{ color: "#fff", fontWeight: 300, fontSize: "15px", lineHeight: 1, margin: 0 }}>{clientPhone || "087777964411"}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: "14px", lineHeight: 1, margin: "0 0 4px", textAlign: "right" as const }}>Total Due:</p>
                    <h2 style={{ fontSize: "36px", color: "#fff", fontWeight: 300, lineHeight: 1, margin: "0 0 20px" }}>
                      Rp{grandTotal.toLocaleString("id-ID")}
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                      <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "16px", lineHeight: 1, margin: 0, textAlign: "right" as const }}>Payment to:</h3>
                      <p style={{ color: "#fff", fontSize: "20px", fontWeight: 700, lineHeight: 1, margin: 0 }}>{bankAccount || "8415886230 (BCA)"}</p>
                      <p style={{ color: "#fff", fontWeight: 300, fontSize: "15px", lineHeight: 1, margin: 0 }}>{bankUser || "Pascal Arya Nugroho"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dates */}
              {isFirstPage && (
                <div style={{ display: "flex", gap: "48px", marginBottom: "24px", paddingLeft: "4px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: "16px", lineHeight: 1, margin: 0 }}>Invoice Date:</p>
                    <p style={{ color: "#fff", fontWeight: 300, lineHeight: 1, margin: 0 }}>{invoiceDate}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: "16px", lineHeight: 1, margin: 0 }}>Due Date:</p>
                    <p style={{ color: "#fff", fontWeight: 300, lineHeight: 1, margin: 0 }}>{dueDate}</p>
                  </div>
                </div>
              )}

              {!isFirstPage && <div style={{ marginTop: "32px" }} />}

              {/* Table */}
              <div style={{ flexGrow: 1, paddingLeft: "4px", paddingRight: "8px" }}>
                {/* Header Row */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 11fr",
                  gap: "8px", padding: "6px 32px", borderRadius: "15px",
                  border: "1px solid white", marginBottom: "8px",
                  alignItems: "center", backgroundColor: "rgba(217,217,217,0.1)"
                }}>
                  <div style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>No.</div>
                  <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr 1fr 3fr", gap: "8px" }}>
                    <div style={{ color: "#fff", fontSize: "16px", fontWeight: 700, paddingLeft: "8px" }}>Item Description</div>
                    <div style={{ color: "#fff", fontSize: "16px", fontWeight: 700, textAlign: "right" as const }}>Rate</div>
                    <div style={{ color: "#fff", fontSize: "16px", fontWeight: 700, textAlign: "center" as const }}>Qty</div>
                    <div style={{ color: "#fff", fontSize: "16px", fontWeight: 700, textAlign: "right" as const, paddingRight: "16px" }}>Total</div>
                  </div>
                </div>

                {/* Item Rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
                  {pageItems.map((item, index) => {
                    const globalIndex = pages.slice(0, pageIndex).reduce((acc, p) => acc + p.length, 0) + index;
                    return (
                      <div key={item.id} style={{
                        display: "grid", gridTemplateColumns: "1fr 11fr",
                        gap: "8px", padding: "10px 24px", borderRadius: "12px",
                        border: "1px solid white", alignItems: "center"
                      }}>
                        <div style={{ color: "#fff", fontWeight: 400, fontSize: "15px" }}>
                          {String(globalIndex + 1).padStart(2, "0")}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "5fr 2fr 1fr 3fr", gap: "8px", alignItems: "center" }}>
                          <div style={{ paddingLeft: "8px", overflow: "hidden" }}>
                            <p style={{ color: "#fff", fontWeight: 600, fontSize: "15px", lineHeight: 1.2, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name || "Item Name"}</p>
                            <p style={{ color: "rgba(255,255,255,0.75)", fontWeight: 300, fontSize: "12px", lineHeight: 1.2, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.description || "Item description"}</p>
                          </div>
                          <div style={{ color: "#fff", fontWeight: 400, textAlign: "right" as const, fontSize: "15px" }}>
                            Rp{item.rate.toLocaleString("id-ID")}
                          </div>
                          <div style={{ color: "#fff", fontWeight: 400, textAlign: "center" as const, fontSize: "15px" }}>
                            {item.quantity}
                          </div>
                          <div style={{ color: "#fff", fontWeight: 400, textAlign: "right" as const, paddingRight: "16px", fontSize: "15px" }}>
                            Rp{(item.rate * item.quantity).toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                {isLastPage && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 24px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.3)", width: "300px", backgroundColor: "rgba(217,217,217,0.05)" }}>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500, fontSize: "12px" }}>Subtotal</span>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400, fontSize: "14px", paddingRight: "16px" }}>Rp{subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 24px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.3)", width: "300px", backgroundColor: "rgba(217,217,217,0.05)" }}>
                        <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500, fontSize: "12px" }}>Discount</span>
                        <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400, fontSize: "14px", paddingRight: "16px" }}>-Rp{discountAmount.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 24px", borderRadius: "12px", border: "1px solid white", width: "300px", backgroundColor: "rgba(217,217,217,0.1)" }}>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>Grand Total</span>
                      <span style={{ color: "#fff", fontWeight: 400, fontSize: "16px", paddingRight: "16px" }}>Rp{grandTotal.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                )}

                {/* Terms & Signature (inline) */}
                {isLastPage && !overflowTnC && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", marginTop: "24px", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "4px", margin: "0 0 4px" }}>Syarat dan Ketentuan</h3>
                      <p style={{ color: "#fff", fontWeight: 400, fontSize: "14px", lineHeight: "tight", maxWidth: "280px", margin: 0 }}>
                        Pembayaran yang sudah dibayarkan dan/atau sudah disetujui sebelumnya tidak dapat di-refund
                        <br /><br />
                        Pengerjaan dan/atau book alat dilakukan setelah DP
                      </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "160px" }}>
                        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "8px", margin: "0 0 8px" }}>Best Regards,</h3>
                        <div style={{ border: "1px solid rgba(255,255,255,0.5)", borderRadius: "12px", width: "100%", height: "100px", background: "transparent", marginBottom: "8px", position: "relative", overflow: "hidden" }}>
                          <Image src="/Assets/Invoice/Signature.png" alt="Signature" fill style={{ objectFit: "contain", padding: "8px" }} unoptimized />
                        </div>
                        <p style={{ color: "#fff", fontWeight: 400, fontSize: "16px", margin: 0 }}>Daffa Yordan</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ position: "absolute", bottom: "12px", left: "-20px", width: "834px" }}>
              <Image src="/Assets/Invoice/Footer.png" alt="Footer" width={834} height={79} style={{ width: "100%", height: "auto" }} unoptimized />
            </div>
          </div>
        );
      })}

      {/* Overflow TnC page */}
      {overflowTnC && (
        <div style={{ ...S.page, height: "1123px", pageBreakInside: "avoid" }}>
          <div style={S.bgWrap}>
            <Image src="/Assets/Invoice/Background.png" alt="Background" fill style={{ objectFit: "cover", objectPosition: "bottom" }} priority unoptimized />
          </div>
          <div style={{ ...S.blurTop, filter: "blur(300px)" }} />
          <div style={{ ...S.blurBottom, filter: "blur(300px)" }} />
          <div style={{ ...S.content, paddingTop: "80px", paddingLeft: "68px", paddingRight: "68px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", marginTop: "40px", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "16px", margin: "0 0 4px" }}>Syarat dan Ketentuan</h3>
                <p style={{ color: "#fff", fontWeight: 400, fontSize: "14px", lineHeight: "tight", maxWidth: "280px", margin: 0 }}>
                  Pembayaran yang sudah dibayarkan dan/atau sudah disetujui sebelumnya tidak dapat di-refund
                  <br /><br />
                  Pengerjaan dan/atau book alat dilakukan setelah DP
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "160px" }}>
                  <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "16px", margin: "0 0 8px" }}>Best Regards,</h3>
                  <div style={{ border: "1px solid rgba(255,255,255,0.5)", borderRadius: "12px", width: "100%", height: "100px", background: "transparent", marginBottom: "8px", position: "relative", overflow: "hidden" }}>
                    <Image src="/Assets/Invoice/Signature.png" alt="Signature" fill style={{ objectFit: "contain", padding: "8px" }} unoptimized />
                  </div>
                  <p style={{ color: "#fff", fontWeight: 400, fontSize: "16px", margin: 0 }}>Daffa Yordan</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "20px", left: "-20px", width: "834px" }}>
            <Image src="/Assets/Invoice/Footer.png" alt="Footer" width={834} height={79} style={{ width: "100%", height: "auto" }} unoptimized />
          </div>
        </div>
      )}
    </div>
  );
}
