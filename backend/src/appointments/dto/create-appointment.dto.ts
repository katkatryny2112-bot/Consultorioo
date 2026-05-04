import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1, description: 'ID of the patient' })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  patientId: number;

  @ApiProperty({ example: 1, description: 'ID of the specialist' })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  specialistId: number;

  @ApiProperty({ example: '2023-12-25T10:00:00Z', description: 'Date and time of the appointment' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @ApiProperty({ example: 'Consultation for flu', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
