import React, { HTMLAttributes } from 'react';

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * True to make text color primary
   */
  primary?: boolean;
  /**
   * Title contents
   */
  label: string;
}

/**
 * Primary UI component for user interaction
 */
export const Title: React.FC<TitleProps> = ({
  primary = false,
  label,
  ...props
}) => {
  const mode = primary ? "text-primary" : "dark:text-white";
  return (
    <h1
      className={"font-extralight " + mode}
      {...props}
    >
      {label}
    </h1>
  );
};
