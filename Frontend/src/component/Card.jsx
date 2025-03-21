import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ Icon, title, subtitle, description, linkText, href }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(href + " clicked");
    navigate("/" + href);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative block w-full sm:w-54 aspect-square cursor-pointer"
    >
      <span className="absolute inset-0 border-2 rounded-2xl border-dashed border-black"></span>

      <div className="relative flex h-full w-full flex-col justify-end border-2 rounded-2xl border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
        <div className="p-3 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0">
          {Icon ? (
            <Icon
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          ) : (
            <div>No Icon Provided</div>
          )}
          <h2 className="mt-3 text-lg font-bold">{title}</h2>
        </div>

        <div className="absolute p-3 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100">
          <h3 className="text-lg font-medium">{subtitle}</h3>
          <p className="mt-2 text-xs">{description}</p>
          <p className="mt-3 font-bold">{linkText}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
