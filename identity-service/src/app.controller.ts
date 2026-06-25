import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      name: 'Identity Service',
      version: '1.0.0',
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
