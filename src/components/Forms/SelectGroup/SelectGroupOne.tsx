import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectGroupOne: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  return (
    <Select value={selectedOption} onValueChange={setSelectedOption}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Household" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="KLR-123">KLR-123</SelectItem>
        <SelectItem value="KLA-123">KLA-123</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectGroupOne;