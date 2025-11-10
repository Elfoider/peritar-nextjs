import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PERITAR Logo"
      {...props}
    >
        <g clipPath="url(#clip0_105_2)">
            <text 
                fontFamily="sans-serif"
                fontSize="24"
                fontWeight="bold"
                fill="hsl(var(--foreground))"
                x="10" 
                y="28">
                PERITAR
            </text>
        </g>
        <defs>
            <clipPath id="clip0_105_2">
                <rect width="120" height="40" rx="8"/>
            </clipPath>
        </defs>
    </svg>
  );
}
