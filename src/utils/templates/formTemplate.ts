
import { Template } from '@/types/template';

/**
 * Generate form template
 */
export const generateFormTemplate = (template: Template): string => {
  return `FORM: ${template.title.toUpperCase()}

[ORGANIZATION NAME]
[ORGANIZATION ADDRESS]
[CITY, STATE ZIP]
[PHONE]
[EMAIL]

DATE: [DATE]

PERSONAL INFORMATION:
Full Name: _______________________________
Address: ________________________________
City, State, ZIP: _________________________
Phone: _________________________________
Email: _________________________________
Date of Birth: ___________________________

ADDITIONAL INFORMATION:
[FIELD 1]: ________________________________
[FIELD 2]: ________________________________
[FIELD 3]: ________________________________
[FIELD 4]: ________________________________
[FIELD 5]: ________________________________

CERTIFICATION:
I certify that the information provided above is true and accurate to the best of my knowledge.

Signature: _______________________________
Date: ___________________________________

OFFICE USE ONLY:
Received by: ____________________________
Date: __________________________________
Reference Number: _______________________

${template.details}`;
};
