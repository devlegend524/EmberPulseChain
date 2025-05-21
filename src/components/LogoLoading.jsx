import React from "react";

export default function LogoLoading({ title = "Loading..." }) {
  return (
    <div className="fixed z-[99999] top-0 left-0 w-full h-screen flex justify-center items-center bg-black/80">
      <div className="bg-secondary rounded-lg p-12">
        <img
          src="/assets/loading.webp"
          alt="Loading..."
          className="w-[150px] h-[150px] bounce_animation relative z-[9999]"
        />
        <p className="text-center">{title}</p>
      </div>
    </div>
  );
}
