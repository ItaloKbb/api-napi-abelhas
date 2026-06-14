import {
  Controller,
  Get,
  Post,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from '@/common/guards/clerk-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { ClerkUser } from './strategies/clerk-jwt.strategy';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  me(@CurrentUser() user: ClerkUser): ClerkUser {
    return user;
  }

  @Post('webhook/clerk')
  @HttpCode(HttpStatus.OK)
  handleClerkWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers() headers: Record<string, string>,
  ) {
    const payload = req.rawBody?.toString() ?? '';
    const event = this.authService.verifyWebhook(payload, headers);
    this.authService.handleWebhookEvent(event);
    return { received: true };
  }
}
