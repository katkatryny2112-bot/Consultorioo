export declare enum UserRole {
    ADMIN = "admin",
    SPECIALIST = "specialist",
    PATIENT = "patient"
}
export declare class RegisterDto {
    email: string;
    password: string;
    role: UserRole;
}
