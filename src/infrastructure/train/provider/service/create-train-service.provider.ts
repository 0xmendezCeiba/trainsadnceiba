import { TrainRepository } from "src/domain/train/port/repository/train.repository";
import { CreateTrainService } from "src/domain/train/service/create-train.service";

export function createTrainServiceProvider(trainRepository: TrainRepository) {
  return new CreateTrainService(trainRepository);
}
