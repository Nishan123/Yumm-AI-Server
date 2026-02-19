import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { NotificationTargetAudience } from "../types/notification.type";

export class SendNotificationDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsEnum(NotificationTargetAudience)
    @IsOptional()
    targetAudience: NotificationTargetAudience = NotificationTargetAudience.ALL;
}
