import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { KeycloakService } from '../keycloak/keycloak.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private keycloakService: KeycloakService,
  ) {}

  async create(dto: CreateUserDto, actor: string = 'system') {
    const user = await this.prisma.user.create({ data: dto });
    
    // Sync to keycloak
    await this.keycloakService.createUser(user);
    
    await this.auditService.log(actor, 'create_user', user.id);
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({ where: { status: { not: 'DELETED' } } });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.status === 'DELETED') throw new NotFoundException('User not found');
    return user;
  }

  async setStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'DELETED', actor: string = 'system') {
    const user = await this.findOne(id);
    const updated = await this.prisma.user.update({
      where: { id },
      data: { status }
    });

    if (status === 'INACTIVE' || status === 'DELETED') {
      await this.keycloakService.updateUserStatus(user.email, false);
    } else if (status === 'ACTIVE') {
      await this.keycloakService.updateUserStatus(user.email, true);
    }

    await this.auditService.log(actor, `${status.toLowerCase()}_user`, user.id);
    return updated;
  }
}
