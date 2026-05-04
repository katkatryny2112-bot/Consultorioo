"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpecialistDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_specialist_dto_1 = require("./create-specialist.dto");
class UpdateSpecialistDto extends (0, mapped_types_1.PartialType)(create_specialist_dto_1.CreateSpecialistDto) {
}
exports.UpdateSpecialistDto = UpdateSpecialistDto;
//# sourceMappingURL=update-specialist.dto.js.map