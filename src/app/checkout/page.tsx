// "use client";

// import { useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   ArrowLeft,
//   BadgeCheck,
//   CheckCircle2,
//   CreditCard,
//   Home,
//   LockKeyhole,
//   Mail,
//   MapPin,
//   Phone,
//   ShieldCheck,
//   ShoppingBag,
//   Truck,
//   User,
// } from "lucide-react";
// import { clearCart } from "@/lib/slices/cartSlice";
// import type { RootState } from "@/lib/store";

// type CheckoutForm = {
//   customerName: string;
//   customerEmail: string;
//   customerPhone: string;
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
//   paymentMethod: "card" | "cash";
//   cardNumber: string;
//   expiry: string;
//   cvc: string;
//   termsAccepted: boolean;
// };

// const initialForm: CheckoutForm = {
//   customerName: "",
//   customerEmail: "",
//   customerPhone: "",
//   street: "",
//   city: "",
//   state: "",
//   zipCode: "",
//   country: "Bangladesh",
//   paymentMethod: "card",
//   cardNumber: "",
//   expiry: "",
//   cvc: "",
//   termsAccepted: false,
// };

// const formatCurrency = (amount: number) =>
//   new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(amount);

// const getProductTitle = (item: RootState["cart"]["items"][number]) =>
//   item.product.name || item.product.title || "StayNest listing";

// const getProductPrice = (item: RootState["cart"]["items"][number]) =>
//   Number(item.product.price || item.product.price_per_night || 0);

// const getProductStock = (item: RootState["cart"]["items"][number]) =>
//   item.product.stock ?? 1;

// export default function CheckoutPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state: RootState) => state.cart.items);
//   const [formData, setFormData] = useState<CheckoutForm>(initialForm);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [orderNumber, setOrderNumber] = useState("");
//   const [submitError, setSubmitError] = useState("");

//   const pricing = useMemo(() => {
//     const subtotal = cartItems.reduce(
//       (sum, item) => sum + getProductPrice(item) * item.quantity,
//       0,
//     );
//     const serviceFee = Number((subtotal * 0.05).toFixed(2));
//     const shipping = subtotal > 50 || subtotal === 0 ? 0 : 10;
//     const total = Number((subtotal + serviceFee + shipping).toFixed(2));

//     return { subtotal, serviceFee, shipping, total };
//   }, [cartItems]);

//   const updateField = <K extends keyof CheckoutForm>(
//     field: K,
//     value: CheckoutForm[K],
//   ) => {
//     setFormData((current) => ({ ...current, [field]: value }));
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!formData.termsAccepted) {
//       setSubmitError("Please accept the terms and conditions to continue.");
//       return;
//     }

//     try {
//       setSubmitError("");
//       setIsSubmitting(true);
//       await new Promise((resolve) => setTimeout(resolve, 700));
//       setOrderNumber(`ORD-${Date.now().toString().slice(-8)}`);
//       setOrderPlaced(true);
//       dispatch(clearCart());
//     } catch {
//       setSubmitError("Unable to place the order. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (orderPlaced) {
//     return (
//       <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-950">
//         <section className="mx-auto flex max-w-2xl flex-col items-center rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
//           <CheckCircle2 className="h-20 w-20 text-emerald-500" />
//           <h1 className="mt-6 text-3xl font-bold tracking-normal">
//             Order placed successfully
//           </h1>
//           <p className="mt-3 text-slate-600">
//             Thank you, {formData.customerName || "Guest"}. Your order number is{" "}
//             <span className="font-bold text-slate-950">{orderNumber}</span>.
//           </p>
//           <p className="mt-2 text-sm text-slate-500">
//             A confirmation message will be sent to {formData.customerEmail}.
//           </p>

//           <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
//             <button
//               type="button"
//               onClick={() => router.push("/products")}
//               className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
//             >
//               Continue shopping
//             </button>
//             <button
//               type="button"
//               onClick={() => router.push("/")}
//               className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 px-6 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
//             >
//               Go home
//             </button>
//           </div>
//         </section>
//       </main>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-950">
//         <section className="max-w-md text-center">
//           <ShoppingBag className="mx-auto h-20 w-20 text-slate-300" />
//           <h1 className="mt-6 text-3xl font-bold tracking-normal">
//             Your cart is empty
//           </h1>
//           <p className="mt-3 text-slate-600">
//             Add a stay or product to your cart before checking out.
//           </p>
//           <Link
//             href="/products"
//             className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
//           >
//             Browse listings
//           </Link>
//         </section>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-950">
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="flex items-center gap-4">
//           <button
//             type="button"
//             onClick={() => router.back()}
//             className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:bg-slate-100"
//             aria-label="Go back"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <div>
//             <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">
//               Secure checkout
//             </p>
//             <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">
//               Complete your order
//             </h1>
//           </div>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start"
//         >
//           <section className="space-y-6">
//             <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
//               <div className="flex items-center gap-3">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
//                   1
//                 </span>
//                 <h2 className="text-xl font-bold tracking-normal">
//                   Contact information
//                 </h2>
//               </div>

//               <div className="mt-5 grid gap-4 sm:grid-cols-2">
//                 <label className="block text-sm font-semibold text-slate-800">
//                   <span className="mb-2 flex items-center gap-2">
//                     <User className="h-4 w-4 text-slate-500" />
//                     Full name
//                   </span>
//                   <input
//                     required
//                     type="text"
//                     value={formData.customerName}
//                     onChange={(event) =>
//                       updateField("customerName", event.target.value)
//                     }
//                     placeholder="Emran Hasan"
//                     className="h-12 w-full rounded-lg border border-slate-300 px-4 font-normal outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
//                   />
//                 </label>

//                 <label className="block text-sm font-semibold text-slate-800">
//                   <span className="mb-2 flex items-center gap-2">
//                     <Mail className="h-4 w-4 text-slate-500" />
//                     Email address
//                   </span>
//                   <input
//                     required
//                     type="email"
//                     value={formData.customerEmail}
//                     onChange={(event) =>
//                       updateField("customerEmail", event.target.value)
//                     }
//                     placeholder="emran@example.com"
//                     className="h-12 w-full rounded-lg border border-slate-300 px-4 font-normal outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
//                   />
//                 </label>

//                 <label className="block text-sm font-semibold text-slate-800 sm:col-span-2">
//                   <span className="mb-2 flex items-center gap-2">
//                     <Phone className="h-4 w-4 text-slate-500" />
//                     Phone number
//                   </span>
//                   <input
//                     required
//                     type="tel"
//                     value={formData.customerPhone}
//                     onChange={(event) =>
//                       updateField("customerPhone", event.target.value)
//                     }
//                     placeholder="01712345678"
//                     className="h-12 w-full rounded-lg border border-slate-300 px-4 font-normal outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
//                   />
//                 </label>
//               </div>
//             </div>

//             <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
//               <div className="flex items-center gap-3">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
//                   2
//                 </span>
//                 <h2 className="text-xl font-bold tracking-normal">
//                   Billing address
//                 </h2>
//               </div>

//               <div className="mt-5 grid gap-4">
//                 <label className="block text-sm font-semibold text-slate-800">
//                   <span className="mb-2 flex items-center gap-2">
//                     <MapPin className="h-4 w-4 text-slate-500" />
//                     Street address
//                   </span>
//                   <input
//                     required
//                     type="text"
//                     value={formData.street}
//                     onChange={(event) => updateField("street", event.target.value)}
//                     placeholder="House 12, Road 7"
//                     className="h-12 w-full rounded-lg border border-slate-300 px-4 font-normal outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
//                   />
//                 </label>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <input
//                     required
//                     type="text"
//                     value={formData.city}
//                     onChange={(event) => updateField("city", event.target.value)}
//                     placeholder="City"
//                     className="h-12 rounded-lg border border-slate-300 px-4 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
//                   />
//                   <input
//                     required
//                     type="text"
//                     value={formData.state}
//                     onChange={(event) => updateField("state", event.target.value)}
//                     placeholder="State or division"
//                     className="h-12 rounded-lg border border-slate-300 px-4 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
//                   />
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <input
//                     required
//                     type="text"
//                     value={formData.zipCode}
//                     onChange={(event) =>
//                       updateField("zipCode", event.target.value)
//                     }
//                     placeholder="Post code"
//                     className="h-12 rounded-lg border border-slate-300 px-4 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
//                   />
//                   <input
//                     required
//                     type="text"
//                     value={formData.country}
//                     onChange={(event) =>
//                       updateField("country", event.target.value)
//                     }
//                     placeholder="Country"
//                     className="h-12 rounded-lg border border-slate-300 px-4 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-100"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
//               <div className="flex items-center gap-3">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
//                   3
//                 </span>
//                 <h2 className="text-xl font-bold tracking-normal">
//                   Payment method
//                 </h2>
//               </div>

//               <div className="mt-5 grid gap-3 sm:grid-cols-2">
//                 <label
//                   className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
//                     formData.paymentMethod === "card"
//                       ? "border-slate-950 bg-slate-50"
//                       : "border-slate-200 hover:border-slate-400"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     checked={formData.paymentMethod === "card"}
//                     onChange={() => updateField("paymentMethod", "card")}
//                     className="mt-1 h-4 w-4 accent-slate-950"
//                   />
//                   <span>
//                     <span className="flex items-center gap-2 font-bold">
//                       <CreditCard className="h-4 w-4" />
//                       Card payment
//                     </span>
//                     <span className="mt-1 block text-sm text-slate-500">
//                       Demo card checkout
//                     </span>
//                   </span>
//                 </label>

//                 <label
//                   className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
//                     formData.paymentMethod === "cash"
//                       ? "border-slate-950 bg-slate-50"
//                       : "border-slate-200 hover:border-slate-400"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     checked={formData.paymentMethod === "cash"}
//                     onChange={() => updateField("paymentMethod", "cash")}
//                     className="mt-1 h-4 w-4 accent-slate-950"
//                   />
//                   <span>
//                     <span className="flex items-center gap-2 font-bold">
//                       <Home className="h-4 w-4" />
//                       Pay at property
//                     </span>
//                     <span className="mt-1 block text-sm text-slate-500">
//                       Confirm now, pay later
//                     </span>
//                   </span>
//                 </label>
//               </div>

//               {formData.paymentMethod === "card" ? (
//                 <div className="mt-5 overflow-hidden rounded-lg border border-slate-300">
//                   <input
//                     required
//                     inputMode="numeric"
//                     value={formData.cardNumber}
//                     onChange={(event) =>
//                       updateField("cardNumber", event.target.value)
//                     }
//                     placeholder="Card number"
//                     className="h-12 w-full border-b border-slate-300 px-4 outline-none focus:bg-slate-50"
//                   />
//                   <div className="grid grid-cols-2 divide-x divide-slate-300">
//                     <input
//                       required
//                       value={formData.expiry}
//                       onChange={(event) =>
//                         updateField("expiry", event.target.value)
//                       }
//                       placeholder="MM / YY"
//                       className="h-12 px-4 outline-none focus:bg-slate-50"
//                     />
//                     <input
//                       required
//                       inputMode="numeric"
//                       value={formData.cvc}
//                       onChange={(event) => updateField("cvc", event.target.value)}
//                       placeholder="CVC"
//                       className="h-12 px-4 outline-none focus:bg-slate-50"
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mt-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
//                   <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
//                   <p className="text-sm leading-6 text-emerald-950">
//                     Your order will be reserved. The property or store team can
//                     collect payment when the customer arrives.
//                   </p>
//                 </div>
//               )}

//               <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
//                 <input
//                   required
//                   type="checkbox"
//                   checked={formData.termsAccepted}
//                   onChange={(event) =>
//                     updateField("termsAccepted", event.target.checked)
//                   }
//                   className="mt-0.5 h-5 w-5 shrink-0 accent-slate-950"
//                 />
//                 <span>
//                   I agree to the terms, cancellation policy, and payment rules
//                   for this order.
//                 </span>
//               </label>

//               {submitError ? (
//                 <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
//                   {submitError}
//                 </p>
//               ) : null}
//             </div>
//           </section>

//           <aside className="lg:sticky lg:top-24">
//             <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
//               <h2 className="text-xl font-bold tracking-normal">
//                 Order summary
//               </h2>

//               <div className="mt-5 max-h-80 space-y-4 overflow-y-auto pr-1">
//                 {cartItems.map((item) => (
//                   <div
//                     key={item.productId}
//                     className="flex gap-3 rounded-lg border border-slate-100 p-3"
//                   >
//                     <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
//                       <img
//                         src={item.product.image}
//                         alt={getProductTitle(item)}
//                         className="h-full w-full object-cover"
//                       />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <p className="line-clamp-2 text-sm font-bold text-slate-900">
//                         {getProductTitle(item)}
//                       </p>
//                       <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
//                         <span>Qty {item.quantity}</span>
//                         <span className="flex items-center gap-1">
//                           <BadgeCheck className="h-3.5 w-3.5" />
//                           Stock {getProductStock(item)}
//                         </span>
//                       </div>
//                       <p className="mt-2 text-sm font-bold">
//                         {formatCurrency(getProductPrice(item) * item.quantity)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm">
//                 <div className="flex justify-between gap-4 text-slate-600">
//                   <span>Subtotal</span>
//                   <span className="font-semibold text-slate-950">
//                     {formatCurrency(pricing.subtotal)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between gap-4 text-slate-600">
//                   <span>Service fee</span>
//                   <span className="font-semibold text-slate-950">
//                     {formatCurrency(pricing.serviceFee)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between gap-4 text-slate-600">
//                   <span>Delivery</span>
//                   <span className="font-semibold text-slate-950">
//                     {pricing.shipping === 0
//                       ? "Free"
//                       : formatCurrency(pricing.shipping)}
//                   </span>
//                 </div>
//                 {pricing.subtotal < 50 ? (
//                   <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs font-semibold text-sky-800">
//                     Add {formatCurrency(50 - pricing.subtotal)} more for free
//                     delivery.
//                   </div>
//                 ) : null}
//                 <div className="flex justify-between gap-4 border-t border-slate-200 pt-4 text-lg font-bold">
//                   <span>Total</span>
//                   <span>{formatCurrency(pricing.total)}</span>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
//               >
//                 {formData.paymentMethod === "card" ? (
//                   <LockKeyhole className="h-4 w-4" />
//                 ) : (
//                   <Truck className="h-4 w-4" />
//                 )}
//                 {isSubmitting
//                   ? "Placing order..."
//                   : `Place order ${formatCurrency(pricing.total)}`}
//               </button>

//               <p className="mt-4 text-center text-xs leading-5 text-slate-500">
//                 This checkout is ready for UI testing. Connect a real order API
//                 later from `lib/queries.ts`.
//               </p>
//             </div>
//           </aside>
//         </form>
//       </div>
//     </main>
//   );
// }
