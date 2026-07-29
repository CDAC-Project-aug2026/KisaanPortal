import { downloadInvoicePDF } from "../utils/invoice";

function InvoiceModal({ data, onClose, onContinue }) {
  const b = data.breakdown;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xl font-bold">🚜 KisaanPortal</p>
              <p className="text-green-100 text-sm mt-0.5">
                Invoice / Payment Receipt
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">{data.invoiceNumber}</p>
              <p className="text-green-100">{data.dateTime}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Status badge */}
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-semibold px-4 py-1.5 rounded-full text-sm">
              ✅ {data.status}
            </span>
          </div>

          {/* Customer + equipment */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-5">
            <div>
              <p className="text-gray-400 text-xs uppercase font-semibold mb-1">
                Billed To
              </p>
              <p className="font-semibold text-gray-800">{data.customerName}</p>
              <p className="text-gray-500">{data.customerEmail}</p>
              <p className="text-gray-500">User ID #{data.userId}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase font-semibold mb-1">
                Equipment
              </p>
              <p className="font-semibold text-gray-800">{data.equipmentName}</p>
              <p className="text-gray-500">{data.location}</p>
              <p className="text-gray-500">
                {data.startDate} → {data.endDate} ({data.rentalDays} day(s))
              </p>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-5">
            <div className="bg-gray-50 px-4 py-2 font-semibold text-gray-700 text-sm">
              Price Breakdown
            </div>
            <div className="p-4 space-y-2 text-sm">
              {b ? (
                <>
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>₹{b.basePrice}</span>
                  </div>
                  {b.discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Rental Discount</span>
                      <span>- ₹{Number(b.discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST</span>
                    <span>₹{b.gst}</span>
                  </div>
                  {b.membershipType && (
                    <div className="flex justify-between text-green-700">
                      <span>Membership ({b.membershipType})</span>
                      <span>- ₹{b.membershipDiscount || 0}</span>
                    </div>
                  )}
                  {b.couponCode && (
                    <div className="flex justify-between text-green-700">
                      <span>Coupon ({b.couponCode})</span>
                      <span>- ₹{b.couponDiscount || 0}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <span>₹{data.finalAmount}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold text-green-700">
                <span>Total Paid</span>
                <span>₹{data.finalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment details */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm mb-6 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-semibold">{data.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-semibold">{data.transactionId}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => downloadInvoicePDF(data)}
              className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition"
            >
              ⬇ Download PDF
            </button>
            <button
              onClick={onContinue || onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition"
            >
              {onContinue ? "Continue" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;
