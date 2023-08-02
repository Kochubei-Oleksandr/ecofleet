import {BaseModel} from "rushapp-angular-core";

export class VehicleInfo extends BaseModel {
  public id: number;
  public timestamp: string;
  public Din3: boolean;
  public Din2: boolean;
  public CANDistance: number;
  public Latitude: number;
  public Speed: number;
  public EngineStatus: boolean;
  public Ain1: number;
  public Ain2: number;
  public Longitude: number;
  public DeviceIgnition: boolean;
  public CANFuelUsed: number;
  public Fuel: number;
  public CANRPM: number;
  public DeltaDistance: number;
  public CANProgramNumber: string;
  public CNGLevel: number;
  public Direction: number;
  public Beacons: string;
  public MovementSensor: boolean;
  public GPSState: boolean;
  public Power: number;
  public Din1: boolean;
  public CNGUsed: number;
  public Satellites: number;
  public CNGStatus: boolean;


  protected fields(): string[] {
    return [
      'id',
      'timestamp',
      'Din3',
      'Din2',
      'CANDistance',
      'Latitude',
      'Speed',
      'EngineStatus',
      'Ain1',
      'Ain2',
      'Longitude',
      'DeviceIgnition',
      'CANFuelUsed',
      'Fuel',
      'CANRPM',
      'DeltaDistance',
      'CANProgramNumber',
      'CNGLevel',
      'Direction',
      'Beacons',
      'MovementSensor',
      'GPSState',
      'Power',
      'Din1',
      'CNGUsed',
      'Satellites',
      'CNGStatus'
    ];
  }
}
