import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Specialists')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService) {}

  @Post()
  create(@Body() createSpecialistDto: CreateSpecialistDto) {
    return this.specialistsService.create(createSpecialistDto);
  }

  @Get()
  findAll() {
    return this.specialistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialistsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecialistDto: UpdateSpecialistDto) {
    return this.specialistsService.update(+id, updateSpecialistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialistsService.remove(+id);
  }
}
