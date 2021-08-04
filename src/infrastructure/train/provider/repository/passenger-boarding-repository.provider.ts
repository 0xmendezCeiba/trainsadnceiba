import { PassengerBoardingRepository } from 'src/domain/train/port/repository/passenger-boarding.repository';
import { PassengerBoardingRepositoryPostgres } from '../../adapter/repository/passenger-boarding-repository.postgres';

export const passengerBoardingRepositoryProvider = {
  provide: PassengerBoardingRepository,
  useClass: PassengerBoardingRepositoryPostgres,
};
