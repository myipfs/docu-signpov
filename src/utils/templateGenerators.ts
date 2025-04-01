
/**
 * Utility functions for generating template content based on different document types
 */
import { Template } from '@/types/template';

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

/**
 * Generate legal document template
 */
export const generateLegalTemplate = (template: Template): string => {
  return `LEGAL DOCUMENT: ${template.title.toUpperCase()}

THIS DOCUMENT is effective as of [DATE]

BETWEEN:
[PARTY A NAME], with an address at [PARTY A ADDRESS]
("Party A")

AND:
[PARTY B NAME], with an address at [PARTY B ADDRESS]
("Party B")

WHEREAS:
1. [Insert relevant background]
2. [Insert purpose of agreement]

NOW THEREFORE in consideration of the mutual covenants contained herein and other good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the parties agree as follows:

1. DEFINITIONS
   1.1 "[Term]" means [definition].
   1.2 "[Term]" means [definition].

2. RIGHTS AND OBLIGATIONS
   2.1 [Party A] shall [obligation].
   2.2 [Party B] shall [obligation].

3. TERM AND TERMINATION
   3.1 This Agreement shall commence on [START DATE] and continue until [END DATE], unless terminated earlier in accordance with this Agreement.
   3.2 Either party may terminate this Agreement by providing [NOTICE PERIOD] written notice to the other party.

4. CONFIDENTIALITY
   4.1 Each party acknowledges that it may receive confidential information from the other party.
   4.2 Each party agrees to maintain the confidentiality of all such information.

5. GOVERNING LAW
   5.1 This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

6. SIGNATURES
   6.1 This Agreement may be executed in counterparts.
   6.2 Electronic signatures shall be deemed to be original signatures.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

[PARTY A NAME]
By: ____________________________
Name: 
Title: 
Date: 

[PARTY B NAME]
By: ____________________________
Name: 
Title: 
Date: 

${template.details}`;
};

/**
 * Generate contract template
 */
export const generateContractTemplate = (template: Template): string => {
  return `CONTRACT: ${template.title.toUpperCase()}

EFFECTIVE DATE: [DATE]

PARTIES:
1. [CONTRACTOR NAME], with an address at [CONTRACTOR ADDRESS] ("Contractor")
2. [CLIENT NAME], with an address at [CLIENT ADDRESS] ("Client")

SERVICES:
The Contractor shall provide the following services to the Client:
1. [Describe service 1]
2. [Describe service 2]
3. [Describe service 3]

COMPENSATION:
1. The Client shall pay the Contractor [AMOUNT] per [HOUR/DAY/WEEK/MONTH/PROJECT].
2. Payment shall be made within [NUMBER] days of receiving an invoice from the Contractor.
3. The Contractor shall submit invoices [WEEKLY/MONTHLY/UPON COMPLETION].

TERM:
1. This Contract shall commence on [START DATE] and continue until [END DATE].
2. Either party may terminate this Contract by providing [NOTICE PERIOD] written notice.

INTELLECTUAL PROPERTY:
1. All intellectual property created by the Contractor in connection with the Services shall belong to the Client.
2. The Contractor shall not use the Client's intellectual property for any purpose other than performing the Services.

CONFIDENTIALITY:
1. The Contractor shall not disclose any confidential information of the Client to any third party.
2. This obligation shall survive the termination of this Contract.

SIGNATURES:

CLIENT:
Signature: _______________________
Name: 
Title: 
Date: 

CONTRACTOR:
Signature: _______________________
Name: 
Title: 
Date: 

${template.details}`;
};

/**
 * Generate agreement template
 */
export const generateAgreementTemplate = (template: Template): string => {
  return `AGREEMENT: ${template.title.toUpperCase()}

THIS AGREEMENT is made and entered into as of [DATE] ("Effective Date")

BETWEEN:
[PARTY A], with an address at [ADDRESS] ("Party A")
AND
[PARTY B], with an address at [ADDRESS] ("Party B")

RECITALS:
A. [Background information]
B. [Purpose of agreement]

AGREEMENT:

1. PURPOSE
   1.1 The purpose of this Agreement is to [describe purpose].

2. TERMS
   2.1 [Party A] agrees to [obligation].
   2.2 [Party B] agrees to [obligation].
   2.3 The term of this Agreement shall be [DURATION].

3. CONSIDERATION
   3.1 In consideration for [service/item], [Party] shall pay [amount] to [Party].
   3.2 Payment shall be made [payment terms].

4. REPRESENTATIONS AND WARRANTIES
   4.1 Each party represents and warrants that it has the full right and authority to enter into this Agreement.
   4.2 [Other representations and warranties]

5. TERMINATION
   5.1 This Agreement may be terminated by either party upon [NOTICE PERIOD] written notice.
   5.2 [Other termination provisions]

6. MISCELLANEOUS
   6.1 This Agreement constitutes the entire understanding between the parties.
   6.2 This Agreement shall be governed by the laws of [JURISDICTION].
   6.3 Any disputes arising from this Agreement shall be resolved through [DISPUTE RESOLUTION METHOD].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

[PARTY A]
By: ____________________________
Name: 
Title: 
Date: 

[PARTY B]
By: ____________________________
Name: 
Title: 
Date: 

${template.details}`;
};

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
