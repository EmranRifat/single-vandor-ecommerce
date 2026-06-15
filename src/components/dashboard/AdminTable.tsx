// import { ReactNode } from "react";

// type AdminTableProps = {
//   title: string;
//   description: string;
//   columns: string[];
//   rows: Array<Record<string, string | ReactNode>>;
//   statusKey?: string;
// };

// function getStatusClass(status: string) {
//   if (["Published", "Active", "Verified", "Confirmed", "Open"].includes(status)) {
//     return "bg-emerald-50 text-emerald-700";
//   }

//   if (["Pending", "Draft", "High"].includes(status)) {
//     return "bg-amber-50 text-amber-700";
//   }

//   return "bg-slate-100 text-slate-700";
// }

// export default function AdminTable({
//   title,
//   description,
//   columns,
//   rows,
//   statusKey = "status",
// }: AdminTableProps) {
//   return (
//     <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
//       <div className="flex items-center justify-between border-b border-slate-200 p-5">
//         <div>
//           <h3 className="text-lg font-bold tracking-normal">{title}</h3>
//           <p className="mt-1 text-sm text-slate-500">{description}</p>
//         </div>
//         <button
//           type="button"
//           className="hidden h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
//         >
//           View all
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-180 text-left text-sm">
//           <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
//             <tr>
//               {columns.map((column) => (
//                 <th key={column} className="px-5 py-4">
//                   {column}
//                 </th>
//               ))}
//               <th className="px-5 py-4 text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {rows.map((row) => {
//               const rowKey =
//                 typeof row.id === "string" ? row.id : Object.values(row).join("-");

//               return (
//                 <tr key={rowKey}>
//                   {columns.map((column) => {
//                     const key = column === "#" ? "index" : column.toLowerCase();
//                     const value = row[key] ?? "";
//                     const isStatus = key === statusKey;
//                     const isDescription = column === "Description";
//                     const cellClassName = `px-5 py-4 text-slate-600 align-top ${
//                       isDescription ? "max-w-[24rem] break-words" : ""
//                     }`;

//                     return (
//                       <td key={`${rowKey}-${column}`} className={cellClassName}>
//                         {isStatus && typeof value === "string" ? (
//                           <span
//                             className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(value)}`}
//                           >
//                             {value}
//                           </span>
//                         ) : typeof value === "string" ? (
//                           key === "image" ? (
//                             value ? (
//                               <div className="h-12 w-16 overflow-hidden rounded-md border border-slate-200">
//                                 <img
//                                   src={value}
//                                   alt="Listing image"
//                                   className="h-full w-full object-cover"
//                                   onError={(event) => {
//                                     event.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='48' viewBox='0 0 64 48'%3E%3Crect width='64' height='48' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%23717e8a'%3ENo image%3C/text%3E%3C/svg%3E";
//                                   }}
//                                 />
//                               </div>
//                             ) : (
//                               <div className="flex h-12 w-16 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-[10px] text-slate-500">
//                                 No image
//                               </div>
//                             )
//                           ) : (
//                             <span
//                               className={
//                                 column === columns[0]
//                                   ? "font-semibold text-slate-900"
//                                   : isDescription
//                                   ? "whitespace-normal"
//                                   : ""
//                               }
//                             >
//                               {key === "id" && value.length > 20
//                                 ? `${value.slice(0, 20)}...`
//                                 : value}
//                             </span>
//                           )
//                         ) : (
//                           value
//                         )}
//                       </td>
//                     );
//                   })}
//                   <td className="px-5 py-4 text-right">
//                     <div className="flex justify-end gap-2">
//                       <button
//                         type="button"
//                         className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-200"
//                         aria-label={rowKey ? `Approve listing ${rowKey}` : "Approve listing"}
//                       >
//                         Approve
//                       </button>
//                       <button
//                         type="button"
//                         className="rounded-lg bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-200"
//                         aria-label={rowKey ? `Remove listing ${rowKey}` : "Remove listing"}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }
