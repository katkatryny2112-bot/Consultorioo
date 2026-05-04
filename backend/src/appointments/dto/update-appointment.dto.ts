import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}
