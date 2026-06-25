import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.organization.findMany();
  }

  @Post()
  create(@Body() dto: { name: string; description?: string }) {
    return this.prisma.organization.create({ data: dto });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: { name?: string; description?: string }) {
    return this.prisma.organization.update({
      where: { id },
      data: dto
    });
  }
}
