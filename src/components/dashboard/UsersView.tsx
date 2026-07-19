
import { useState } from "react";
import { GetAllUsersResponse } from "@/lib/types/types";
import AdminTable from "./AdminTable";

const PER_PAGE = 5;

export default function UsersView() {




  return (
    <div className="mt-8">
      <AdminTable
      />
    </div>
  );
}
