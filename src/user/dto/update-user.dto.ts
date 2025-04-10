import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { AccountType } from '../user.model';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  readonly name?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  readonly phone?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsEnum(AccountType)
  readonly account_type?: AccountType;
}
