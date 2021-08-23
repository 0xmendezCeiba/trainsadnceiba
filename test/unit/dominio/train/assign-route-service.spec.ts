import { CreateTrainService } from 'src/domain/train/service/create-train.service';
import { AssignRouteService } from 'src/domain/train/service/assign-route.service';
import { TrainRepository } from 'src/domain/train/port/repository/train.repository';
import { RouteAssignRepository } from 'src/domain/train/port/repository/route-assign.repository';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { RouteAssign } from 'src/domain/train/model/route-assign';
import { Train } from 'src/domain/train/model/train';


describe('AssignRouteService', () => {

  let createTrainService: CreateTrainService;
  let trainRepositoryStub: SinonStubbedInstance<TrainRepository>;
  let routeAssignRepositoryStub: SinonStubbedInstance<RouteAssignRepository>;
  let assignRouteService: AssignRouteService;

  beforeEach(() => {
    trainRepositoryStub = createStubObj<TrainRepository>(['create', 'getById']);
    routeAssignRepositoryStub = createStubObj<RouteAssignRepository>(['create', 'getBetweenDates', 'getById']);

    createTrainService = new CreateTrainService(trainRepositoryStub);
    assignRouteService = new AssignRouteService(createTrainService, routeAssignRepositoryStub);
  });

  it('If train not exists, throw error', async () => {
    const currentTime = new Date().getTime();
    trainRepositoryStub.getById.returns(Promise.resolve(null));
    await expect(
      assignRouteService.execute(new RouteAssign(
      1,
      new Date(currentTime + 10000000),
      new Date(currentTime + 40000000),
      15,
      '000C3',
      ))
    ).rejects.toThrow('Train not found')
  });

  it('If train not free roads, throw error', async () => {
    const currentTime = new Date().getTime();
    const foundTrain = new Train(15, '#FFFFFF');
    const foundAssignRoutes = [
      new RouteAssign(
        2,
        new Date(currentTime + 10000000),
        new Date(currentTime + 40000000),
        15,
        '000C3',
      )
    ];
    trainRepositoryStub.getById.returns(Promise.resolve(foundTrain));
    routeAssignRepositoryStub.getBetweenDates.returns(Promise.resolve(foundAssignRoutes));

    const sentData = new RouteAssign(
      3,
      new Date(currentTime + 10000000),
      new Date(currentTime + 40000000),
      15,
      '000C3',
    )
    await expect(
      assignRouteService.execute(sentData)
    ).rejects.toThrow(`This time interval is busy for road ${sentData.getRoadCode}`);
  });

  it('If train is busy for time interval, throw error', async () => {
    const currentTime = new Date().getTime();
    const foundTrain = new Train(15, '#FFFFFF');
    const foundAssignRoutes = [
      new RouteAssign(
        3,
        new Date(currentTime + 10000000),
        new Date(currentTime + 40000000),
        15,
        '55000C3',
      )
    ];
    trainRepositoryStub.getById.returns(Promise.resolve(foundTrain));
    routeAssignRepositoryStub.getBetweenDates.returns(Promise.resolve(foundAssignRoutes));

    const sentData = new RouteAssign(
      3,
      new Date(currentTime + 10000000),
      new Date(currentTime + 40000000),
      15,
      '000C3',
    )
    await expect(
      assignRouteService.execute(sentData)
    ).rejects.toThrow('Train busy for time interval');
  });

  it('Create assign route', async () => {
    const currentTime = new Date().getTime();
    const foundTrain = new Train(15, '#FFFFFF');
    const foundAssignRoutes = [];
    trainRepositoryStub.getById.returns(Promise.resolve(foundTrain));
    routeAssignRepositoryStub.getBetweenDates.returns(Promise.resolve(foundAssignRoutes));

    const sentData = new RouteAssign(
      3,
      new Date(currentTime + 10000000),
      new Date(currentTime + 40000000),
      15,
      '000C3',
    );

    await assignRouteService.execute(sentData);
    expect(routeAssignRepositoryStub.create.getCalls().length).toBe(1);
  });

});
