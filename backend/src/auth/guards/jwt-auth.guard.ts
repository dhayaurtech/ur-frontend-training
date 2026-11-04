import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UserRole } from '../dto/user.dto';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    const token = request.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedException('Please log in first');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      request.user = {
        userId:payload.sub,
        email:payload.email,
        name:payload.name,
        role:payload.role
      };
      return true;
    } catch(error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
