import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClerkJwtStrategy } from './strategies/clerk-jwt.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, ClerkJwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
