import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from "class-validator";

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

export class UpdateProductRequest{
    name?: String;

    description?: String;
    
    @IsOptional()
    @Min(1)
    price?: number;

    @IsOptional()
    @IsNumber()
    stock?: number;
}