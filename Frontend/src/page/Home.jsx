import React, { useState, useRef, useEffect, useContext } from "react";
import Card from "../component/Card";
import { FileUser, SquareChartGantt, CalendarRange } from "lucide-react"; // Importing new icons
import { Employee } from "../context/ContextProvider";

function Home() {
  const { isadmin } = useContext(Employee);
  console.log("isadmin:" + isadmin);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8 px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {isadmin && (
            <Card
              Icon={FileUser}
              title="Customer"
              subtitle="Manage customer"
              description="Oversee customer details"
              linkText="See details"
              href="customer"
            />
          )}

          {isadmin && (
            <Card
              Icon={FileUser}
              title="Staff"
              subtitle="Manage team members and roles"
              description="Oversee staff details, assign responsibilities, and manage access levels to ensure smooth collaboration within the organization."
              linkText="See details"
              href="staff"
            />
          )}

          <Card
            Icon={SquareChartGantt}
            title="Project"
            subtitle="Track and manage projects"
            description="Monitor project progress, track key milestones, and streamline workflows to improve team efficiency and project outcomes."
            linkText="See details"
            href="project"
          />

          <Card
            Icon={CalendarRange}
            title="Timesheet"
            subtitle="Record and review working hours"
            description="Track employee attendance, log working hours, and ensure accurate timesheet management for improved payroll accuracy and productivity."
            linkText="See details"
            href="timesheet"
          />

        </div>
      </div>
    </div>
  );
}

export default Home;