const fs = require('fs');
const path = require('path');

const dirs = [
  'src/modules/users/dto',
  'src/modules/roles/dto',
  'src/modules/organizations/dto',
  'src/modules/audit',
  'src/modules/keycloak',
  'src/common/guards',
  'src/common/middlewares',
  'src/common/filters',
  'src/common/decorators',
  'src/config',
  'src/prisma',
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

const files = {
  '.env': `PORT=4003
DATABASE_URL="postgresql://sso_admin:sso_password@localhost:5432/identity_db?schema=public"

KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=sso-demo
KEYCLOAK_CLIENT_ID=admin-cli
KEYCLOAK_CLIENT_SECRET=
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=admin123
`,
  'docker-compose.yml': `version: '3.8'
services:
  identity-db:
    image: postgres:16-alpine
    container_name: identity-db
    environment:
      POSTGRES_USER: sso_admin
      POSTGRES_PASSWORD: sso_password
      POSTGRES_DB: identity_db
    ports:
      - "5433:5432"
    volumes:
      - identity_pgdata:/var/lib/postgresql/data

  identity-service:
    build: .
    container_name: identity-service
    ports:
      - "4003:4003"
    environment:
      - PORT=4003
      - DATABASE_URL=postgresql://sso_admin:sso_password@identity-db:5432/identity_db?schema=public
      - KEYCLOAK_URL=\${KEYCLOAK_URL}
      - KEYCLOAK_REALM=\${KEYCLOAK_REALM}
      - KEYCLOAK_ADMIN_USER=\${KEYCLOAK_ADMIN_USER}
      - KEYCLOAK_ADMIN_PASSWORD=\${KEYCLOAK_ADMIN_PASSWORD}
    depends_on:
      - identity-db

volumes:
  identity_pgdata:
`,
  'Dockerfile': `FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4003
CMD ["npm", "run", "start:prod"]
`,
  'tsconfig.json': `{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}`,
  'nest-cli.json': `{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}`,
  'src/main.ts': `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  app.enableCors();
  
  const port = process.env.PORT || 4003;
  await app.listen(port);
  console.log(\`Identity Service is running on: http://localhost:\${port}\`);
}
bootstrap();
`,
  'src/app.module.ts': `import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { AuditModule } from './modules/audit/audit.module';
import { KeycloakModule } from './modules/keycloak/keycloak.module';
import { PrismaModule } from './prisma/prisma.module';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    KeycloakModule,
    AuditModule,
    UsersModule,
    RolesModule,
    OrganizationsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
`,
  'src/prisma/prisma.service.ts': `import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
`,
  'src/prisma/prisma.module.ts': `import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
`,
  'src/common/middlewares/request-logger.middleware.ts': `import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(\`\${method} \${originalUrl} \${statusCode} - \${userAgent} \${ip}\`);
    });

    next();
  }
}
`,
  'src/common/filters/global-exception.filter.ts': `import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = 
      exception instanceof HttpException 
        ? exception.getStatus() 
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = 
      exception instanceof HttpException 
        ? exception.getResponse() 
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
`,
  'src/common/decorators/roles.decorator.ts': `import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
`,
  'src/common/guards/rbac.guard.ts': `import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // No roles required
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.roles) return false;
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
`,
  'src/modules/audit/audit.service.ts': `import { Injectable } from '@nestjs/common';
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
`,
  'src/modules/audit/audit.module.ts': `import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';

@Module({
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
`,
  'src/modules/audit/audit.controller.ts': `import { Controller, Get } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  getLogs() {
    return this.auditService.getLogs();
  }
}
`,
  'src/modules/keycloak/keycloak.service.ts': `import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakService implements OnModuleInit {
  private readonly logger = new Logger(KeycloakService.name);
  private adminClient: any;
  private KcAdminClient: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Dynamic import to support ESM modules
    const kcModule = await import('@keycloak/keycloak-admin-client');
    this.KcAdminClient = kcModule.default || kcModule.KeycloakAdminClient;
    
    const baseUrl = this.configService.get<string>('KEYCLOAK_URL');
    const realmName = this.configService.get<string>('KEYCLOAK_REALM');
    
    this.adminClient = new this.KcAdminClient({
      baseUrl: baseUrl,
      realmName: realmName,
    });
    
    await this.auth();
  }

  private async auth() {
    try {
      await this.adminClient.auth({
        grantType: 'password',
        clientId: this.configService.get<string>('KEYCLOAK_CLIENT_ID'),
        username: this.configService.get<string>('KEYCLOAK_ADMIN_USER'),
        password: this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD'),
      });
      this.logger.log('Successfully authenticated with Keycloak Admin API');
    } catch (error) {
      this.logger.error('Failed to authenticate with Keycloak', error);
    }
  }

  async createUser(user: any) {
    try {
      await this.adminClient.users.create({
        realm: this.configService.get<string>('KEYCLOAK_REALM'),
        username: user.email,
        email: user.email,
        firstName: user.fullName,
        enabled: true,
        credentials: [{ type: 'password', value: '123456', temporary: true }]
      });
    } catch (error) {
      if (error.response && error.response.status === 409) return;
      this.logger.error('Failed to create user in Keycloak', error);
      throw error;
    }
  }

  async updateUserStatus(email: string, enabled: boolean) {
    try {
      const users = await this.adminClient.users.find({ email });
      if (users.length > 0) {
        await this.adminClient.users.update({ id: users[0].id }, { enabled });
      }
    } catch (error) {
      this.logger.error('Failed to update user status in Keycloak', error);
      throw error;
    }
  }
}
`,
  'src/modules/keycloak/keycloak.module.ts': `import { Module, Global } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';

@Global()
@Module({
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class KeycloakModule {}
`,
  'src/modules/users/dto/create-user.dto.ts': `import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  nik?: string;

  @IsOptional()
  @IsString()
  nip?: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
`,
  'src/modules/users/users.service.ts': `import { Injectable, NotFoundException } from '@nestjs/common';
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

    await this.auditService.log(actor, \`\${status.toLowerCase()}_user\`, user.id);
    return updated;
  }
}
`,
  'src/modules/users/users.controller.ts': `import { Controller, Get, Post, Body, Param, Put, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.usersService.setStatus(id, 'ACTIVE');
  }

  @Patch(':id/disable')
  disable(@Param('id') id: string) {
    return this.usersService.setStatus(id, 'INACTIVE');
  }
}
`,
  'src/modules/users/users.module.ts': `import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
`,
  'src/modules/roles/roles.controller.ts': `import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
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
`,
  'src/modules/roles/roles.module.ts': `import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';

@Module({
  controllers: [RolesController],
})
export class RolesModule {}
`,
  'src/modules/organizations/organizations.controller.ts': `import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
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
`,
  'src/modules/organizations/organizations.module.ts': `import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';

@Module({
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content);
}

console.log('Project structure created successfully!');
