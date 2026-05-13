import Link from "next/link";
import { navItems } from "./items";
import { usePathname } from "next/navigation";


const MenuItem = () => {
    const pathname = usePathname();
  return (
    <div className="flex items-center justify-center gap-10  ">
         <nav className="max-w-7xl mx-auto text-center p-4 items-center gap-10 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex flex-col items-center justify-center text-sm font-medium transition ${
                  isActive ? "text-black" : "text-gray-500 hover:text-black"
                }`}
              >
                {item.badge && (
                  <span className="absolute -top-3 rounded-full bg-blue-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                )}

                <span className="text-2xl">{item.icon}</span>

                <span className="mt-1">{item.title}</span>

                {isActive && (
                  <span className="absolute -bottom-2 h-0.75 w-full rounded-full bg-black" />
                )}
              </Link>
            );
          })}
        </nav>
       </div>
  );
};

export default MenuItem;