import { IsNotEmpty } from 'class-validator';

export class AddCarDto {
  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  model: string;
}
