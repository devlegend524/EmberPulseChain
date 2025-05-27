import React from "react";
import { socials } from "config";
import moment from "moment";
export default function Footer() {
  return (
    <footer className="flex justify-around items-center absolute bottom-0 w-full mb-2 border-t border-[#18181b] shadow-md">
      <div className="flex text-sm md:text-md mt-1">
        @{moment().format("YYYY")} EMBER Finance{" "}
        <span className="font-semibold mx-2">( v1.0 )</span> All Rights
        Reserved.
      </div>
      <div className="hidden md:flex gap-4">
        {socials.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              href={item.href}
              key={index}
              className={`p-3 flex items-center gap-2 hover:text-gray-400`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon />
              {item.name}
            </a>
          );
        })}
      </div>
    </footer>
  );
}
