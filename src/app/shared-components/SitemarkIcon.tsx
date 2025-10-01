import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import Image from 'next/image';
import PERITAR from '../../../public/PERITAR.png';

export default function SitemarkIcon() {
  return (
    <Image alt='logo' src={PERITAR} width={210} height={50} />
  );
}
