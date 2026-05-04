import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentsRepository.create({
      patient: { id: createAppointmentDto.patientId } as any,
      specialist: { id: createAppointmentDto.specialistId } as any,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
      notes: createAppointmentDto.notes
    });
    return this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find();
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }
    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    if (updateAppointmentDto.patientId) {
      appointment.patient = { id: updateAppointmentDto.patientId } as any;
    }
    if (updateAppointmentDto.specialistId) {
      appointment.specialist = { id: updateAppointmentDto.specialistId } as any;
    }
    if (updateAppointmentDto.appointmentDate) {
      appointment.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
    }
    if (updateAppointmentDto.status) {
      appointment.status = updateAppointmentDto.status;
    }
    if (updateAppointmentDto.notes !== undefined) {
      appointment.notes = updateAppointmentDto.notes;
    }
    return this.appointmentsRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentsRepository.remove(appointment);
  }
}
