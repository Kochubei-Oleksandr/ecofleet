import {BaseModel} from "rushapp-angular-core";

export class Vehicle extends BaseModel {
  public id: number;
  public objectId: number;
  public orgId: number;
  public timestamp: string;
  public latitude: number;
  public longitude: number;
  public speed: number;
  public enginestate: number;
  public gpsstate: boolean;
  public direction: any;
  public fuel: any;
  public power: number;
  public CANDistance: any;
  public available: any;
  public driverId: number;
  public driverUuid: number;
  public driverName: string;
  public driverKey: any;
  public driverPhone: any;
  public driverStatuses: any;
  public driverIsOnDuty: boolean;
  public dutyTags: any;
  public pairedObjectId: number;
  public pairedObjectName: string;
  public lastEngineOnTime: string;
  public inPrivateZone: boolean;
  public offWorkSchedule: boolean;
  public tripPurposeDinSet: any;
  public tcoData: any;
  public tcoCardIsPresent: boolean;
  public address: string;
  public addressArea: boolean;
  public addressAreaId: number;
  public addressAreaUuid: number;
  public displayColor: any;
  public employeeId: number;
  public currentOdometer: number;
  public currentWorkhours: number;
  public enforcePrivacyFilter: any;
  public EVStateOfCharge: any;
  public EVDistanceRemaining: any;
  public customValues: any;
  public EventType: any;
  public objectName: any;
  public externalId: any;
  public plate: any;

  protected fields(): string[] {
    return [
      'id',
      'objectId',
      'orgId',
      'timestamp',
      'latitude',
      'longitude',
      'speed',
      'enginestate',
      'gpsstate',
      'direction',
      'fuel',
      'power',
      'CANDistance',
      'available',
      'driverId',
      'driverUuid',
      'driverName',
      'driverKey',
      'driverPhone',
      'driverStatuses',
      'driverIsOnDuty',
      'dutyTags',
      'pairedObjectId',
      'pairedObjectName',
      'lastEngineOnTime',
      'inPrivateZone',
      'offWorkSchedule',
      'tripPurposeDinSet',
      'tcoData',
      'tcoCardIsPresent',
      'address',
      'addressArea',
      'addressAreaId',
      'addressAreaUuid',
      'displayColor',
      'employeeId',
      'currentOdometer',
      'currentWorkhours',
      'enforcePrivacyFilter',
      'EVStateOfCharge',
      'EVDistanceRemaining',
      'customValues',
      'EventType',
      'objectName',
      'externalId',
      'plate',
    ];
  }
}
