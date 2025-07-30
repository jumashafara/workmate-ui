import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxTwoProps {
  label: string;
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckboxTwo: React.FC<CheckboxTwoProps> = ({
  label,
  initialChecked = false,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(initialChecked);

  useEffect(() => {
    setIsChecked(initialChecked);
  }, [initialChecked]);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
    if (onChange) {
      onChange(checked);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Label
        htmlFor={`checkbox-${label}`}
        className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </Label>
      <Checkbox
        id={`checkbox-${label}`}
        checked={isChecked}
        onCheckedChange={handleChange}
      />
    </div>
  );
};

export default CheckboxTwo;