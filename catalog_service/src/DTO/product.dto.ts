import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductRequest{
    @IsString()
    @IsNotEmpty()
    name: String;

    @IsString()
    description: String;
    
    @IsNumber()
    @Min(1)
    price: number;

    @IsNumber()
    stock: number;
}