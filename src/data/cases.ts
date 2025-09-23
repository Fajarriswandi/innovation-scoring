import { faker } from "@faker-js/faker";

export type CaseStatus = "Open" | "Pending" | "Resolved" | "Escalated" | "Closed";

export interface CaseItem {
  id: string;
  caseId: string;
  title: string;
  slaTimer: string;
  status: CaseStatus;
  profileImage: string;
}

const suspiciousTitles: string[] = [
  "Suspicious Login from Outside UAE",
  "Multiple Failed Login Attempts Detected",
  "Login from Unrecognized Device – Outside UAE",
  "Unusual Account Access Location: Europe",
  "Alert: Sign-in from Asia Region",
  "Suspicious VPN Access Attempt",
  "Account Login Outside Business Hours",
  "Possible Compromised Credentials – Middle East Access",
  "Failed MFA Verification from Abroad",
  "Unauthorized Login Trial from Africa Region",
  "Repeated Login Attempts from Different Countries",
  "Unusual Browser Fingerprint Detected",
  "High Risk Login Pattern – Outside UAE",
  "Alert: Account Access via Proxy Server",
  "Potential Credential Stuffing from Overseas IP",
];

export const cases: CaseItem[] = Array.from({ length: 15 }, () => ({
  id: faker.string.uuid(),
  caseId: `#${faker.number.int({ min: 100000, max: 999999 })}`,
  title: faker.helpers.arrayElement(suspiciousTitles),
  slaTimer: `${faker.number.int({ min: 1, max: 59 })}m ${faker.number.int({ min: 1, max: 59 })}s`,
  status: faker.helpers.arrayElement<CaseStatus>([
    "Open",
    "Pending",
    "Resolved",
    "Escalated",
    "Closed",
  ]),
  profileImage: faker.image.avatar(),
}));