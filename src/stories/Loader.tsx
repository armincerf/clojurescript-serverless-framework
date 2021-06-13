import React, { HTMLAttributes } from "react";

export interface LoaderProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Text string above loader
   */
  title: string;
}

/**
 * Primary UI component for user interaction
 */
 export const Loader: React.FC<LoaderProps> = ({ title }) => {
  return (
    <div id="loading-screen" className="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50">
  <span className="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0">
    <i className="fas fa-circle-notch fa-spin fa-5x"></i>
    {title}
  </span>
</div>
  );
};