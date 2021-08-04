import { CreateTrainService } from 'src/domain/train/service/create-train.service';
import { Train } from 'src/domain/train/model/train';
import { TrainRepository } from 'src/domain/train/port/repository/train.repository';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';


describe('CreateClientService', () => {

  let createTrainService: CreateTrainService;
  let trainRepositoryStub: SinonStubbedInstance<TrainRepository>;

  beforeEach(() => {
    trainRepositoryStub = createStubObj<TrainRepository>(['create']);
    createTrainService = new CreateTrainService(trainRepositoryStub);
  });

  it('Create train', async () => {
    const train = new Train(20, '#FEFEFE');

    await createTrainService.execute(train);

    expect(trainRepositoryStub.create.getCalls().length).toBe(1);
    expect(trainRepositoryStub.create.calledWith(train)).toBeTruthy();
  });
  
});
