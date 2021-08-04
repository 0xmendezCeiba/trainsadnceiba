export class PassengerBoarding {

  private readonly routeAssignId: number;
  private readonly clientId: number;

  constructor(routeAssignId: number, clientId: number) {
    this.routeAssignId = routeAssignId;
    this.clientId = clientId;
  }

  get getRouteAssignId() {
    return this.routeAssignId;
  }

  get getClientId() {
    return this.clientId;
  }

}
