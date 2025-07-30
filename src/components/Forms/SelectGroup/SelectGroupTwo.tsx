import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

const SelectGroupTwo: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  return (
    <div>
      <Label className="mb-3 block">Select Country</Label>
      <Select value={selectedOption} onValueChange={setSelectedOption}>
        <SelectTrigger className="w-full pl-10">
          <Globe className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Select Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USA">USA</SelectItem>
          <SelectItem value="UK">UK</SelectItem>
          <SelectItem value="Canada">Canada</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectGroupTwo;