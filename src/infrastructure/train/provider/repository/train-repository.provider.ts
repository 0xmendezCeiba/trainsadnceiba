import { TrainRepository } from "src/domain/train/port/repository/train.repository";
import { TrainRepositoryPostgres } from "../../adapter/repository/train-repository.postgres";

export const trainRepositoryProvider = {
  provide: TrainRepository,
  useClass: TrainRepositoryPostgres,
};
