
import { Template } from '@/types/template';

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
