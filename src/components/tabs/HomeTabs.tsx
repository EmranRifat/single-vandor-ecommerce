// import React from 'react';
// import {Tabs} from "@heroui/react";

// const HomeTabs = () => {
//     return (
//         <div>
//                <Tabs className="w-full max-w-md" variant="secondary">
//       <Tabs.ListContainer>
//         <Tabs.List aria-label="Options">
//           <Tabs.Tab id="overview">
//             Overview
//             <Tabs.Indicator />
//           </Tabs.Tab>
//           <Tabs.Tab id="analytics">
//             Analytics
//             <Tabs.Indicator />
//           </Tabs.Tab>
//           <Tabs.Tab id="reports">
//             Reports
//             <Tabs.Indicator />
//           </Tabs.Tab>
//         </Tabs.List>
//       </Tabs.ListContainer>
//       <Tabs.Panel className="pt-4" id="overview">
//         <p>View your project overview and recent activity.</p>
//       </Tabs.Panel>
//       <Tabs.Panel className="pt-4" id="analytics">
//         <p>Track your metrics and analyze performance data.</p>
//       </Tabs.Panel>
//       <Tabs.Panel className="pt-4" id="reports">
//         <p>Generate and download detailed reports.</p>
//       </Tabs.Panel>
//     </Tabs>
//         </div>
//     );
// };

// export default HomeTabs;
"use client";

import { Button } from "@heroui/react";

export default function TestHeroButton() {
  return (
    <div className="p-6">
      <Button>HeroUI Button</Button>
    </div>
  );
}