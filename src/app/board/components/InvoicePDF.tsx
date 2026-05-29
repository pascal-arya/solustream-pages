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

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  const lastPageItems = pages[pages.length - 1] || [];
  const isOnlyOnePage = pages.length === 1;
  const lastPageWeight = lastPageItems.reduce((acc, item) => acc + getItemWeight(item), 0);
  const overflowTnC = isOnlyOnePage ? lastPageWeight > 11 : lastPageWeight > 18;

  return (
    <div className="bg-white mx-auto relative flex flex-col gap-4" style={{ width: "794px" }}>
      {pages.map((pageItems, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === pages.length - 1;

        return (
          <div
            key={pageIndex}
            className="relative overflow-hidden shrink-0 pdf-page-canvas"
            style={{
              width: "794px",
              height: "1123px",
              pageBreakAfter: "always",
              pageBreakInside: "avoid",
            }}
          >
            {/* Background Image */}
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

            {/* Top Left Black Blur Sphere */}
            <div
              className="absolute z-0 bg-black rounded-full pointer-events-none"
              style={{
                width: "600px",
                height: "600px",
                left: "-200px",
                top: "-200px",
                filter: "blur(120px)",
                opacity: 1,
              }}
            />

            {/* Bottom Left Black Blur Sphere */}
            <div
              className="absolute z-0 bg-black rounded-full pointer-events-none"
              style={{
                width: "600px",
                height: "600px",
                left: "-200px",
                bottom: "-200px",
                filter: "blur(120px)",
                opacity: 1,
              }}
            />

            {/* Content Container */}
            <div className="relative z-10 pt-12 px-16 flex flex-col h-full pb-[100px]">
              {isFirstPage && (
                <div className="mb-4">
                  <Image
                    src="/Assets/Invoice/Logo.png"
                    alt="Solustream Logo"
                    width={140}
                    height={38}
                    priority
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </div>
              )}

              {isFirstPage && (
                <div className="flex justify-between items-start mb-4 w-full pl-1 pr-2">
                  <div className="flex flex-col">
                    <h1 className="text-[44px] tracking-tight text-white font-black leading-none mb-1">
                      INVOICE
                    </h1>
                    <p className="text-xl text-white font-light tracking-widest mb-6">
                      {invoiceNumber ? `${invoiceNumber}` : "SOLU26-027"}
                    </p>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white font-bold text-lg leading-none">Invoice to:</h3>
                      <p className="text-white text-[22px] font-semibold leading-none">{clientName || "Raka Sanjaya"}</p>
                      <p className="text-white font-light text-base leading-none">{clientPhone || "087777964411"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex gap-2 items-baseline mb-4">
                      <p className="text-white font-bold text-base mb-0 leading-tight">Total Due:</p>
                    </div>
                    <h2 className="text-4xl text-white font-light mb-6 leading-none">
                      Rp{grandTotal.toLocaleString("id-ID")}
                    </h2>
                    <div className="flex flex-col items-end gap-1">
                      <h3 className="text-white font-bold text-lg leading-none">Payment to:</h3>
                      <p className="text-white text-[22px] font-normal leading-none">{bankAccount || "8415886230 (BCA)"}</p>
                      <p className="text-white font-light text-base leading-none">{bankUser || "Pascal Arya Nugroho"}</p>
                    </div>
                  </div>
                </div>
              )}

              {isFirstPage && (() => {
                const today = new Date();
                const formatDate = (date: Date) => {
                  const d = date.getDate().toString().padStart(2, "0");
                  const m = (date.getMonth() + 1).toString().padStart(2, "0");
                  const y = date.getFullYear();
                  return `${d}/${m}/${y}`;
                };
                const invoiceDate = formatDate(today);
                const dueDateObj = new Date(today);
                dueDateObj.setDate(today.getDate() + 4);
                const dueDate = formatDate(dueDateObj);

                return (
                  <div className="flex gap-12 mb-6 pl-1">
                    <div className="flex flex-col gap-1">
                      <p className="text-white font-bold text-base leading-none">Invoice Date:</p>
                      <p className="text-white font-light leading-none">{invoiceDate}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-white font-bold text-base leading-none">Due Date:</p>
                      <p className="text-white font-light leading-none">{dueDate}</p>
                    </div>
                  </div>
                );
              })()}

              {!isFirstPage && <div className="mt-8" />}

              {/* Invoice Table */}
              <div className="flex-grow pl-1 pr-2">
                <div
                  className="grid grid-cols-12 gap-x-2 px-8 py-1.5 rounded-[15px] border border-white mb-2 items-center"
                  style={{ backgroundColor: "#D9D9D91A" }}
                >
                  <div className="col-span-1 text-white text-base font-bold">No.</div>
                  <div className="col-span-11 grid grid-cols-11 gap-x-2">
                    <div className="col-span-5 text-white text-base font-bold pl-2">Item Description</div>
                    <div className="col-span-2 text-white text-base font-bold text-right">Rate</div>
                    <div className="col-span-1 text-white text-base font-bold text-center">Qty</div>
                    <div className="col-span-3 text-white text-base font-bold text-right pr-4">Total</div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-2">
                  {pageItems.map((item, index) => {
                    const globalIndex = pages.slice(0, pageIndex).reduce((acc, p) => acc + p.length, 0) + index;
                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-12 gap-x-2 px-6 py-2.5 rounded-[12px] border border-white items-center bg-transparent"
                      >
                        <div className="col-span-1 text-white font-normal text-base">
                          {String(globalIndex + 1).padStart(2, "0")}
                        </div>
                        <div className="col-span-11 grid grid-cols-11 gap-x-2 items-center">
                          <div className="col-span-5 pl-2 overflow-hidden">
                            <p className="text-white font-normal text-base leading-tight mb-0 break-words line-clamp-1">{item.name || "Item Name"}</p>
                            <p className="text-white/80 font-normal text-[13px] leading-tight break-words line-clamp-1">{item.description || "Item description"}</p>
                          </div>
                          <div className="col-span-2 text-white font-normal text-right text-base">
                            Rp{item.rate.toLocaleString("id-ID")}
                          </div>
                          <div className="col-span-1 text-white font-normal text-center text-base">
                            {item.quantity}
                          </div>
                          <div className="col-span-3 text-white font-normal text-right pr-4 text-base">
                            Rp{(item.rate * item.quantity).toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isLastPage && (
                  <div className="flex flex-col items-end mb-2 mt-0 gap-1.5">
                    <div
                      className="flex justify-between items-center px-6 py-1.5 rounded-[10px] border border-white/30 w-[300px]"
                      style={{ backgroundColor: "#D9D9D90D" }}
                    >
                      <span className="text-white/70 font-medium text-xs">Subtotal</span>
                      <span className="text-white/70 font-normal text-sm pr-4">
                        Rp{subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div
                        className="flex justify-between items-center px-6 py-1.5 rounded-[10px] border border-white/30 w-[300px]"
                        style={{ backgroundColor: "#D9D9D90D" }}
                      >
                        <span className="text-white/70 font-medium text-xs">Discount</span>
                        <span className="text-white/70 font-normal text-sm pr-4">
                          -Rp{discountAmount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                    <div
                      className="flex justify-between items-center px-6 py-2 rounded-[12px] border border-white w-[300px]"
                      style={{ backgroundColor: "#D9D9D91A" }}
                    >
                      <span className="text-white font-bold text-sm">Grand Total</span>
                      <span className="text-white font-normal text-base pr-4">
                        Rp{grandTotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}

                {isLastPage && !overflowTnC && (
                  <div className="grid grid-cols-2 gap-12 mt-6 items-start">
                    <div>
                      <h3 className="text-white font-bold text-base mb-1">Syarat dan Ketentuan</h3>
                      <p className="text-white font-normal text-sm leading-tight max-w-[280px]">
                        Pembayaran yang sudah dibayarkan dan/atau sudah disetujui sebelumnya tidak dapat di-refund <br /><br />
                        Pengerjaan dan/atau book alat dilakukan setelah DP
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <div className="flex flex-col items-start w-[160px]">
                        <h3 className="text-white font-bold text-base mb-2">Best Regards,</h3>
                        <div className="border border-white/50 rounded-[12px] w-full h-[100px] bg-transparent mb-2 relative overflow-hidden flex items-center justify-center p-2">
                          <Image
                            src="/Assets/Invoice/Signature.png"
                            alt="Signature"
                            fill
                            className="object-contain p-2"
                            unoptimized
                          />
                        </div>
                        <p className="text-white font-normal text-base">Daffa Yordan</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-3 -left-[20px] w-[834px]">
              <Image
                src="/Assets/Invoice/Footer.png"
                alt="Footer"
                width={834}
                height={79}
                className="w-full h-auto object-bottom"
                unoptimized
              />
            </div>
          </div>
        );
      })}

      {/* Overflow TnC Page */}
      {overflowTnC && (
        <div
          className="relative overflow-hidden shrink-0 pdf-page-canvas"
          style={{ width: "794px", height: "1123px", pageBreakInside: "avoid" }}
        >
          <div className="absolute inset-x-0 bottom-0 z-0 h-[1123px] w-full pointer-events-none">
            <Image src="/Assets/Invoice/Background.png" alt="Background" fill className="object-cover object-bottom" priority unoptimized />
          </div>
          <div className="absolute z-0 bg-black rounded-full pointer-events-none" style={{ width: "600px", height: "600px", left: "-200px", top: "-200px", filter: "blur(300px)", opacity: 1 }} />
          <div className="absolute z-0 bg-black rounded-full pointer-events-none" style={{ width: "600px", height: "600px", left: "-200px", bottom: "-200px", filter: "blur(300px)", opacity: 1 }} />

          <div className="relative z-10 pt-20 px-[68px] flex flex-col h-full pb-[100px]">
            <div className="grid grid-cols-2 gap-12 mt-10 items-start">
              <div>
                <h3 className="text-white font-bold text-base mb-1">Syarat dan Ketentuan</h3>
                <p className="text-white font-normal text-sm leading-tight max-w-[280px]">
                  Pembayaran yang sudah dibayarkan dan/atau sudah disetujui sebelumnya tidak dapat di-refund <br /><br />
                  Pengerjaan dan/atau book alat dilakukan setelah DP
                </p>
              </div>
              <div className="flex justify-end">
                <div className="flex flex-col items-start w-[160px]">
                  <h3 className="text-white font-bold text-base mb-2">Best Regards,</h3>
                  <div className="border border-white/50 rounded-[12px] w-full h-[100px] bg-transparent mb-2 relative overflow-hidden flex items-center justify-center p-2">
                    <Image src="/Assets/Invoice/Signature.png" alt="Signature" fill className="object-contain p-2" unoptimized />
                  </div>
                  <p className="text-white font-normal text-base">Daffa Yordan</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 -left-[20px] w-[834px]">
            <Image src="/Assets/Invoice/Footer.png" alt="Footer" width={834} height={79} className="w-full h-auto object-bottom" unoptimized />
          </div>
        </div>
      )}
    </div>
  );
}
