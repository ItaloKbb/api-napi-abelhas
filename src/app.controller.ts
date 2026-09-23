import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async health() {
    const timestamp = new Date().toISOString();

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        timestamp,
        checks: { database: 'down' },
        message: 'Database service unavailable',
      });
    }

    return {
      status: 'ok',
      timestamp,
      checks: { database: 'up' },
    };
  }
}
