import { ROLE_KEY } from "@common/decorators/role.decorator";
import { Roles } from "@common/enum/role.enum";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;
    const role = user.role ?? Roles.User;
    if (user.role === Roles.Admin) return true;
    if (requiredRoles.includes(role as Roles)) return true;
    throw new ForbiddenException();
  }
}
