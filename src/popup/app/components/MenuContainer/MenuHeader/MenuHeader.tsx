import { styled } from '@mui/material/styles';

const MenuHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...(theme.mixins.toolbar as any),
  justifyContent: 'flex-end',
}));

export default MenuHeader;
