import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  private static server = 'localhost';
  //private static server = '147.91.204.115';
  public static baseURL='http://'+ConstantsService.server+':10033/api/';
  public static port = 'http://'+ConstantsService.server+':10033/'; 
}