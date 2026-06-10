export default function SettingsView() {
  return (
    <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold tracking-normal">Dashboard settings</h3>
      <p className="mt-1 text-sm text-slate-500">
        Basic admin controls can be connected here when the backend settings API
        is ready.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {["Booking approval", "Listing review", "User verification", "Email alerts"].map(
          (setting) => (
            <label
              key={setting}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4 text-sm font-semibold text-slate-700"
            >
              {setting}
              <input type="checkbox" className="h-5 w-5 accent-slate-950" />
            </label>
          ),
        )}
      </div>
    </section>
  );
}
