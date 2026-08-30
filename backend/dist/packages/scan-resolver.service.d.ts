import { PrismaService } from '../prisma/prisma.service.js';
export type ResolvedScanTarget = {
    kind: 'AWB' | 'PACKAGE' | 'BAG' | 'MANIFEST' | 'HUB' | 'UNKNOWN';
    shipmentId?: string;
    packageId?: string;
    bagId?: string;
    manifestId?: string;
    hubId?: string;
};
export declare class ScanResolverService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resolve(value: string): Promise<ResolvedScanTarget>;
}
