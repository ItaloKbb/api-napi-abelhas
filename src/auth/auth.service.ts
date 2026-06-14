import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';

export interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string; id: string }>;
    first_name?: string;
    last_name?: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private configService: ConfigService) {}

  verifyWebhook(
    payload: string,
    headers: Record<string, string>,
  ): ClerkWebhookEvent {
    const webhookSecret = this.configService.get<string>(
      'CLERK_WEBHOOK_SECRET',
    );
    if (!webhookSecret) {
      throw new UnauthorizedException('Webhook secret not configured');
    }

    const wh = new Webhook(webhookSecret);
    try {
      const event = wh.verify(payload, headers) as ClerkWebhookEvent;
      return event;
    } catch {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }

  handleWebhookEvent(event: ClerkWebhookEvent): void {
    const { type, data } = event;
    const email = data.email_addresses?.[0]?.email_address ?? 'unknown';
    const name = [data.first_name, data.last_name].filter(Boolean).join(' ');

    switch (type) {
      case 'user.created':
        this.logger.log(
          `User created — id: ${data.id}, email: ${email}, name: ${name}`,
        );
        break;
      case 'user.updated':
        this.logger.log(
          `User updated — id: ${data.id}, email: ${email}, name: ${name}`,
        );
        break;
      case 'user.deleted':
        this.logger.log(`User deleted — id: ${data.id}`);
        break;
      case 'organization.created':
        this.logger.log(`Organization created — id: ${data.id}`);
        break;
      case 'organization.updated':
        this.logger.log(`Organization updated — id: ${data.id}`);
        break;
      case 'organization.deleted':
        this.logger.log(`Organization deleted — id: ${data.id}`);
        break;
      case 'organizationMembership.created':
        this.logger.log(`Organization membership created — id: ${data.id}`);
        break;
      case 'organizationMembership.updated':
        this.logger.log(`Organization membership updated — id: ${data.id}`);
        break;
      case 'organizationMembership.deleted':
        this.logger.log(`Organization membership deleted — id: ${data.id}`);
        break;
      default:
        this.logger.warn(`Unhandled webhook event type: ${type}`);
    }
  }
}
