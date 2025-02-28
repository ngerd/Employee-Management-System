import React, { useState, useRef, useEffect, useContext } from "react";
import Card from "../component/Card";
import { FileUser, SquareChartGantt, CalendarRange } from "lucide-react"; // Importing new icons
import { Employee } from "../context/ContextProvider";

function Home() {
  const {isadmin, setisadmin} = useContext(Employee);
  console.log(isadmin)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8 px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {/* Staff Card */}
          {isadmin == "true" && 
          <Card
            Icon={FileUser}
            title="Staff"
            subtitle="Lorem ipsum dolor"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, praesentium voluptatem omnis atque culpa repellendus."
            linkText="See details"
            href="staff"
          />}
          
          {/* Project Card */}
          <Card
            Icon={SquareChartGantt}
            title="Project"
            subtitle="Lorem ipsum dolor"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, praesentium voluptatem omnis atque culpa repellendus."
            linkText="See details"
            href="project"
          />
          {/* Timesheet Card */}
          <Card
            Icon={CalendarRange}
            title="Timesheet"
            subtitle="Lorem ipsum dolor"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, praesentium voluptatem omnis atque culpa repellendus."
            linkText="See details"
            href="timesheet"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
