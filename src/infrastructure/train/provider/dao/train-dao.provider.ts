import { TrainDAO } from 'src/domain/train/port/dao/train.dao';
import { TrainDAOPostgres } from 'src/infrastructure/train/adapter/dao/train-dao.postgres';

export const trainDAOProvider = {
  provide: TrainDAO,
  useClass: TrainDAOPostgres,
};
