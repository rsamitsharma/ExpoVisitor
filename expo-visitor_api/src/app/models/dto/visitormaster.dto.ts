import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateVisitorMasterDto {
  @ApiProperty({ description: 'Expo ID' })
  @IsNumber()
  ExpoID: number;

  @ApiProperty({ description: 'Full Name' })
  @IsString()
  FullName: string;

  @ApiProperty({ description: 'Email Address' })
  @IsEmail()
  EmailAddress: string;

  @ApiProperty({ description: 'Phone Number' })
  @IsString()
  PhoneNumber: string;

  @ApiProperty({ description: 'Company Name' })
  @IsString()
  CompanyName: string;

  @ApiProperty({ description: 'Designation' })
  @IsString()
  Designation: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  City: string;

  @ApiProperty({ description: 'Area Of Interest' })
  @IsString()
  AreaOfInterest: string;

  @ApiProperty({ description: 'Purpose Of Visit' })
  @IsString()
  PurposeOfVisit: string;

  @ApiProperty({ description: 'Additional Comment' })
  @IsOptional()
  @IsString()
  AdditionalComment?: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Visitor Image' })
  @IsOptional()
  image?: any;
}

export class UpdateVisitorMasterDto {
  @ApiProperty({ description: 'Visitor ID' })
  @IsNumber()
  VisitorID: number;

  @ApiProperty({ description: 'Expo ID' })
  @IsOptional()
  @IsNumber()
  ExpoID?: number;

  @ApiProperty({ description: 'Full Name' })
  @IsOptional()
  @IsString()
  FullName?: string;

  @ApiProperty({ description: 'Email Address' })
  @IsOptional()
  @IsEmail()
  EmailAddress?: string;

  @ApiProperty({ description: 'Phone Number' })
  @IsOptional()
  @IsString()
  PhoneNumber?: string;

  @ApiProperty({ description: 'Company Name' })
  @IsOptional()
  @IsString()
  CompanyName?: string;

  @ApiProperty({ description: 'Designation' })
  @IsOptional()
  @IsString()
  Designation?: string;

  @ApiProperty({ description: 'City' })
  @IsOptional()
  @IsString()
  City?: string;

  @ApiProperty({ description: 'Area Of Interest' })
  @IsOptional()
  @IsString()
  AreaOfInterest?: string;

  @ApiProperty({ description: 'Purpose Of Visit' })
  @IsOptional()
  @IsString()
  PurposeOfVisit?: string;

  @ApiProperty({ description: 'Additional Comment' })
  @IsOptional()
  @IsString()
  AdditionalComment?: string;

  @ApiProperty({ description: 'Is Active' })
  @IsOptional()
  @IsBoolean()
  IsActive?: boolean;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Visitor Image' })
  @IsOptional()
  image?: any;
}

export class DeleteVisitorMasterDto {
  @ApiProperty({ description: 'Visitor ID' })
  @IsNumber()
  VisitorID: number;
}
