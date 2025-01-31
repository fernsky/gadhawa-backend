import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { WardService } from './ward.service';
import { CreateWardDto, UpdateWardDto, WardResponseDto } from './dto/ward.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enum/roles.enum';

@ApiTags('wards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('wards')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new ward' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: WardResponseDto,
    description: 'Ward has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid ward data or ward number already exists.',
  })
  create(@Body() createWardDto: CreateWardDto): Promise<WardResponseDto> {
    return this.wardService.create(createWardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wards' })
  @ApiResponse({
    status: 200,
    type: [WardResponseDto],
    description: 'List of all wards',
  })
  findAll(): Promise<WardResponseDto[]> {
    return this.wardService.findAll();
  }

  @Get(':wardNumber')
  @ApiOperation({ summary: 'Get a ward by number' })
  @ApiParam({ name: 'wardNumber', type: Number })
  @ApiResponse({ status: 200, type: WardResponseDto })
  @ApiResponse({ status: 404, description: 'Ward not found' })
  findOne(
    @Param('wardNumber', ParseIntPipe) wardNumber: number,
  ): Promise<WardResponseDto> {
    return this.wardService.findOne(wardNumber);
  }

  @Patch(':wardNumber')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a ward' })
  @ApiParam({ name: 'wardNumber', type: Number })
  @ApiResponse({ status: 200, type: WardResponseDto })
  @ApiResponse({ status: 404, description: 'Ward not found' })
  update(
    @Param('wardNumber', ParseIntPipe) wardNumber: number,
    @Body() updateWardDto: UpdateWardDto,
  ): Promise<WardResponseDto> {
    return this.wardService.update(wardNumber, updateWardDto);
  }

  @Delete(':wardNumber')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a ward' })
  @ApiParam({ name: 'wardNumber', type: Number })
  @ApiResponse({ status: 200, description: 'Ward deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ward not found' })
  remove(@Param('wardNumber', ParseIntPipe) wardNumber: number): Promise<void> {
    return this.wardService.remove(wardNumber);
  }
}
