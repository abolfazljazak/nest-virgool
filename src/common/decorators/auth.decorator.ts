import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guards/auth.guard";
import { CanAccess } from "./role.decorator";
import { RoleGuard } from "src/modules/auth/guards/role.guard";

export function AuthDecorator() {
  return applyDecorators(
    UseGuards(AuthGuard, RoleGuard),
    ApiBearerAuth("Authorization")
  );
}
