import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecialistDto {
  @ApiProperty({ example: 'Gregory' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'House' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Diagnostic Medicine' })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({ example: 'house.md@hospital.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '555-0199', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}
