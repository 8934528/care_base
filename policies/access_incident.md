# Access Control and Security Incident Policy

## Purpose

This policy sets out account security rules, access controls, and incident management procedures for CareBase. It protects patient information and guides healthcare employees when security incidents occur.

CareBase operates in the South African healthcare environment in line with POPIA and the National Health Act. CareBase is a software system and does not claim legal certification or automatic regulatory compliance. Employees and administrators must follow these rules in daily operations.

## Employee Account Security

- Every employee must have their own unique CareBase account.
- Sharing accounts or working under another staff member's login is strictly forbidden.
- Employees are accountable for every action performed under their username.
- Users must sign out or lock their workstation whenever they step away.

## User Roles and Permissions

- CareBase assigns permissions based on official job responsibilities.
- Roles include Administrator, Manager, Doctor, Nurse, and Reception/Clerk.
- Users receive access strictly on a need-to-know basis.
- Requests for permission changes must be approved by facility management before being granted.

## Access to Patient Information

- Healthcare staff may only open patient records relevant to their current clinical or administrative tasks.
- Browsing patient records out of curiosity or personal interest is unauthorised access and grounds for disciplinary action.
- All view, edit, and print operations are recorded in the system audit trail.

## Password Protection

- Passwords must be at least 8 characters long and combine letters, numbers, and symbols.
- Passwords must never be written down, stored in plain text, or shared with colleagues or supervisors.
- Default or temporary passwords must be changed immediately upon first login.
- Failed login attempts are limited to prevent automated brute-force attacks.

## Unauthorised Access

- Any attempt to access data or functions outside an employee's assigned role is strictly prohibited.
- Employees who notice that they have access to records or tools outside their scope must notify the administrator immediately.
- System tampering or running unauthorised scripts against CareBase is prohibited.

## Lost or Compromised Accounts

- If an employee suspects their password has been seen or their account compromised, they must report it immediately.
- The administrator must suspend or reset the affected account without delay.
- The user must choose a new strong password before access is restored.

## Reporting Suspicious Activity

- Employees must immediately report suspicious activity to their supervisor and the system administrator.
- Suspicious activity includes:
  - Unexpected login alerts or password reset emails.
  - Changes to patient records not made by authorized staff.
  - Unusual slow-downs or abnormal system errors.
  - Strangers attempting to view computer screens or enter secure clinical areas.

## Data Breaches and Incident Definition

A security incident or data breach occurs when:

- Patient or employee data is lost, stolen, destroyed, or disclosed without authorisation.
- An unauthorised person gains access to CareBase databases, servers, or user accounts.
- Malware, ransomware, or malicious software affects the CareBase environment.

## Security Incident Reporting

- When an incident is discovered, report it immediately to the Facility Information Officer and CareBase Administrator.
- If a data breach involves personal information, the facility must notify the Information Regulator and affected patients in terms of Section 22 of POPIA.

## Incident Investigation

- The administrator and security team must investigate the root cause of the incident.
- Evidence, including server logs, audit logs, and network activity, must be preserved.
- The investigation must determine what data was exposed, which users were involved, and how entry was gained.

## Containment and Recovery

- The team must immediately contain the threat by revoking affected tokens, isolating compromised systems, or resetting credentials.
- Fix vulnerabilities before restoring systems to active production use.
- Verify system integrity and database consistency before resuming full service.

## Recording Security Incidents

- All security incidents must be documented in a central incident register.
- Records must include:
  - Date, time, and description of the event.
  - Data or systems affected.
  - Actions taken to contain and resolve the incident.
  - Corrective measures implemented to prevent recurrence.

## Responsibilities of System Administrators

System administrators must:

- Provision and revoke employee accounts promptly according to staff employment status.
- Keep server software, runtime environments, and dependencies updated with security patches.
- Maintain secure backups and test recovery procedures regularly.
- Monitor audit logs regularly for anomalous access patterns or policy violations.
- Protect database credentials and keep sensitive configuration variables encrypted.
