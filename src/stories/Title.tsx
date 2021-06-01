import React from 'react';
import PropTypes from 'prop-types';

/**
 * Primary UI component for user interaction
 */
export const Title = ({ primary, backgroundColor, size, label, ...props }) => {
  const mode = primary ?  'bg-primary' : 'text-secondary';
  return (
    <h1
      className={['storybook-title', `storybook-title--${size}`, mode].join(' ')}
      style={backgroundColor && { backgroundColor }}
      {...props}
    >
      {label}
    </h1>
  );
};

Title.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the title be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Title contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Title.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: 'medium',
  onClick: undefined,
};
