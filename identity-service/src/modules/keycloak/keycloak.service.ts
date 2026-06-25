import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakService implements OnModuleInit {
  private readonly logger = new Logger(KeycloakService.name);
  private adminClient: any;
  private KcAdminClient: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Dynamic import to support ESM modules
    const kcModule = (await import('@keycloak/keycloak-admin-client')) as any;
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
