import { ArrowLeft, ArrowRight } from "lucide-react"

const TransactionsTable = ({
  transactions = [],
  page,
  totalPages,
  onNext,
  onPrev,
}) => {
  return (
    <section className="glass-panel surface-highlight relative overflow-hidden rounded-[2rem] p-5 sm:p-6 lg:p-8">
      <div className="absolute left-[-2rem] top-16 h-28 w-28 rounded-full bg-indigo-400/10 blur-[70px]" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-500">
            Activity stream
          </p>
          <h3 className="mt-2 font-['Outfit'] text-2xl font-semibold text-white">
            Recent Transactions
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            A cleaner read of the latest entries across income and expenses.
          </p>
        </div>
        <span className="premium-chip inline-flex w-fit items-center rounded-full px-3 py-1 text-sm text-slate-300">
          Page {page} of {totalPages}
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="relative mt-8 rounded-[1.7rem] border border-dashed border-white/10 bg-white/[0.035] px-6 py-12 text-center">
          <p className="text-lg font-semibold text-white">No transactions yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Add your first income or expense to start building insights.
          </p>
        </div>
      ) : (
        <>
          <div className="relative mt-8 hidden grid-cols-[0.8fr_1.1fr_1fr_0.8fr_0.9fr] gap-4 border-b border-white/[0.08] px-4 pb-4 text-[11px] font-black uppercase tracking-[0.24em] text-slate-500 md:grid">
            <div>Date</div>
            <div>Title</div>
            <div>Category</div>
            <div>Type</div>
            <div className="text-right">Amount</div>
          </div>

          <div className="relative mt-5 space-y-3">
            {transactions.map((transaction) => {
              const isIncome = transaction.amount > 0
              const date = new Date(transaction.date)
              const amount = Math.abs(transaction.amount || 0)

              return (
                <div
                  key={transaction._id}
                  className="grid gap-4 rounded-[1.6rem] border border-white/[0.08] bg-white/[0.045] px-4 py-4 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.065] md:grid-cols-[0.8fr_1.1fr_1fr_0.8fr_0.9fr] md:items-center"
                >
                  <div className="md:text-sm">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 md:hidden">
                      Date
                    </p>
                    <p className="text-sm text-slate-300">
                      {date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 md:hidden">
                      Title
                    </p>
                    <p className="truncate font-semibold text-white">{transaction.title || "Untitled"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 md:hidden">
                      Category
                    </p>
                    <p className="text-sm text-slate-300">{transaction.category || "Uncategorized"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 md:hidden">
                      Type
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] ${
                        isIncome
                          ? "bg-emerald-400/12 text-emerald-200"
                          : "bg-rose-400/12 text-rose-200"
                      }`}
                    >
                      {isIncome ? "Income" : "Expense"}
                    </span>
                  </div>

                  <div className="md:text-right">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 md:hidden">
                      Amount
                    </p>
                    <p className={`font-semibold ${isIncome ? "text-emerald-200" : "text-rose-200"}`}>
                      {isIncome ? "+" : "-"}₹{amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="relative mt-8 flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              Swipeable cards on mobile, full table rhythm on larger screens.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={onPrev}
                disabled={page === 1}
                className="premium-button inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              <button
                onClick={onNext}
                disabled={page === totalPages}
                className="premium-button inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-400 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default TransactionsTable
