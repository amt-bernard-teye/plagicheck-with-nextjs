"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { UserTabs } from "@/lib/enum/user-tab.enum";
import BulkUpload from "../bulk-upload";
import UserDetails from "@/components/organisms/user-details/user-details";
import { Department } from "@/lib/types/department.type";
import { Lecturer } from "@/lib/types/lecturer.type";
import { Student } from "@/lib/types/student.type";


type ManageUsersInteractivityProps = {
  departments: Department[];
  lecturers: Lecturer[];
  lecturerCount: number;
  students: Student[];
  studentCount: number;
}

export function ManageUsersInteractivity({departments, lecturers, lecturerCount, students, studentCount}: ManageUsersInteractivityProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<UserTabs>(UserTabs.LECTURER);

  function handleBulkPageNavigation() {
    const params = new URLSearchParams();
    params.set("action", "bulk");
    router.replace(`/dashboard/manage-users?${params.toString()}`);
  }

  function handleBackNavigation() {
    router.replace("/dashboard/manage-users");
  }

  let action = searchParams.get("action");
  let isBulkPage = action ? action === "bulk" : false;

  return (
    <>
      {!isBulkPage 
        ? (
          <UserDetails
            departments={departments}
            activeTab={activeTab}
            onSetActiveTab={setActiveTab}
            onNavigateToBulkPane={() => handleBulkPageNavigation()}
            paginatedLecturers={lecturers}
            lecturerCount={lecturerCount}
            studentCount={studentCount}
            paginatedStudents={students} />
        )
        : (
          <BulkUpload
            entity={activeTab}
            onReturn={() => handleBackNavigation()} />
        )
      }
    </>
  );
}