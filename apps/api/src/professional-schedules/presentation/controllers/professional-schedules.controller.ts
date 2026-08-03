import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { TenantContextRequiredError } from '../../../access/domain/errors/tenant-context-required.error';
import { Roles } from '../../../access/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../access/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../access/presentation/guards/roles.guard';
import { MembershipRole } from '../../../users/domain/entities/membership.entity';
import { AvailableSlotsService } from '../../application/services/available-slots.service';
import { ProfessionalScheduleBlocksService } from '../../application/services/professional-schedule-blocks.service';
import { ProfessionalSchedulesService } from '../../application/services/professional-schedules.service';
import { ProfessionalScheduleBlockNotFoundError } from '../../domain/errors/professional-schedule-block-not-found.error';
import { CreateProfessionalScheduleBlockDto } from '../dto/create-professional-schedule-block.dto';
import { CreateProfessionalScheduleDto } from '../dto/create-professional-schedule.dto';
import { GetAvailableSlotsQueryDto } from '../dto/get-available-slots-query.dto';
import { ListProfessionalScheduleBlocksQueryDto } from '../dto/list-professional-schedule-blocks-query.dto';
import { ReplaceAvailabilityWindowsDto } from '../dto/replace-availability-windows.dto';
import { UpdateProfessionalScheduleBlockDto } from '../dto/update-professional-schedule-block.dto';
import { UpdateProfessionalScheduleDto } from '../dto/update-professional-schedule.dto';

@Controller('professional-schedules')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class ProfessionalSchedulesController {
  constructor(
    private readonly professionalSchedulesService:
      ProfessionalSchedulesService,
    private readonly availableSlotsService:
      AvailableSlotsService,
    private readonly professionalScheduleBlocksService:
      ProfessionalScheduleBlocksService,
  ) {}

  @Post()
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  createSchedule(
    @Req() request: Request,
    @Body()
    body: CreateProfessionalScheduleDto,
  ) {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    return this.professionalSchedulesService.createSchedule(
      organizationId,
      body,
    );
  }

  @Get(
    'professional/:professionalMembershipId',
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  getScheduleByProfessional(
    @Req() request: Request,
    @Param(
      'professionalMembershipId',
      ParseUUIDPipe,
    )
    professionalMembershipId: string,
  ) {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    return this.professionalSchedulesService.getScheduleByProfessional(
      organizationId,
      professionalMembershipId,
    );
  }

  @Post(':scheduleId/blocks')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  createBlock(
    @Req() request: Request,
    @Param(
      'scheduleId',
      ParseUUIDPipe,
    )
    scheduleId: string,
    @Body()
    body:
      CreateProfessionalScheduleBlockDto,
  ) {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    return this.professionalScheduleBlocksService.createBlock(
      {
        organizationId,
        professionalScheduleId:
          scheduleId,
        type: body.type,
        startsAt: body.startsAt,
        endsAt: body.endsAt,
        reason:
          body.reason ?? null,
      },
    );
  }

  @Get(':scheduleId/blocks')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  listBlocks(
    @Req() request: Request,
    @Param(
      'scheduleId',
      ParseUUIDPipe,
    )
    scheduleId: string,
    @Query()
    query:
      ListProfessionalScheduleBlocksQueryDto,
  ) {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    return this.professionalScheduleBlocksService.listBlocks(
      {
        organizationId,
        professionalScheduleId:
          scheduleId,
        startsBefore:
          query.startsBefore,
        endsAfter:
          query.endsAfter,
      },
    );
  }

  @Get(
    ':scheduleId/blocks/:blockId',
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  async getBlockById(
    @Req() request: Request,
    @Param(
      'scheduleId',
      ParseUUIDPipe,
    )
    scheduleId: string,
    @Param(
      'blockId',
      ParseUUIDPipe,
    )
    blockId: string,
  ) {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    const block =
      await this.professionalScheduleBlocksService.getBlockById(
        organizationId,
        blockId,
      );

    this.ensureBlockBelongsToSchedule(
      block.professionalScheduleId,
      scheduleId,
    );

    return block;
  }

  @Patch(
    ':scheduleId/blocks/:blockId',
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  async updateBlock(
    @Req() request: Request,
    @Param(
      'scheduleId',
      ParseUUIDPipe,
    )
    scheduleId: string,
    @Param(
      'blockId',
      ParseUUIDPipe,
    )
    blockId: string,
    @Body()
    body:
      UpdateProfessionalScheduleBlockDto,
  ) {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    const existingBlock =
      await this.professionalScheduleBlocksService.getBlockById(
        organizationId,
        blockId,
      );

    this.ensureBlockBelongsToSchedule(
      existingBlock.professionalScheduleId,
      scheduleId,
    );

    return this.professionalScheduleBlocksService.updateBlock(
      {
        organizationId,
        blockId,
        type: body.type,
        startsAt:
          body.startsAt,
        endsAt: body.endsAt,
        reason: body.reason,
      },
    );
  }

  @Delete(
    ':scheduleId/blocks/:blockId',
  )
  @HttpCode(
    HttpStatus.NO_CONTENT,
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  async deleteBlock(
    @Req() request: Request,
    @Param(
      'scheduleId',
      ParseUUIDPipe,
    )
    scheduleId: string,
    @Param(
      'blockId',
      ParseUUIDPipe,
    )
    blockId: string,
  ): Promise<void> {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    const existingBlock =
      await this.professionalScheduleBlocksService.getBlockById(
        organizationId,
        blockId,
      );

    this.ensureBlockBelongsToSchedule(
      existingBlock.professionalScheduleId,
      scheduleId,
    );

    await this.professionalScheduleBlocksService.deleteBlock(
      organizationId,
      blockId,
    );
  }

  @Get(
    ':scheduleId/available-slots',
  )
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  getAvailableSlots(
    @Req() request: Request,
    @Param(
      'scheduleId',
      ParseUUIDPipe,
    )
    scheduleId: string,
    @Query()
    query:
      GetAvailableSlotsQueryDto,
  ) {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    return this.availableSlotsService.getAvailableSlots(
      {
        organizationId,
        scheduleId,
        date: query.date,
        durationMinutes:
          query.durationMinutes,
      },
    );
  }

  @Get(':scheduleId/windows')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  listAvailabilityWindows(
    @Req() request: Request,
    @Param(
      'scheduleId',
      ParseUUIDPipe,
    )
    scheduleId: string,
  ) {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    return this.professionalSchedulesService.listAvailability(
      organizationId,
      scheduleId,
    );
  }

  @Put(':scheduleId/windows')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  replaceAvailabilityWindows(
    @Req() request: Request,
    @Param(
      'scheduleId',
      ParseUUIDPipe,
    )
    scheduleId: string,
    @Body()
    body:
      ReplaceAvailabilityWindowsDto,
  ) {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    return this.professionalSchedulesService.replaceAvailability(
      organizationId,
      scheduleId,
      body.windows,
    );
  }

  @Patch(':scheduleId')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
  )
  updateSchedule(
    @Req() request: Request,
    @Param(
      'scheduleId',
      ParseUUIDPipe,
    )
    scheduleId: string,
    @Body()
    body:
      UpdateProfessionalScheduleDto,
  ) {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    return this.professionalSchedulesService.updateSchedule(
      organizationId,
      scheduleId,
      body,
    );
  }

  @Get(':scheduleId')
  @Roles(
    MembershipRole.OWNER,
    MembershipRole.ADMIN,
    MembershipRole.NUTRITIONIST,
    MembershipRole.ASSISTANT,
  )
  getScheduleById(
    @Req() request: Request,
    @Param(
      'scheduleId',
      ParseUUIDPipe,
    )
    scheduleId: string,
  ) {
    const organizationId =
      this.getOrganizationId(
        request,
      );

    return this.professionalSchedulesService.getScheduleById(
      organizationId,
      scheduleId,
    );
  }

  private ensureBlockBelongsToSchedule(
    actualScheduleId: string,
    requestedScheduleId: string,
  ): void {
    if (
      actualScheduleId !==
      requestedScheduleId
    ) {
      throw new ProfessionalScheduleBlockNotFoundError();
    }
  }

  private getOrganizationId(
    request: Request,
  ): string {
    const organizationId =
      request.auth?.organizationId;

    if (!organizationId) {
      throw new TenantContextRequiredError();
    }

    return organizationId;
  }
}