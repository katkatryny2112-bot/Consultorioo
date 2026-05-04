import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Specialist } from '../../specialists/entities/specialist.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ManyToOne(() => Specialist, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'specialistId' })
  specialist: Specialist;

  @Column({ type: 'timestamp' })
  appointmentDate: Date;

  @Column({ default: 'scheduled' }) // scheduled, completed, cancelled
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
