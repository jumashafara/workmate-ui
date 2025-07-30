import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const SwitcherTwo = () => {
  const [enabled, setEnabled] = useState<boolean>(false);

  return (
    <div>
      <Switch
        id="toggle2"
        checked={enabled}
        onCheckedChange={setEnabled}
        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
      />
    </div>
  );
};

export default SwitcherTwo;