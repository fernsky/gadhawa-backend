import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWardDto, UpdateWardDto, WardResponseDto } from './dto/ward.dto';
import { eq, sql } from 'drizzle-orm';
import { wards } from '../drizzle/schema';
import { DRIZZLE_ORM } from '@app/core/constants/db.constants';
import { JwtService } from '@nestjs/jwt';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../drizzle/schema';

@Injectable()
export class WardService {
  constructor(
    @Inject(DRIZZLE_ORM) private db: PostgresJsDatabase<typeof schema>,
    private jwtService: JwtService,
  ) {}

  async create(createWardDto: CreateWardDto): Promise<WardResponseDto> {
    try {
      const [ward] = await this.db
        .insert(wards)
        .values({
          ...createWardDto,
          geometry: createWardDto.geometry
            ? sql`ST_GeomFromGeoJSON(${JSON.stringify(createWardDto.geometry)})`
            : null,
        })
        .returning();
      return this.transformWardResponse(ward);
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Ward number already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<WardResponseDto[]> {
    const result = await this.db.execute(
      sql`SELECT ward_number as "wardNumber", 
          ward_area_code as "wardAreaCode",
          ST_AsGeoJSON(geometry) as geometry 
          FROM ${wards} 
          ORDER BY ward_number`,
    );
    return result.map(this.transformWardResponse);
  }

  async findOne(wardNumber: number): Promise<WardResponseDto> {
    const [result] = await this.db.execute(
      sql`SELECT ward_number as "wardNumber", 
          ward_area_code as "wardAreaCode",
          ST_AsGeoJSON(geometry) as geometry 
          FROM ${wards} 
          WHERE ward_number = ${wardNumber}
          LIMIT 1`,
    );

    if (!result) {
      throw new NotFoundException(`Ward #${wardNumber} not found`);
    }

    return this.transformWardResponse(result);
  }

  async update(
    wardNumber: number,
    updateWardDto: UpdateWardDto,
  ): Promise<WardResponseDto> {
    const [updated] = await this.db
      .update(wards)
      .set(updateWardDto)
      .where(eq(wards.wardNumber, wardNumber))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Ward #${wardNumber} not found`);
    }

    return this.transformWardResponse(updated);
  }

  async remove(wardNumber: number): Promise<void> {
    const result = await this.db
      .delete(wards)
      .where(eq(wards.wardNumber, wardNumber))
      .returning();

    if (!result.length) {
      throw new NotFoundException(`Ward #${wardNumber} not found`);
    }
  }

  private transformWardResponse(ward: any): WardResponseDto {
    if (!ward) return null;
    return {
      wardNumber: ward.wardNumber,
      wardAreaCode: ward.wardAreaCode,
      geometry: ward.geometry ? JSON.parse(ward.geometry) : null,
    };
  }
}
