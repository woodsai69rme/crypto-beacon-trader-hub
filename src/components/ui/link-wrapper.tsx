
import React from 'react';
import { Link } from 'react-router-dom';

interface LinkWrapperProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

const LinkWrapper: React.FC<LinkWrapperProps> = ({
  to,
  children,
  className = '',
  activeClassName = '',
  exact = false,
  ...rest
}) => {
  return (
    <Link 
      to={to} 
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default LinkWrapper;
