import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const SwitcherOne = () => {
  const [enabled, setEnabled] = useState<boolean>(false);

  return (
    <div>
      <Switch
        id="toggle1"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
    </div>
  );
};

export default SwitcherOne;