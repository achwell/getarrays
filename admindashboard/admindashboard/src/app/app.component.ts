import {Component, OnInit} from '@angular/core';
import {DashboardService} from "./service/dashboard.service";
import {HttpErrorResponse} from "@angular/common/http";
import {SystemCpu} from "./interface/system-cpu";
import {SystemHealth} from "./interface/system-health";
import * as Chart from "chart.js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public traceList: any[] = [];
  public selectedTrace: any;
  public systemHealth: SystemHealth;
  public systemCpu: number = 0;
  public processUpTime: string = "";
  public http200Traces: any[] = [];
  public http400Traces: any[] = [];
  public http404Traces: any[] = [];
  public http500Traces: any[] = [];
  public httpDefaultTraces: any[] = [];
  private timestamp: number = 0;
  public pageSize: number = 10;
  public page: number = 1;

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.getTraces();
    this.getSystemHealth();
    this.getCpuUsage();
    this.getProcessUpTime(true);
  }

  private getTraces(): void {
    this.dashboardService.getHttpTraces().subscribe(
      (response: any) => this.processTraces(response.traces),
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
      () => {
        this.initializeBarChart();
        this.initializePieChart();
      }
    );
  }

  private getCpuUsage(): void {
    this.dashboardService.getSystemCpu().subscribe(
      (response: SystemCpu) => this.systemCpu = response.measurements[0].value,
      (error: HttpErrorResponse) => alert(error.message)
    );
  }

  private getSystemHealth(): void {
    this.dashboardService.getSystemHealth().subscribe(
      (response: SystemHealth) => {
        this.systemHealth = response;
        this.systemHealth.components.diskSpace.details.free = AppComponent.formatBytes(this.systemHealth.components.diskSpace.details.free);
      },
      (error: HttpErrorResponse) => alert(error.message)
    );
  }

  public onRefreshData(): void {
    this.http200Traces = [];
    this.http400Traces = [];
    this.http404Traces = [];
    this.http500Traces = [];
    this.getTraces();
    this.getSystemHealth();
    this.getCpuUsage();
    this.getProcessUpTime(false);
  }

  private getProcessUpTime(isUpdateTime: boolean) {
    this.dashboardService.getProcessUptime().subscribe(
      (response: any) => {
        this.timestamp = Math.round(response.measurements[0].value);
        this.processUpTime = AppComponent.formateUptime(this.timestamp);
        if (isUpdateTime) {
          this.updateTime();
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public exportTableToExcel(): void {
    const downloadLink = document.createElement('a');
    const dataType = 'application/vnd.ms-excel';
    const table = document.getElementById('httptrace-table') as HTMLTableElement;
    const tableHTML = table.outerHTML.replace(/ /g, '%20');
    const filename = 'httptrace.xls';
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    downloadLink.download = filename;
    downloadLink.click();
  }

  private updateTime(): void {
    setInterval(() => {
      this.processUpTime = AppComponent.formateUptime(this.timestamp + 1);
      this.timestamp++;
    }, 1000);
  }

  private processTraces(traces: any[]): void {
    console.log({traces});

    this.traceList = traces.filter(trace => !trace.request.uri.includes('actuator'));
    console.log(this.traceList);
    this.traceList.forEach(trace => {
      switch (trace.response.status) {
        case 200:
          this.http200Traces.push(trace);
          break;
        case 400:
          this.http400Traces.push(trace);
          break;
        case 404:
          this.http404Traces.push(trace);
          break;
        case 500:
          this.http500Traces.push(trace);
          break;
        default:
          this.httpDefaultTraces.push(trace);
      }
    });
  }

  private initializeBarChart(): Chart {
    const barChartElement = document.getElementById('barChart') as HTMLCanvasElement;
    console.log({barChartElement});
    console.log(this.http200Traces);
    console.log(this.http404Traces.length);
    console.log(this.http400Traces.length);
    console.log(this.http500Traces.length);
    return new Chart(barChartElement, {
      type: "bar",
      data: {
        labels: ['200', '404', '400', '500'],
        datasets: [{
          data: [this.http200Traces.length, this.http404Traces.length, this.http400Traces.length, this.http500Traces.length],
          backgroundColor: ['rgb(40,167,69)', 'rgb(0,123,255)', 'rgb(253,126,20)', 'rgb(220,53,69)'],
          borderColor: ['rgb(40,167,69)', 'rgb(0,123,255)', 'rgb(253,126,20)', 'rgb(220,53,69)'],
          borderWidth: 3
        }]
      },
      options: {
        title: {display: true, text: [`Last 100 Requests as of ${this.formatDate(new Date())}`]},
        legend: {display: false},
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  private initializePieChart(): Chart {
    const element = document.getElementById('pieChart') as HTMLCanvasElement;
    return new Chart(element, {
      type: "pie",
      data: {
        labels: ['200', '404', '400', '500'],
        datasets: [{data: [this.http200Traces.length, this.http404Traces.length, this.http400Traces.length, this.http500Traces.length],
          backgroundColor: ['rgb(40,167,69)', 'rgb(0,123,255)', 'rgb(253,126,20)', 'rgb(220,53,69)'],
          borderColor: ['rgb(40,167,69)', 'rgb(0,123,255)', 'rgb(253,126,20)', 'rgb(220,53,69)'],
          borderWidth: 3
        }]
      },
      options: {
        title: { display: true, text: [`Last 100 Requests as of ${this.formatDate(new Date())}`] },
        legend: { display: true }
      }
    });
  }
  public onSelectTrace(trace: any): void {
    this.selectedTrace = trace;
    let traceModal = document.getElementById('trace-modal');
    if (!traceModal) {
      return;
    }
    traceModal.click();
  }

  private static formateUptime(timestamp: number): string {
    const hours = Math.floor(timestamp / 60 / 60);
    const minutes = Math.floor(timestamp / 60) - (hours * 60);
    const seconds = timestamp % 60;
    return hours.toString().padStart(2, '0') + 'h' + minutes.toString().padStart(2, '0') + 'm' + seconds.toString().padStart(2, '0') + 's';
  }

  private formatDate(date: Date): string {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const year = date.getFullYear();
    if (dd < 10) {
      const day = `0${dd}`;
    }
    if (mm < 10) {
      const month = `0${mm}`;
    }
    return `${dd}.${mm}.${year}`;
  }

  private static formatBytes(bytes: any): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = 2 < 0 ? 0 : 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
