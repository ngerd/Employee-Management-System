import React from "react";
import Navbar from "../component/Navbar";
import Card from "../component/Card";
import { FaGlobe } from "react-icons/fa";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8 px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          <Card
            Icon={FaGlobe}
            title="Staff"
            subtitle="Lorem ipsum dolor"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, praesentium voluptatem omnis atque culpa repellendus."
            linkText="See details"
            href="#"
          />
          <Card
            Icon={FaGlobe}
            title="Project"
            subtitle="Lorem ipsum dolor"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, praesentium voluptatem omnis atque culpa repellendus."
            linkText="See details"
            href="#"
          />
          <Card
            Icon={FaGlobe}
            title="Timesheet"
            subtitle="Lorem ipsum dolor"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, praesentium voluptatem omnis atque culpa repellendus."
            linkText="See details"
            href="#"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
