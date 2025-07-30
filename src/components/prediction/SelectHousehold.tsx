import React from "react";
import SelectGroupOne from "../Forms/SelectGroup/SelectGroupOne";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SelectHouseholdProps {
  cutoffValue: number;
  onCutoffChange: (value: number) => void;
}

const SelectHousehold: React.FC<SelectHouseholdProps> = ({
  cutoffValue,
  onCutoffChange,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Household</CardTitle>
        <p className="text-sm text-gray-600">Adjust the prediction threshold</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:space-x-4 gap-4">
          <div className="md:w-1/2">
            <SelectGroupOne />
          </div>
          <Button className="px-8">
            Random Household
          </Button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Label htmlFor="cutoff-input" className="text-base font-medium">
            Select cutoff probability
          </Label>
          <Input
            id="cutoff-input"
            type="number"
            min={0.1}
            max={0.9}
            step={0.1}
            value={cutoffValue}
            onChange={(e) => onCutoffChange(Number(e.target.value))}
            className="w-full md:w-32"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectHousehold;
