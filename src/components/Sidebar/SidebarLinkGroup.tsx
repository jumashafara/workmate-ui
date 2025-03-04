import { ReactNode, useState } from 'react';
import { ListItem } from '@mui/material';

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
}

const SidebarLinkGroup = ({
  children,
  activeCondition,
}: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <ListItem disablePadding sx={{ display: 'block' }}>{children(handleClick, open)}</ListItem>;
};

export default SidebarLinkGroup;
