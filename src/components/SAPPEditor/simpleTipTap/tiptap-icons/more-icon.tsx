import * as React from 'react';

export const MoreIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        width="34px"
        height="34px"
        viewBox="0 0 24 24"
        fill="#000"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <circle cx="12" cy="6" r="1.5" fill="#000"></circle>
          <circle cx="12" cy="12" r="1.5" fill="#000"></circle>
          <circle cx="12" cy="18" r="1.5" fill="#000"></circle>
        </g>
      </svg>
    );
  },
);

MoreIcon.displayName = 'MoreIcon';
