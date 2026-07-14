import React from "react";

interface TabsComponentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabItems = [
  {
    id: "apartments",
    label: "Apartments",
    icon: "🏠",
  },
  {
    id: "hotels",
    label: "Hotels",
    icon: "🏨",
  },
  {
    id: "rooms",
    label: "Rooms",
    icon: "🛏️",
  },
];

const TabsComponent = ({ activeTab, onTabChange }: TabsComponentProps) => {
  return (
    <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {tabItems.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-4 text-sm font-semibold transition-all duration-200 rounded-md
              ${isActive ? "text-black dark:text-white bg-white dark:bg-gray-700" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"}`}
          >
            {/* Icon */}
            <span className="text-3xl">{tab.icon}</span>

            {/* Label */}
            <span>{tab.label}</span>

            {/* Blue underline only for selected tab */}
            {isActive && (
              <span className="absolute left-0 bottom-0 h-[3px] w-full rounded-full bg-blue-600 dark:bg-blue-500" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabsComponent;
