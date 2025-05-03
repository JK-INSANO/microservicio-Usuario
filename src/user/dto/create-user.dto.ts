import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';
import { AccountType } from '../user.model';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  // Campos específicos para tiendas
  @IsOptional()
  @IsString()
  @Length(2, 100)
  readonly store_name?: string;

  @IsOptional()
  @IsString()
  readonly store_address?: string;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  readonly store_phone?: string;

  @IsOptional()
  @IsEnum(AccountType)
  readonly account_type?: AccountType;
}
