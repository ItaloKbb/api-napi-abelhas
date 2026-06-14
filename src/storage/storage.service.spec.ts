import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';

const mockConfigService = {
  get: jest.fn((key: string, defaultValue?: unknown) => {
    const config: Record<string, string> = {
      MINIO_ENDPOINT: 'localhost',
      MINIO_PORT: '9000',
      MINIO_ACCESS_KEY: 'minioadmin',
      MINIO_SECRET_KEY: 'minioadmin',
      MINIO_BUCKET: 'napi-abelhas',
      MINIO_USE_SSL: 'false',
    };
    return config[key] ?? defaultValue;
  }),
};

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  describe('generateKey', () => {
    it('should generate a valid storage key', () => {
      const key = service.generateKey('reports', 'my-report.pdf');
      expect(key).toMatch(/^reports\/\d+-[a-f0-9]{8}-my-report\.pdf$/);
    });

    it('should sanitize folder name', () => {
      const key = service.generateKey('reports/2024', 'file.pdf');
      expect(key).toMatch(/^reports_2024\/\d+-[a-f0-9]{8}-file\.pdf$/);
    });

    it('should sanitize file name', () => {
      const key = service.generateKey('reports', 'my report (final)!.pdf');
      expect(key).toMatch(/^reports\/\d+-[a-f0-9]{8}-my_report__final__\.pdf$/);
    });

    it('should handle files without extension', () => {
      const key = service.generateKey('docs', 'readme');
      expect(key).toMatch(/^docs\/\d+-[a-f0-9]{8}-readme$/);
    });

    it('should generate unique keys for same inputs', () => {
      const key1 = service.generateKey('reports', 'file.pdf');
      const key2 = service.generateKey('reports', 'file.pdf');
      // keys should be unique due to random component
      expect(key1).not.toBe(key2);
    });
  });
});
