import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const endpoint = configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = configService.get<number>('MINIO_PORT', 9000);
    const accessKey = configService.get<string>(
      'MINIO_ACCESS_KEY',
      'minioadmin',
    );
    const secretKey = configService.get<string>(
      'MINIO_SECRET_KEY',
      'minioadmin',
    );
    const useSSL =
      configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    this.bucket = configService.get<string>('MINIO_BUCKET', 'napi-abelhas');

    const protocol = useSSL ? 'https' : 'http';

    this.s3Client = new S3Client({
      endpoint: `${protocol}://${endpoint}:${port}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true,
    });
  }

  async getUploadPresignedUrl(
    key: string,
    contentType: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async getDownloadPresignedUrl(
    key: string,
    expiresIn = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    await this.s3Client.send(command);
  }

  generateKey(folder: string, fileName: string): string {
    const timestamp = Date.now();
    const randomSuffix = randomBytes(4).toString('hex');
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9\-_]/g, '_');
    const lastDot = fileName.lastIndexOf('.');
    const baseName = lastDot !== -1 ? fileName.slice(0, lastDot) : fileName;
    const extension = lastDot !== -1 ? fileName.slice(lastDot) : '';
    const sanitizedBase = baseName.replace(/[^a-zA-Z0-9\-_]/g, '_');
    const sanitizedExt = extension.replace(/[^a-zA-Z0-9.]/g, '');
    return `${sanitizedFolder}/${timestamp}-${randomSuffix}-${sanitizedBase}${sanitizedExt}`;
  }
}
