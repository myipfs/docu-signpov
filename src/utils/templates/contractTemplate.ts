
import { Template } from '@/types/template';

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
