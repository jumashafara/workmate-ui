import { useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CheckboxFiveProps {
  label: string;
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
  colorChecked?: string;
  colorUnchecked?: string;
}

const CheckboxFive: React.FC<CheckboxFiveProps> = ({
  label,
  initialChecked = false,
  onChange,
  colorChecked = "bg-green-500",
  colorUnchecked = "bg-gray-500",
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(initialChecked);

  const handleChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <input
          type="checkbox"
          id="checkboxLabel"
          className="sr-only"
          checked={isChecked}
          onChange={handleChange}
        />
        <div
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border cursor-pointer transition-all",
            isChecked ? "border-4" : "border border-primary",
            isChecked ? colorChecked : colorUnchecked
          )}
          onClick={handleChange}
        >
          <div className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent" />
        </div>
      </div>
      <Label
        htmlFor="checkboxLabel"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        onClick={handleChange}
      >
        {label}
      </Label>
    </div>
  );
};

export default CheckboxFive;