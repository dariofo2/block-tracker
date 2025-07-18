import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import listRequestGraphsDTO from 'src/database/dto/listRequestGraphs.dto';
import { RequestListGroupByAccountAndTimeStamp } from './dto/list/requestListGroupByAccountAndTimeStamp.dto';
import { ListRequestDatatablesDTO } from 'src/database/dto/listRequestDatatables.dto';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  /*
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }
  */
  @Post("list")
  async list(@Body() listRequestDatatablesDTO: ListRequestDatatablesDTO) {
    return this.transactionsService.list(listRequestDatatablesDTO);
  }

  @Post("listByAccountId")
  async listByAccountId(@Body() listRequestDatatablesDTO: ListRequestDatatablesDTO) {
    return this.transactionsService.listByAccountId(listRequestDatatablesDTO);
  }

  @Post('get')
  async get(@Body() getDTO:{id:number}) {
    return this.transactionsService.get(getDTO.id);
  }

  @Post("listGraphsAccounts")
  async listGraphsAccounts(@Body() listRequestGraphsDTO: listRequestGraphsDTO<RequestListGroupByAccountAndTimeStamp>) {
    return await this.transactionsService.listGroupByAccountsAndTime(listRequestGraphsDTO);
  }

  /*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
    */
}
