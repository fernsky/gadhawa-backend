import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { Polygon } from 'geojson';

export class GeometryDto implements Polygon {
  @ApiProperty({ enum: ['Polygon'] })
  @IsNotEmpty()
  type: 'Polygon';

  @ApiProperty({ type: Array })
  @IsNotEmpty()
  coordinates: number[][][];
}

export class CreateWardDto {
  @ApiProperty({
    description: 'Ward number',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  wardNumber: number;

  @ApiProperty({
    description: 'Ward area code',
    example: 101,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  wardAreaCode: number;

  @ApiProperty({
    description: 'Ward geometry in GeoJSON Polygon format',
    required: false,
    type: GeometryDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GeometryDto)
  geometry?: GeometryDto;
}

export class UpdateWardDto {
  @ApiProperty({
    description: 'Ward area code',
    example: 101,
    minimum: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  wardAreaCode?: number;

  @ApiProperty({
    description: 'Ward geometry in GeoJSON Polygon format',
    required: false,
  })
  @IsOptional()
  geometry?: Polygon;
}

export class WardResponseDto {
  @ApiProperty({ example: 1 })
  wardNumber: number;

  @ApiProperty({ example: 101 })
  wardAreaCode: number;

  @ApiProperty({
    description: 'GeoJSON Polygon representation of ward boundaries',
    required: false,
  })
  geometry?: Polygon;
}
