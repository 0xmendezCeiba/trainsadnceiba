import { TrainDTO } from 'src/application/train/query/dto/train.dto';

export abstract class TrainDAO {

  abstract listAll(): Promise<TrainDTO[]>;

};
