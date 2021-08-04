import { Train } from "../../model/train";

export abstract class TrainRepository {

  abstract create(train: Train);
  abstract getById(id: number): Promise<Train | null>;
  
}
