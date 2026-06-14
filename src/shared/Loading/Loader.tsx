import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="bg-opacity-80 fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-transparent">
      <div className="border-bl-700 h-16 w-16 animate-spin rounded-full border-t-4 border-solid"></div>
      <p className="mt-4 text-lg text-gray-700">در حال بارگذاری...</p>
    </div>
  );
};

export default Loader;