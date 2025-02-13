import React from "react";
import SelectGroupOne from "../Forms/SelectGroup/SelectGroupOne";

interface SelectHouseholdProps {
  cutoffValue: number;
  onCutoffChange: (value: number) => void;
}

const SelectHousehold: React.FC<SelectHouseholdProps> = ({
  cutoffValue,
  onCutoffChange,
}) => {
  return (
    <div className="border border-gray-300 rounded-sm shadow-lg bg-white">
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-4 rounded-sm text-gray-700">
        <h2 className="text-xl font-bold mb-2 w-full">Select Household</h2>
        <p className="">Adjust the prediction threshold</p>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:space-x-3 p-6">
        <div className="md:w-1/2">
          <SelectGroupOne />
        </div>
        <button className="inline-flex items-center justify-center bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
          Random Household
        </button>
      </div>
      <div className="flex flex-col">
        <div className="slider-container flex flex-row px-6 pb-6 justify-between">
          <h2 className="text-center px-3">Select cutoff probability</h2>
          <input
            type="number"
            min={0.1}
            max={0.9}
            step={0.1}
            value={cutoffValue}
            onChange={(e) => onCutoffChange(Number(e.target.value))}
            className="p-2 border border-gray-400 outline-none rounded-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectHousehold;
