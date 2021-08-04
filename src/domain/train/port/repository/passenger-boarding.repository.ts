import { PassengerBoarding } from "../../model/passenger-boarding";

export abstract class PassengerBoardingRepository {

  abstract create(passengerBoarding: PassengerBoarding);
  abstract getLastPassengerBoardingForClient(clientId: number): Promise<PassengerBoarding | null>;

}
