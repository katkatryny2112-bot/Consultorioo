import { CreateAppointmentDto } from './create-appointment.dto';
export declare enum AppointmentStatus {
    SCHEDULED = "scheduled",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
declare const UpdateAppointmentDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAppointmentDto>>;
export declare class UpdateAppointmentDto extends UpdateAppointmentDto_base {
    status?: AppointmentStatus;
}
export {};
