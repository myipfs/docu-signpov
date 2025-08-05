
import React from 'react';
import { FileText, Shield, Briefcase, Home, FileCheck, FileSpreadsheet, UserCheck, FileSignature, Users, ShoppingCart, Building, Handshake, Receipt } from 'lucide-react';
import { Template } from '@/types/template';

export const templates: Template[] = [
  {
    id: 'nda-template',
    title: 'Non-Disclosure Agreement',
    description: 'Protect confidential information when sharing with third parties.',
    details: 'This comprehensive NDA template is based on industry standards and covers: (1) Clear definition of what constitutes confidential information (2) Specific exclusions from confidential information (3) Obligations of the receiving party including reasonable care standard (4) Term of confidentiality obligations (5) Return or destruction of confidential materials (6) Remedies for breach including injunctive relief (7) Standard exceptions for legally required disclosures (8) Non-solicitation provisions (9) Governing law and jurisdiction clauses (10) Severability provisions.',
    category: 'legal',
    popular: true,
    icon: <Shield size={20} />
  },
  {
    id: 'employment-contract',
    title: 'Employment Contract',
    description: 'Comprehensive agreement between employer and employee.',
    details: 'Based on standard employment law practices, this contract includes: (1) Detailed job description and responsibilities (2) Compensation structure including base salary, bonuses, and equity if applicable (3) Benefits package details including healthcare, retirement, and paid time off (4) Work schedule and location specifications (5) Confidentiality and intellectual property provisions (6) Non-compete and non-solicitation clauses with reasonable geographic and time limitations (7) Termination conditions including notice periods (8) Severance provisions (9) Dispute resolution process (10) Governing law provisions.',
    category: 'contract',
    popular: true,
    icon: <Briefcase size={20} />
  },
  {
    id: 'rental-agreement',
    title: 'Residential Lease Agreement',
    description: 'Comprehensive lease contract for residential properties.',
    details: 'This standardized lease agreement includes: (1) Property description and permitted use (2) Lease term with specific start and end dates (3) Rent amount, due dates, and acceptable payment methods (4) Security deposit amount and conditions for return (5) Utilities and maintenance responsibilities (6) Tenant alterations and improvements policies (7) Pet policies and associated deposits or fees (8) Rules regarding occupancy limits (9) Entry notice requirements (10) Default and remedies (11) Early termination conditions (12) Renewal terms and rent increase provisions.',
    category: 'agreement',
    popular: true,
    icon: <Home size={20} />
  },
  {
    id: 'service-agreement',
    title: 'Professional Services Agreement',
    description: 'Contract for service providers and clients with clear deliverables.',
    details: 'This service agreement template includes: (1) Detailed scope of services with specific deliverables (2) Project timeline with milestones (3) Payment terms including amount, schedule, and late payment penalties (4) Intellectual property ownership provisions (5) Confidentiality obligations (6) Representations and warranties (7) Limitation of liability clauses (8) Indemnification provisions (9) Termination rights and procedures (10) Change order process (11) Independent contractor relationship clarification (12) Force majeure provisions (13) Insurance requirements (14) Dispute resolution procedures.',
    category: 'agreement',
    popular: false,
    icon: <FileCheck size={20} />
  },
  {
    id: 'invoice-template',
    title: 'Professional Invoice Template',
    description: 'Comprehensive invoice with payment terms and itemization.',
    details: 'This professional invoice template includes: (1) Company name, logo, and contact information (2) Client details including billing address (3) Unique invoice number for tracking (4) Issue date and payment due date (5) Detailed itemization of products/services with descriptions, quantities, rates, and subtotals (6) Subtotal, tax calculations, and grand total (7) Payment terms and late payment policies (8) Accepted payment methods with relevant account details (9) Thank you message (10) Notes section for special instructions (11) Professional footer with business registration numbers and terms.',
    category: 'form',
    popular: true,
    icon: <FileSpreadsheet size={20} />
  },
  {
    id: 'consent-form',
    title: 'Informed Consent Form',
    description: 'Detailed consent form for medical, research, or participation purposes.',
    details: 'This comprehensive consent form includes: (1) Clear introduction explaining the purpose (2) Detailed explanation of procedures or activities (3) Specific risks and discomforts disclosure (4) Benefits section (5) Alternative procedures or options when applicable (6) Confidentiality and privacy protections (7) Compensation details if relevant (8) Emergency contact procedures (9) Voluntary participation statement and right to withdraw (10) Contact information for questions (11) Statement of consent with signature blocks (12) Witness signature section when required (13) Revocation section if applicable.',
    category: 'form',
    popular: false,
    icon: <UserCheck size={20} />
  },
  {
    id: 'consulting-agreement',
    title: 'Consulting Services Agreement',
    description: 'Contract for independent consultants with scope and deliverables.',
    details: 'This consulting agreement includes: (1) Detailed description of consulting services (2) Term of engagement with start and end dates (3) Compensation structure including hourly/daily rates or project fees (4) Payment schedule and invoicing procedures (5) Expense reimbursement policies (6) Deliverables and acceptance criteria (7) Independent contractor status clarification (8) Confidentiality provisions (9) Work product ownership (10) Non-solicitation clauses (11) Termination rights (12) Representations and warranties (13) Limitation of liability (14) Insurance requirements (15) Non-exclusivity provisions (16) Dispute resolution procedures.',
    category: 'contract',
    popular: true,
    icon: <FileSignature size={20} />
  },
  {
    id: 'partnership-agreement',
    title: 'General Partnership Agreement',
    description: 'Framework for business partnerships with profit sharing and roles.',
    details: 'This partnership agreement template includes: (1) Partnership name, purpose, and principal place of business (2) Term of partnership and conditions for dissolution (3) Capital contributions of each partner (4) Profit and loss allocation percentages (5) Distribution of profits schedule (6) Management structure and voting rights (7) Partner authority limitations (8) Meeting requirements and procedures (9) Bookkeeping and accounting procedures (10) Bank accounts and financial controls (11) Admission of new partners process (12) Voluntary and involuntary withdrawal provisions (13) Death or incapacity provisions (14) Dispute resolution procedures (15) Non-compete and confidentiality provisions.',
    category: 'legal',
    popular: false,
    icon: <Briefcase size={20} />
  },
  {
    id: 'equipment-lease',
    title: 'Equipment Lease Agreement',
    description: 'Contract for leasing business equipment with maintenance terms.',
    details: 'This equipment lease agreement includes: (1) Detailed equipment description with serial numbers and condition (2) Lease term with commencement and expiration dates (3) Lease payment amounts and schedule (4) Security deposit requirements (5) Delivery, installation, and acceptance procedures (6) Equipment use restrictions (7) Maintenance and repair responsibilities (8) Insurance requirements (9) Risk of loss provisions (10) Warranty provisions (11) Default and remedies (12) Early termination options (13) End of lease options (purchase, renewal, return) (14) Equipment return conditions (15) Indemnification clauses (16) Assignment restrictions.',
    category: 'agreement',
    popular: false,
    icon: <FileText size={20} />
  },
  // Additional Contract Templates
  {
    id: 'software-development-contract',
    title: 'Software Development Contract',
    description: 'Comprehensive contract for software development projects with IP rights and deliverables.',
    details: 'This software development contract includes: (1) Detailed project scope and technical specifications (2) Development milestones with acceptance criteria (3) Payment schedule tied to deliverables (4) Intellectual property ownership provisions (5) Source code escrow arrangements (6) Warranty and support provisions (7) Change order procedures (8) Testing and quality assurance requirements (9) Performance specifications (10) Data security and confidentiality (11) Third-party software licensing (12) Termination and transition procedures.',
    category: 'contract',
    popular: true,
    icon: <FileText size={20} />
  },
  {
    id: 'freelance-contract',
    title: 'Freelance Work Contract',
    description: 'Independent contractor agreement for freelance projects with payment and deliverable terms.',
    details: 'This freelance contract covers: (1) Detailed scope of work and deliverables (2) Project timeline with key milestones (3) Payment terms and rates (4) Intellectual property ownership (5) Revision and approval process (6) Independent contractor status (7) Confidentiality provisions (8) Communication protocols (9) Termination clauses (10) Dispute resolution procedures.',
    category: 'contract',
    popular: true,
    icon: <Users size={20} />
  },
  {
    id: 'vendor-supply-contract',
    title: 'Vendor Supply Contract',
    description: 'Contract for ongoing vendor supply relationships with quality and delivery terms.',
    details: 'This vendor supply contract includes: (1) Product specifications and quality standards (2) Pricing structure and payment terms (3) Delivery schedules and logistics (4) Volume commitments and forecasting (5) Quality control and inspection procedures (6) Warranty and defect resolution (7) Risk allocation and insurance (8) Compliance and regulatory requirements (9) Termination and transition provisions (10) Performance metrics and penalties.',
    category: 'contract',
    popular: false,
    icon: <ShoppingCart size={20} />
  },
  {
    id: 'subcontractor-agreement',
    title: 'Subcontractor Agreement',
    description: 'Agreement for subcontractor services with scope, payment, and liability terms.',
    details: 'This subcontractor agreement covers: (1) Detailed work scope and specifications (2) Performance standards and quality requirements (3) Payment terms and invoice procedures (4) Insurance and liability provisions (5) Safety and compliance requirements (6) Independent contractor relationship (7) Indemnification clauses (8) Change order procedures (9) Completion schedules (10) Dispute resolution mechanisms.',
    category: 'contract',
    popular: false,
    icon: <Building size={20} />
  },
  {
    id: 'maintenance-service-contract',
    title: 'Maintenance Service Contract',
    description: 'Ongoing maintenance services contract with response times and service levels.',
    details: 'This maintenance service contract includes: (1) Service scope and equipment coverage (2) Response time commitments (3) Preventive maintenance schedules (4) Emergency service provisions (5) Parts and labor pricing (6) Performance metrics and SLAs (7) Insurance and liability terms (8) Equipment replacement procedures (9) Service reporting requirements (10) Contract renewal options.',
    category: 'contract',
    popular: false,
    icon: <FileCheck size={20} />
  },
  {
    id: 'distribution-agreement',
    title: 'Distribution Agreement',
    description: 'Product distribution contract with territory rights and sales targets.',
    details: 'This distribution agreement covers: (1) Territory and exclusivity rights (2) Product lines and pricing (3) Minimum sales requirements (4) Marketing and promotional support (5) Inventory and ordering procedures (6) Training and technical support (7) Intellectual property protection (8) Performance metrics and reporting (9) Termination and transition procedures (10) Compliance requirements.',
    category: 'agreement',
    popular: false,
    icon: <ShoppingCart size={20} />
  },
  {
    id: 'licensing-agreement',
    title: 'Licensing Agreement',
    description: 'Intellectual property licensing contract with usage rights and royalty terms.',
    details: 'This licensing agreement includes: (1) Licensed intellectual property definition (2) Scope of use and restrictions (3) Territory and field of use (4) Royalty rates and payment terms (5) Quality control standards (6) Reporting and audit rights (7) Infringement protection procedures (8) Termination and reversion rights (9) Improvements and modifications (10) Compliance and regulatory requirements.',
    category: 'agreement',
    popular: true,
    icon: <Shield size={20} />
  },
  {
    id: 'joint-venture-agreement',
    title: 'Joint Venture Agreement',
    description: 'Business collaboration agreement for shared projects and profit distribution.',
    details: 'This joint venture agreement covers: (1) Venture purpose and objectives (2) Partner contributions and responsibilities (3) Profit and loss sharing arrangements (4) Management structure and decision-making (5) Financial reporting and accounting (6) Intellectual property ownership (7) Confidentiality and non-compete provisions (8) Exit strategies and dissolution procedures (9) Dispute resolution mechanisms (10) Regulatory compliance requirements.',
    category: 'agreement',
    popular: false,
    icon: <Handshake size={20} />
  },
  {
    id: 'non-compete-agreement',
    title: 'Non-Compete Agreement',
    description: 'Employee non-compete clause protecting business interests and trade secrets.',
    details: 'This non-compete agreement includes: (1) Restricted activities definition (2) Geographic scope limitations (3) Time period restrictions (4) Consideration and compensation (5) Trade secret protection (6) Customer non-solicitation clauses (7) Employee non-solicitation provisions (8) Reasonableness standards (9) Enforcement procedures (10) Severability provisions.',
    category: 'agreement',
    popular: false,
    icon: <Shield size={20} />
  },
  {
    id: 'roommate-agreement',
    title: 'Roommate Agreement',
    description: 'Comprehensive roommate living arrangement with house rules and responsibilities.',
    details: 'This roommate agreement covers: (1) Rent and utility payment arrangements (2) House rules and quiet hours (3) Guest and visitor policies (4) Cleaning responsibilities and schedules (5) Personal property and common areas (6) Parking arrangements (7) Pet policies (8) Conflict resolution procedures (9) Move-out procedures (10) Emergency contact information.',
    category: 'agreement',
    popular: true,
    icon: <Home size={20} />
  },
  {
    id: 'franchise-agreement',
    title: 'Franchise Agreement',
    description: 'Comprehensive franchise contract with operational standards and fee structures.',
    details: 'This franchise agreement includes: (1) Territory and exclusivity rights (2) Franchise fees and royalty structure (3) Operational standards and procedures (4) Training and support provisions (5) Marketing and advertising requirements (6) Quality control standards (7) Intellectual property licensing (8) Insurance and indemnification (9) Termination and renewal procedures (10) Transfer and assignment rights.',
    category: 'agreement',
    popular: false,
    icon: <Briefcase size={20} />
  },
  // Additional Legal Templates
  {
    id: 'power-of-attorney',
    title: 'Power of Attorney',
    description: 'Legal document granting authority to act on behalf of another person.',
    details: 'This power of attorney document includes: (1) Principal and agent identification (2) Scope of authority granted (3) Specific powers enumeration (4) Effective date and duration (5) Revocation procedures (6) Successor agent provisions (7) Compensation arrangements (8) Record-keeping requirements (9) Third-party acceptance provisions (10) Notarization and witness requirements.',
    category: 'legal',
    popular: true,
    icon: <Shield size={20} />
  },
  {
    id: 'bill-of-sale',
    title: 'Bill of Sale',
    description: 'Legal document for transferring ownership of personal property.',
    details: 'This bill of sale includes: (1) Buyer and seller identification (2) Property description and condition (3) Purchase price and payment terms (4) Transfer date and location (5) Warranty and as-is provisions (6) Lien and encumbrance disclosure (7) Risk of loss provisions (8) Signature and notarization requirements (9) Delivery procedures (10) Legal compliance certifications.',
    category: 'legal',
    popular: true,
    icon: <FileText size={20} />
  },
  {
    id: 'promissory-note',
    title: 'Promissory Note',
    description: 'Legal IOU document for personal or business loans with payment terms.',
    details: 'This promissory note covers: (1) Principal amount and interest rate (2) Payment schedule and due dates (3) Default and acceleration clauses (4) Security and collateral provisions (5) Late payment penalties (6) Prepayment rights and penalties (7) Governing law provisions (8) Maker and payee identification (9) Witness and notarization requirements (10) Collection and attorney fee provisions.',
    category: 'legal',
    popular: false,
    icon: <Receipt size={20} />
  },
  {
    id: 'will-testament',
    title: 'Last Will and Testament',
    description: 'Basic will template for distributing assets and naming beneficiaries.',
    details: 'This will template includes: (1) Testator identification and mental capacity declaration (2) Revocation of prior wills (3) Executor appointment and powers (4) Asset distribution provisions (5) Specific and general bequests (6) Residuary estate distribution (7) Guardian appointments for minors (8) Trust provisions if applicable (9) Funeral and burial instructions (10) Witness and notarization requirements.',
    category: 'legal',
    popular: false,
    icon: <Shield size={20} />
  },
  {
    id: 'cease-desist-letter',
    title: 'Cease and Desist Letter',
    description: 'Legal notice to stop alleged illegal or harmful activities.',
    details: 'This cease and desist letter includes: (1) Identification of the prohibited conduct (2) Legal basis for the demand (3) Evidence of infringement or violation (4) Specific cease and desist demands (5) Deadline for compliance (6) Consequences of non-compliance (7) Request for written confirmation (8) Preservation of rights notice (9) Contact information for response (10) Professional legal tone and formatting.',
    category: 'legal',
    popular: true,
    icon: <Shield size={20} />
  },
  {
    id: 'trademark-license',
    title: 'Trademark License Agreement',
    description: 'License agreement for using registered trademarks with usage guidelines.',
    details: 'This trademark license includes: (1) Trademark identification and registration details (2) Scope of use and permitted products/services (3) Quality control standards and approval procedures (4) Territory and duration limitations (5) Royalty rates and payment terms (6) Marketing and promotional guidelines (7) Infringement protection procedures (8) Termination and reversion rights (9) Indemnification provisions (10) Compliance monitoring requirements.',
    category: 'legal',
    popular: false,
    icon: <Shield size={20} />
  },
  {
    id: 'copyright-assignment',
    title: 'Copyright Assignment Agreement',
    description: 'Document for transferring copyright ownership of creative works.',
    details: 'This copyright assignment covers: (1) Work identification and description (2) Copyright ownership transfer (3) Consideration and payment terms (4) Representations and warranties (5) Moral rights waiver provisions (6) Indemnification clauses (7) Reversion rights if applicable (8) Territory and duration specifications (9) Record-keeping requirements (10) Governing law provisions.',
    category: 'legal',
    popular: false,
    icon: <FileText size={20} />
  },
  {
    id: 'articles-incorporation',
    title: 'Articles of Incorporation',
    description: 'Corporate formation document establishing a new business entity.',
    details: 'These articles of incorporation include: (1) Corporate name and registered office (2) Purpose and business activities (3) Share structure and authorized capital (4) Director and officer provisions (5) Registered agent information (6) Duration and dissolution procedures (7) Amendment procedures (8) Liability limitations (9) Indemnification provisions (10) Filing and compliance requirements.',
    category: 'legal',
    popular: false,
    icon: <Briefcase size={20} />
  },
  // Additional Form Templates
  {
    id: 'medical-consent-form',
    title: 'Medical Consent Form',
    description: 'Authorization form for medical treatment of minors or dependent adults.',
    details: 'This medical consent form includes: (1) Patient identification and medical history (2) Authorized person designation (3) Scope of medical authority (4) Emergency contact information (5) Insurance and payment provisions (6) Allergy and medication alerts (7) Special instructions and restrictions (8) Duration of authorization (9) Revocation procedures (10) Healthcare provider acknowledgment.',
    category: 'form',
    popular: true,
    icon: <UserCheck size={20} />
  },
  {
    id: 'event-registration-form',
    title: 'Event Registration Form',
    description: 'Comprehensive registration form for events, workshops, and conferences.',
    details: 'This event registration form covers: (1) Participant contact information (2) Event selection and pricing options (3) Dietary restrictions and accommodations (4) Emergency contact details (5) Payment information and methods (6) Terms and conditions acceptance (7) Photo and media release (8) Cancellation and refund policies (9) Liability waiver provisions (10) Special requests and comments.',
    category: 'form',
    popular: true,
    icon: <Users size={20} />
  },
  {
    id: 'property-inspection-form',
    title: 'Property Inspection Form',
    description: 'Detailed checklist for property condition assessment and documentation.',
    details: 'This property inspection form includes: (1) Property identification and address (2) Exterior condition assessment (3) Interior room-by-room evaluation (4) Systems and utilities inspection (5) Safety and security features (6) Maintenance and repair needs (7) Photo documentation sections (8) Inspector certification (9) Estimated repair costs (10) Overall condition summary and recommendations.',
    category: 'form',
    popular: false,
    icon: <Building size={20} />
  },
  {
    id: 'employee-evaluation-form',
    title: 'Employee Performance Evaluation',
    description: 'Annual or periodic employee performance review form with rating scales.',
    details: 'This employee evaluation form covers: (1) Employee and supervisor information (2) Performance period and job description (3) Goal achievement assessment (4) Skill and competency ratings (5) Behavioral and attitude evaluation (6) Strengths and areas for improvement (7) Professional development plans (8) Goal setting for next period (9) Overall performance rating (10) Employee and supervisor signatures.',
    category: 'form',
    popular: false,
    icon: <Users size={20} />
  },
  {
    id: 'customer-feedback-form',
    title: 'Customer Feedback Form',
    description: 'Service quality assessment form for gathering customer satisfaction data.',
    details: 'This customer feedback form includes: (1) Service or product identification (2) Overall satisfaction ratings (3) Specific service quality metrics (4) Staff performance evaluation (5) Facility and environment assessment (6) Value for money perception (7) Recommendation likelihood (8) Specific complaints or compliments (9) Improvement suggestions (10) Customer contact information for follow-up.',
    category: 'form',
    popular: true,
    icon: <FileSpreadsheet size={20} />
  },
  {
    id: 'incident-report-form',
    title: 'Incident Report Form',
    description: 'Documentation form for workplace accidents, injuries, or safety incidents.',
    details: 'This incident report form covers: (1) Incident date, time, and location (2) Injured party information (3) Witness identification and statements (4) Incident description and circumstances (5) Injury details and severity (6) Medical treatment provided (7) Supervisor and safety officer notification (8) Contributing factors analysis (9) Corrective actions taken (10) Follow-up requirements and recommendations.',
    category: 'form',
    popular: false,
    icon: <Shield size={20} />
  },
  {
    id: 'application-form-template',
    title: 'General Application Form',
    description: 'Versatile application form for jobs, memberships, or program enrollment.',
    details: 'This application form includes: (1) Personal information and contact details (2) Background and experience sections (3) Education and qualifications (4) References and recommendations (5) Skills and competencies assessment (6) Availability and scheduling preferences (7) Compensation or fee expectations (8) Legal declarations and certifications (9) Signature and date verification (10) Processing and privacy notices.',
    category: 'form',
    popular: true,
    icon: <FileCheck size={20} />
  },
  {
    id: 'survey-questionnaire',
    title: 'Survey Questionnaire',
    description: 'Research survey form for gathering opinions, feedback, and data collection.',
    details: 'This survey questionnaire includes: (1) Introduction and purpose statement (2) Demographics and classification questions (3) Multiple choice and rating scale questions (4) Open-ended response sections (5) Likert scale assessments (6) Conditional logic and skip patterns (7) Data privacy and anonymity notices (8) Estimated completion time (9) Incentive and reward information (10) Contact details for questions or concerns.',
    category: 'form',
    popular: false,
    icon: <FileSpreadsheet size={20} />
  },
  {
    id: 'timesheet-template',
    title: 'Employee Timesheet',
    description: 'Time tracking form for recording work hours, breaks, and project allocation.',
    details: 'This timesheet template covers: (1) Employee identification and pay period (2) Daily time in/out recording (3) Break and lunch time tracking (4) Project and task allocation (5) Overtime and holiday hours (6) Expense and mileage tracking (7) Supervisor approval section (8) Total hours calculation (9) Rate and pay calculations (10) Submission and processing procedures.',
    category: 'form',
    popular: true,
    icon: <FileSpreadsheet size={20} />
  },
  {
    id: 'purchase-order-form',
    title: 'Purchase Order Form',
    description: 'Commercial document for ordering goods or services with detailed specifications.',
    details: 'This purchase order form includes: (1) Vendor and buyer information (2) Product or service specifications (3) Quantity and unit pricing (4) Delivery date and location requirements (5) Payment terms and conditions (6) Quality standards and specifications (7) Return and warranty policies (8) Approval and authorization signatures (9) Special instructions and notes (10) Total cost calculations and tax information.',
    category: 'form',
    popular: false,
    icon: <ShoppingCart size={20} />
  },
  {
    id: 'expense-report-form',
    title: 'Expense Report Form',
    description: 'Business expense documentation for reimbursement and tax purposes.',
    details: 'This expense report form covers: (1) Employee and reporting period information (2) Expense categories and descriptions (3) Date and amount documentation (4) Business purpose justification (5) Receipt attachment requirements (6) Mileage and travel calculations (7) Client and project allocation (8) Supervisor approval workflow (9) Reimbursement processing details (10) Tax deduction classifications.',
    category: 'form',
    popular: true,
    icon: <Receipt size={20} />
  },
  {
    id: 'quality-control-checklist',
    title: 'Quality Control Checklist',
    description: 'Systematic inspection form for ensuring product or service quality standards.',
    details: 'This quality control checklist includes: (1) Product or service identification (2) Quality standards and specifications (3) Inspection criteria and checkpoints (4) Pass/fail evaluation sections (5) Defect identification and classification (6) Corrective action requirements (7) Inspector certification and signatures (8) Documentation and record-keeping (9) Non-conformance reporting procedures (10) Continuous improvement recommendations.',
    category: 'form',
    popular: false,
    icon: <FileCheck size={20} />
  },
  {
    id: 'training-evaluation-form',
    title: 'Training Evaluation Form',
    description: 'Assessment form for evaluating training program effectiveness and participant satisfaction.',
    details: 'This training evaluation form covers: (1) Training program and session details (2) Learning objective achievement assessment (3) Content quality and relevance ratings (4) Instructor performance evaluation (5) Training method effectiveness (6) Material and resource assessment (7) Overall satisfaction ratings (8) Knowledge and skill improvement measurement (9) Implementation and application plans (10) Suggestions for program improvement.',
    category: 'form',
    popular: false,
    icon: <Users size={20} />
  },
  {
    id: 'maintenance-request-form',
    title: 'Maintenance Request Form',
    description: 'Service request form for reporting and tracking maintenance and repair needs.',
    details: 'This maintenance request form includes: (1) Requestor information and contact details (2) Location and equipment identification (3) Problem description and urgency level (4) Preferred service date and time (5) Safety concerns and access requirements (6) Work authorization and approval (7) Cost estimation and budget approval (8) Completion verification and sign-off (9) Quality assessment and satisfaction rating (10) Follow-up and warranty information.',
    category: 'form',
    popular: false,
    icon: <Building size={20} />
  },
  {
    id: 'vendor-registration-form',
    title: 'Vendor Registration Form',
    description: 'Supplier onboarding form for collecting business credentials and capabilities.',
    details: 'This vendor registration form covers: (1) Company information and legal structure (2) Contact details and key personnel (3) Business licenses and certifications (4) Financial information and references (5) Insurance and bonding documentation (6) Product and service capabilities (7) Quality certifications and standards (8) Diversity and sustainability credentials (9) Terms and conditions acceptance (10) Registration approval and activation process.',
    category: 'form',
    popular: false,
    icon: <Briefcase size={20} />
  },
  {
    id: 'loan-agreement',
    title: 'Loan Agreement',
    description: 'Personal or business loan contract with repayment terms and security provisions.',
    details: 'This loan agreement includes: (1) Borrower and lender identification (2) Principal amount and interest rate structure (3) Repayment schedule and payment methods (4) Security and collateral provisions (5) Default and acceleration clauses (6) Late payment penalties and fees (7) Prepayment rights and restrictions (8) Representations and warranties (9) Events of default definition (10) Enforcement and collection procedures (11) Governing law and jurisdiction (12) Insurance and property protection requirements.',
    category: 'legal',
    popular: true,
    icon: <Receipt size={20} />
  },
  {
    id: 'construction-contract',
    title: 'Construction Contract',
    description: 'Comprehensive construction agreement with specifications, timeline, and payment schedule.',
    details: 'This construction contract covers: (1) Project description and specifications (2) Materials and workmanship standards (3) Construction timeline and milestones (4) Payment schedule tied to completion stages (5) Change order procedures and pricing (6) Permit and inspection requirements (7) Insurance and bonding provisions (8) Warranty and defect correction terms (9) Safety and compliance standards (10) Completion and acceptance procedures (11) Dispute resolution mechanisms (12) Lien waiver provisions.',
    category: 'contract',
    popular: true,
    icon: <Building size={20} />
  },
  {
    id: 'social-media-policy',
    title: 'Social Media Policy',
    description: 'Company policy for employee social media use and brand representation guidelines.',
    details: 'This social media policy includes: (1) Purpose and scope of the policy (2) Personal vs. professional social media use (3) Brand representation guidelines (4) Confidentiality and trade secret protection (5) Prohibited content and activities (6) Personal account disclaimers (7) Company account management procedures (8) Crisis communication protocols (9) Monitoring and enforcement procedures (10) Training and awareness requirements (11) Violation consequences and disciplinary actions (12) Policy updates and review schedule.',
    category: 'legal',
    popular: false,
    icon: <Users size={20} />
  },
  {
    id: 'data-processing-agreement',
    title: 'Data Processing Agreement',
    description: 'GDPR-compliant agreement for third-party data processing with privacy safeguards.',
    details: 'This data processing agreement covers: (1) Data controller and processor identification (2) Processing purpose and legal basis (3) Categories of personal data and data subjects (4) Processing instructions and restrictions (5) Technical and organizational security measures (6) Sub-processor authorization and oversight (7) Data subject rights facilitation (8) Data breach notification procedures (9) Cross-border transfer safeguards (10) Audit and inspection rights (11) Contract termination and data deletion (12) Liability and indemnification provisions.',
    category: 'legal',
    popular: true,
    icon: <Shield size={20} />
  },
  {
    id: 'photography-release-form',
    title: 'Photography Release Form',
    description: 'Model release form for commercial use of photographs and images.',
    details: 'This photography release form includes: (1) Model and photographer identification (2) Scope of permitted image use (3) Compensation and consideration terms (4) Commercial vs. editorial use rights (5) Duration of usage rights (6) Territory and media restrictions (7) Credit and attribution requirements (8) Moral rights and personality rights waiver (9) Minor consent and guardian approval (10) Revocation and termination procedures (11) Indemnification and liability provisions (12) Governing law and dispute resolution.',
    category: 'form',
    popular: false,
    icon: <FileText size={20} />
  },
  {
    id: 'business-plan-template',
    title: 'Business Plan Template',
    description: 'Comprehensive business plan framework for startups and established businesses.',
    details: 'This business plan template covers: (1) Executive summary and company overview (2) Market analysis and competitive landscape (3) Products and services description (4) Marketing and sales strategy (5) Operational plan and management structure (6) Financial projections and funding requirements (7) Risk analysis and mitigation strategies (8) Implementation timeline and milestones (9) Exit strategy considerations (10) Appendices with supporting documentation (11) SWOT analysis framework (12) Key performance indicators and metrics.',
    category: 'form',
    popular: true,
    icon: <Briefcase size={20} />
  },
  {
    id: 'website-terms-conditions',
    title: 'Website Terms and Conditions',
    description: 'Legal terms governing website use, user conduct, and service provisions.',
    details: 'These website terms include: (1) Acceptance and modification of terms (2) User eligibility and account requirements (3) Permitted and prohibited uses (4) Intellectual property rights and licensing (5) User-generated content policies (6) Privacy policy integration (7) Service availability and modifications (8) Payment terms and refund policies (9) Limitation of liability and disclaimers (10) Indemnification provisions (11) Termination and suspension procedures (12) Governing law and dispute resolution.',
    category: 'legal',
    popular: true,
    icon: <FileText size={20} />
  }
];

export const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'contract', name: 'Contracts' },
  { id: 'agreement', name: 'Agreements' },
  { id: 'form', name: 'Forms' },
  { id: 'legal', name: 'Legal Documents' }
];
