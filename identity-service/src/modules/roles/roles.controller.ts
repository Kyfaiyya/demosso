import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('users/:id/roles')
export class RolesController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async assignRole(@Param('id') userId: string, @Body('roleId') roleId: string) {
    return this.prisma.userRole.create({
      data: { userId, roleId }
    });
  }

  @Delete(':roleId')
  async removeRole(@Param('id') userId: string, @Param('roleId') roleId: string) {
    return this.prisma.userRole.delete({
      where: { userId_roleId: { userId, roleId } }
    });
  }
}
