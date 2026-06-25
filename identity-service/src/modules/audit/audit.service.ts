import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(actor: string, action: string, target: string) {
    return this.prisma.auditLog.create({
      data: { actor, action, target },
    });
  }

  async getLogs() {
    return this.prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' } });
  }
}
