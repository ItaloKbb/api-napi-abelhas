import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { PrismaService } from '@/prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  const prisma = { $queryRaw: jest.fn() };

  beforeEach(async () => {
    prisma.$queryRaw.mockReset();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return status ok when the database is available', async () => {
      prisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

      const result = await appController.health();

      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
      expect(result.checks.database).toBe('up');
    });

    it('should return service unavailable when the database is down', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('connection failed'));

      await expect(appController.health()).rejects.toBeInstanceOf(
        ServiceUnavailableException,
      );
    });
  });
});
