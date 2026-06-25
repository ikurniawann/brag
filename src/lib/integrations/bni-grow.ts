export type ExternalMemberRecord = {
  externalId: string;
  name: string;
  email: string;
  company?: string;
  classification?: string;
};

export type ExternalVisitorRecord = {
  externalId: string;
  invitedByExternalMemberId: string;
  name: string;
  classification?: string;
  visitDate: string;
  attendanceStatus: "invited" | "confirmed" | "attended" | "cancelled";
};

export interface BniGrowIntegration {
  listMembers(): Promise<ExternalMemberRecord[]>;
  listVisitors(params: { from: string; to: string }): Promise<ExternalVisitorRecord[]>;
}

export class NoopBniGrowIntegration implements BniGrowIntegration {
  async listMembers() {
    return [];
  }

  async listVisitors() {
    return [];
  }
}

export function getBniGrowIntegration(): BniGrowIntegration {
  return new NoopBniGrowIntegration();
}
