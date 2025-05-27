import React from 'react';
import { cn } from '../../utils/cn';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

const Section: React.FC<SectionProps> = ({ 
  children, 
  className,
  title,
  description 
}) => {
  return (
    <section className={cn('py-12', className)}>
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && (
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;