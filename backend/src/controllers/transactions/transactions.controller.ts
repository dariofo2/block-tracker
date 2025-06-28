import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import listRequestGraphsDTO from 'src/database/dto/listRequestGraphs.dto';
import { RequestListGroupByAccountAndTimeStamp } from './dto/list/requestListGroupByAccountAndTimeStamp.dto';

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
  async list() {
    return this.transactionsService.list();
  }

  @Post('get')
  async get(@Param('id') id: string) {
    return this.transactionsService.get(+id);
  }

  @Post("listGraphs")
  async listGraphs(@Body() listRequestGraphsDTO: listRequestGraphsDTO<RequestListGroupByAccountAndTimeStamp>) {
    return await this.transactionsService.listGroupByAccountsAndTimestamp(listRequestGraphsDTO);
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
