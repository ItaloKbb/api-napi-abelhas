import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ClerkAuthGuard } from '@/common/guards/clerk-auth.guard';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { z } from 'zod';

const uploadUrlSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.string().default('uploads'),
});

const downloadUrlSchema = z.object({
  key: z.string().min(1),
});

@Controller('storage')
@UseGuards(ClerkAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload-url')
  async getUploadUrl(
    @Body(new ZodValidationPipe(uploadUrlSchema))
    body: z.infer<typeof uploadUrlSchema>,
  ) {
    const key = this.storageService.generateKey(body.folder, body.fileName);
    const url = await this.storageService.getUploadPresignedUrl(
      key,
      body.contentType,
    );
    return { url, key };
  }

  @Post('download-url')
  async getDownloadUrl(
    @Body(new ZodValidationPipe(downloadUrlSchema))
    body: z.infer<typeof downloadUrlSchema>,
  ) {
    const url = await this.storageService.getDownloadPresignedUrl(body.key);
    return { url };
  }
}
