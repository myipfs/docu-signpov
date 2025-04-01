
import React from 'react';

interface TemplatePageHeaderProps {
  categoryFilter: string;
}

const TemplatePageHeader: React.FC<TemplatePageHeaderProps> = ({ categoryFilter }) => {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold mb-4">Document Templates</h1>
      <p className="text-foreground/70 max-w-3xl">
        Browse our collection of professional document templates. Customize and use these templates 
        for your business needs, legal agreements, contracts, and more.
      </p>
    </div>
  );
};

export default TemplatePageHeader;
