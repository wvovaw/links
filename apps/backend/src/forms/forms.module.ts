import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FormSubmission } from "./form-submission.entity";
import { FormsService } from "./forms.service";

@Module({
  imports: [TypeOrmModule.forFeature([FormSubmission])],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
