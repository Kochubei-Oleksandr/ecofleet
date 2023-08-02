import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
//@ts-ignore
import moment from 'moment'
import {NotificationService} from "rushapp-angular-core";
import {VehicleService} from "../../shared/services/components/http-requests/vehicle.service";
import {Vehicle} from "../../shared/models/components/vehicle.class";
import {LeafletService} from "../../shared/services/leaflet.service";
import {MatTableDataSource} from "@angular/material/table";
import { formatDistanceToNow } from 'date-fns';
import {VehicleInfoService} from "../../shared/services/components/http-requests/vehicle-info.service";
import {VehicleInfo} from "../../shared/models/components/vehicle-info.class";
import * as turf from '@turf/turf';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  public apiKeyFormGroup: FormGroup;
  public dateFormGroup: FormGroup;
  public vehicleInfoTableDataSource: MatTableDataSource<any>;
  public vehicleInfoColumns: string[] = ['driverName', 'speed', 'lastUpdate'];
  public vehicles: Vehicle[];
  public vehicleInfo: VehicleInfo[];
  public selectedRowIndexInTable: number = -1;
  public numberOfStopsOfSelectedVehicle: number = 0;
  public totalDistanceOfSelectedVehicle: number = 0;
  public shortestPossibleDistanceOfSelectedVehicle: number = 0;
  public coordinatesForSelectedVehicle: number[][] = [];
  public selectedVehicle: Vehicle;
  private map: any;
  
  public constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private vehicleInfoService: VehicleInfoService,
    private notificationService: NotificationService,
    private leafletService: LeafletService
  ) { }

  public ngOnInit(): void {
    this.createApiKeyForm();
    this.createDateForm();
  }

  public isGetVehicleRequestCompleted(): boolean {
    return this.vehicleService.isGetVehiclesRequestCompleted;
  }
  public isVehicleInfoRequestCompleted(): boolean {
    return this.vehicleInfoService.isVehicleInfoRequestCompleted;
  }
  public getVehicles(): void {
    const params: any = {
      key: this.apiKeyFormGroup.get('api_key').value,
      json: 'json'
    };
    this.vehicleService.getVehicles(params).subscribe(
      (res: Vehicle[]) => {
        this.vehicles = res;
        this.initMap(this.getLatLonForCenterOnMap(res[0]));
        this.resetMap();
        this.resetVehicleInfo();
        this.addVehiclesToMap();
        this.setVehiclesInfoTableDataSource(res);
      },
      () => this.notificationService.error('API_KEY_ERROR', 3000, true)
    );
  }
  public getVehicleInfo(): void {
    const selectedDate = this.dateFormGroup.get('selected_date').value;
    if (selectedDate && this.selectedVehicle) {
      const params: any = {
        objectId: this.selectedVehicle.objectId,
        key: this.apiKeyFormGroup.get('api_key').value,
        json: 'json'
      };
      this.vehicleInfoService.getVehicleInfo({...params, ...this.getDateInRightFormat(selectedDate)}).subscribe(
        (res: VehicleInfo[]) => {
          this.vehicleInfo = res;
          this.resetCalculationsForSelectedVehicle();
          this.performCalculationsForSelectedVehicle();
          this.resetMap();
          this.addVehicleRouteToMap();
          this.addVehiclesToMap();
        },
        () => this.notificationService.error('API_KEY_ERROR', 3000, true)
      );
    } else {
      this.notificationService.warn('YOU_NEED_SELECT_VEHICLE_AND_DATE', 3000, true)
    }
  }
  public selectVehicle(vehicle: Vehicle, index: number): void {
    this.selectedVehicle = vehicle;
    this.selectedRowIndexInTable = index;
  }
  public timeDifferenceDisplay(timestamp: string): string {
    const date: Date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  private getLatLonForCenterOnMap(vehicle: Vehicle): number[] {
    const latitude: number = vehicle.latitude ?? 52.4874393;
    const longitude: number = vehicle.longitude ?? 13.3421548;
    return [ latitude, longitude ];
  }
  private createApiKeyForm(): void {
    this.apiKeyFormGroup = this.formBuilder.group({
      api_key: ['home.assignment-699172']
    });
  }
  private createDateForm(): void {
    this.dateFormGroup = this.formBuilder.group({
      selected_date: [moment().format('YYYY-MM-DD')]
    });
  }
  private initMap(center: number[]): void {
    if (!this.map) {
      this.map = this.leafletService.L.map('map', {
        center: center,
        zoom: 10
      });
      this.setTileLayer();
    }
  }
  private setTileLayer() {
    this.leafletService.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }
  private setVehiclesInfoTableDataSource(tableData: any): void {
    this.vehicleInfoTableDataSource = new MatTableDataSource(tableData);
    this.vehicleInfoTableDataSource.filterPredicate = (data: any, filter: string) => data.driverName.indexOf(filter) !== -1;
  }
  private addVehiclesToMap(): void {
    this.vehicles.forEach((vehicle: Vehicle) => {
      if (vehicle.latitude && vehicle.longitude) {
        this.addCircleMarkerOnMap(
          [vehicle.latitude, vehicle.longitude],
          `Name - ${vehicle.driverName}`,
          6,
          '#a30303'
        );
      }
    })
  }
  private setCenterOfMap(coordinate: number[]): void {
    const newCenter = this.leafletService.L.latLng(coordinate);
    this.map.flyTo(newCenter);
  }
  private addCircleMarkerOnMap(coordinate: number[], popupText: string, radius: number, color: string): void {
    this.leafletService.L.circleMarker(
      coordinate,
      { radius: radius, fillColor: color, color: color }
    ).bindPopup(popupText, {
      closeButton: false
    }).addTo(this.map);
  }
  //calculates the distance in kilometers between two points using the Haversine formula
  private haversineDistance(coord1: number[], coord2: number[]): number {
    const from = turf.point(coord1);
    const to = turf.point(coord2);
    return turf.distance(from, to, { units: 'kilometers' });
  }
  private performCalculationsForSelectedVehicle(): void {
    this.numberOfStopsOfSelectedVehicle = this.vehicleInfo.length;

    this.vehicleInfo.forEach((vehicleInfo: VehicleInfo, index: number): void => {
      let coordinate: number[] = [vehicleInfo.Latitude, vehicleInfo.Longitude];
      this.coordinatesForSelectedVehicle.push(coordinate);
      if (index === this.numberOfStopsOfSelectedVehicle - 1) {
        this.setCenterOfMap(coordinate)
        this.addCircleMarkerOnMap(
          coordinate,
          vehicleInfo.timestamp,
          5,
          '#ede84c'
        );
      }
    });
    this.calculateDistanceOfSelectedVehicle();
    this.calculateShortestPossibleDistanceOfSelectedVehicle();
  }
  private calculateShortestPossibleDistanceOfSelectedVehicle(): void {
    let shortestDistance: number = 0;
    const coords: number[][] = this.coordinatesForSelectedVehicle

    for (let i: number = 0; i < coords.length - 1; i++) {
      const currentDistance: number = this.haversineDistance(coords[i], coords[i + 1]);
      shortestDistance += currentDistance;
    }

    this.shortestPossibleDistanceOfSelectedVehicle = Math.round(shortestDistance);
  }
  private calculateDistanceOfSelectedVehicle(): void {
    if (this.coordinatesForSelectedVehicle.length > 2) {
      const lineString = turf.lineString(this.coordinatesForSelectedVehicle);
      this.totalDistanceOfSelectedVehicle = Math.round(turf.length(lineString, { units: 'kilometers' }));
    }
  }
  private addVehicleRouteToMap() {
    this.leafletService.L.polyline(this.coordinatesForSelectedVehicle, {
      color: '#0869c7'
    }).addTo(this.map);
  }
  private resetMap(): void {
    this.map.eachLayer((layer: any) => {
      this.map.removeLayer(layer);
    });
    this.setTileLayer();
  }
  private resetCalculationsForSelectedVehicle(): void {
    this.totalDistanceOfSelectedVehicle = 0;
    this.numberOfStopsOfSelectedVehicle = 0;
    this.shortestPossibleDistanceOfSelectedVehicle = 0;
    this.coordinatesForSelectedVehicle = [];
  }
  private resetVehicleInfo(): void {
    this.resetCalculationsForSelectedVehicle();
    this.vehicleInfo = [];
    this.selectedRowIndexInTable = -1;
  }
  private getDateInRightFormat(selectedDate: moment.Moment | string): any {
    //@ts-ignore
    const dateMoment: moment.Moment = typeof selectedDate === 'string' ? moment(selectedDate) : selectedDate;

    return {
      begTimestamp: dateMoment.format('YYYY-MM-DD'),
      endTimestamp: dateMoment.clone().add(1, 'days').format('YYYY-MM-DD')
    };
  }
}
