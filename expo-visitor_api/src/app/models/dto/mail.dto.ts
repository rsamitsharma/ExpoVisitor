import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class SendVisitorConfirmationDto {
  @ApiProperty({ description: 'Visitor ID' })
  @IsNumber()
  VisitorID: number;

  @ApiProperty({ description: 'Expo ID' })
  @IsNumber()
  ExpoID: number;

  @ApiProperty({ description: 'Recipient Email Address' })
  @IsEmail()
  RecipientEmail: string;

  @ApiProperty({ description: 'Visitor Full Name' })
  @IsString()
  VisitorName: string;

  @ApiProperty({ description: 'Expo Name', required: false })
  @IsOptional()
  @IsString()
  ExpoName?: string;
}

export class MailLogQueryDto {
  @ApiProperty({ description: 'Filter by status', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Filter by Expo ID', required: false })
  @IsOptional()
  @IsNumber()
  expoId?: number;

  @ApiProperty({ description: 'Limit results', required: false })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
