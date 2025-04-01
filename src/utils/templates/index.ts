
import { Template } from '@/types/template';
import { generateLegalTemplate } from './legalTemplate';
import { generateContractTemplate } from './contractTemplate';
import { generateAgreementTemplate } from './agreementTemplate';
import { generateFormTemplate } from './formTemplate';

/**
 * Generate appropriate template content based on template type
 */
export const generateTemplateContent = (template: Template): string => {
  if (!template) return '';
  
  // Generate appropriate content based on template type
  const currentDate = new Date().toLocaleDateString();
  
  let content = `# ${template.title}\n`;
  content += `# Generated on: ${currentDate}\n\n`;
  content += `${template.description}\n\n`;
  
  // Generate specific content based on template category
  switch(template.category) {
    case 'legal':
      content += generateLegalTemplate(template);
      break;
    case 'contract':
      content += generateContractTemplate(template);
      break;
    case 'agreement':
      content += generateAgreementTemplate(template);
      break;
    case 'form':
      content += generateFormTemplate(template);
      break;
    default:
      content += template.details;
  }
  
  return content;
};

export { 
  generateLegalTemplate,
  generateContractTemplate,
  generateAgreementTemplate,
  generateFormTemplate
};
