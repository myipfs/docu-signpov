
import { Template } from '@/types/template';

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
