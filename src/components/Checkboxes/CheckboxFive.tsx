import { useState } from "react";

interface CheckboxFiveProps {
  label: string; // The text for the label
  initialChecked?: boolean; // Default checked state (optional)
  onChange?: (checked: boolean) => void; // Callback function when state changes (optional)
  colorChecked?: string; // Custom color when checked (optional)
  colorUnchecked?: string; // Custom color when unchecked (optional)
}

const CheckboxFive: React.FC<CheckboxFiveProps> = ({
  label,
  initialChecked = false,
  onChange,
  colorChecked = "bg-green-500", // Default to green when checked
  colorUnchecked = "bg-gray-500", // Default to gray when unchecked
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(initialChecked);

  const handleChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState); // Pass the updated state to the parent
    }
  };

  return (
    <div>
      <label
        htmlFor="checkboxLabel"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabel"
            className="sr-only"
            checked={isChecked}
            onChange={handleChange}
          />
          <div
            className={`box mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
              isChecked ? "!border-4" : "border-primary"
            } ${isChecked ? colorChecked : colorUnchecked}`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default CheckboxFive;
