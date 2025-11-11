import { Injectable } from '@nestjs/common';
import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';

@Injectable()
export class BabiesService {
  create(createBabyDto: CreateBabyDto) {
    console.log(createBabyDto);
    return 'This action adds a new baby';
  }

  findAll() {
    return `This action returns all babies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} baby`;
  }

  update(id: number, updateBabyDto: UpdateBabyDto) {
    console.log(updateBabyDto);
    return `This action updates a #${id} baby`;
  }

  remove(id: number) {
    return `This action removes a #${id} baby`;
  }
}
