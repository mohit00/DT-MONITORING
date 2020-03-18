import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';

import { egretAnimations } from "app/shared/animations/egret-animations";
import { ThemeService } from "app/shared/services/theme.service";
import tinyColor from 'tinycolor2';
import * as Highcharts from 'highcharts';
import * as HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import more from 'highcharts/highcharts-more';
more(Highcharts);
import solid from 'highcharts/modules/solid-gauge';
import { webService } from "app/shared/services/webService";
import { DatePipe } from "@angular/common";
solid(Highcharts);
// Now init modules:
import { AuthDialogComponent } from '../../../auth-dialog/auth-dialog.component'
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
declare module 'highcharts' {
  interface Point {
    highlight: (event: Highcharts.PointerEventObject) => void;
  }
}


/**
* Override the reset function, we don't need to hide the tooltips and
* crosshairs.
*/
Highcharts.Pointer.prototype.reset = function () {
  return undefined;
};

/**
* Highlight a point by showing tooltip, setting hover state and draw crosshair
*/
Highcharts.Point.prototype.highlight = function (event) {
  event = this.series.chart.pointer.normalize(event);
  this.onMouseOver(event); // Show the hover marker
  this.series.chart.tooltip.refresh(this); // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};


let self = this;
@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
  animations: egretAnimations,

})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  alertState: any = 1;
  displayedColumns: string[] = ['position', 'Name', 'Meter No', 'KWh', 'KVAh', 'Volt(R | Y | B)', 'Current(R | Y | B)', 'PF(R | Y | B)', 'Instant', 'M.D', 'Status', 'Last Updated'];
  dataSource: any;
  staticDataToRun = {
    userName: 'dtpoc',
    password: 'dtpoc',
    parentId: '5e3138c378d749.69075482'
  }
  trafficVsSaleOptions: any;
  trafficVsSale: any;
  trafficData: any;
  saleData: any;

  sessionOptions: any;
  sessions: any;
  sessionsData: any;

  trafficGrowthChart: any;
  bounceRateGrowthChart: any;

  dailyTrafficChartBar: any;
  trafficSourcesChart: any;
  countryTrafficStats: any[];
  Highcharts = Highcharts; // required
  chartConstructor = 'chart'; // optional string, defaults to 'chart'

  meterchart;
  meterkvLinchartupdateFlag = false; // optional boolean
  temprature1updateFlag: boolean = false;
  temprature1chart: any;
  temprature1Callback = (chart) => {

    this.temprature1chart = chart;
  }
  temprature1Option =
    {
      chart: {
        type: "spline",
        backgroundColor: 'transparent',
        zoomType: 'x',
        color: '#ff0000'

      }, legend: {
        labelFormatter: function () {

          return '<span style="color: ' + this.color + '">' + this.name + '</span>';

        }
      },


      title: {
        text: ""
      },
      subtitle: {
        text: "Temperature",
        style: {
          color: 'red'
        }
      },
      xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        visible: false,
        style: {
          color: 'red'
        }
      },
      yAxis: {
        title: {
          text: "Temperature",

        },
        style: {
          color: 'red'
        }

      },
      plotOptions: {
        series: {
          dataLabels: {
            visible: false,
            enabled: false,

          },

        }
      },
      tooltip: {
        formatter: function () {
          // console.log(self.meterkvLinchartOptions.series)

          var index = this.series.data.indexOf(this.point);
          var graphdata = JSON.parse(sessionStorage.getItem('setgraph'))
          return `Time :- ${this.point.category} KW:-  ${graphdata[0].data[index]} , R(AMP):- ${graphdata[1].data[index]}  , Y(AMP):- ${graphdata[2].data[index]}, B(AMP):- ${graphdata[3].data[index]}`;
        }
      },
      series: [{
        name: '',
        data: [],
        color: '#00ff00'

      }
      ]
    }
  // Add some life
  temprature2updateFlag: boolean = false;
  temprature2chart: any;
  temprature2Callback = (chart) => {

    this.temprature2chart = chart;
  }
  temprature2Option = {
    chart: {
      type: 'gauge',
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false
    },

    title: {
      text: 'Temprature'
    },

    pane: {
      startAngle: -150,
      endAngle: 150,
      background: [{
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, '#FFF'],
            [1, '#333']
          ]
        },
        borderWidth: 0,
        outerRadius: '109%'
      }, {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, '#333'],
            [1, '#FFF']
          ]
        },
        borderWidth: 1,
        outerRadius: '107%'
      }, {
        // default background
      }, {
        backgroundColor: '#DDD',
        borderWidth: 0,
        outerRadius: '105%',
        innerRadius: '103%'
      }]
    },

    // the value axis
    yAxis: {
      min: 0,
      max: 200,

      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#666',

      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 10,
      tickColor: '#666',
      labels: {
        step: 2,
        rotation: 'auto'
      },
      title: {
        text: '°C'
      },
      plotBands: [{
        from: 0,
        to: 120,
        color: '#55BF3B' // green
      }, {
        from: 120,
        to: 160,
        color: '#DDDF0D' // yellow
      }, {
        from: 160,
        to: 200,
        color: '#DF5353' // red
      }]
    },

    series: [{
      name: 'Speed',
      data: [80],
      tooltip: {
        valueSuffix: ' °C'
      }
    }]

  }
  meterkvLinchartOptions =
    {
      chart: {
        type: "spline",
        backgroundColor: 'transparent',
        zoomType: 'x',
        color: '#ff0000'

      }, legend: {
        labelFormatter: function () {

          return '<span style="color: ' + this.color + '">' + this.name + '</span>';

        }
      },


      title: {
        text: ""
      },
      subtitle: {
        text: "Instant Load Data",
        style: {
          color: 'red'
        }
      },
      xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        visible: false,
        style: {
          color: 'red'
        }
      },
      yAxis: {
        title: {
          text: "Load",

        },
        style: {
          color: 'red'
        }

      },
      plotOptions: {
        series: {
          dataLabels: {
            visible: false,
            enabled: false,

          },

        }
      },
      tooltip: {
        formatter: function () {
          // console.log(self.meterkvLinchartOptions.series)

          var index = this.series.data.indexOf(this.point);
          var graphdata = JSON.parse(sessionStorage.getItem('setgraph'))
          return `Time :- ${this.point.category} KW:-  ${graphdata[0].data[index]} , R(AMP):- ${graphdata[1].data[index]}  , Y(AMP):- ${graphdata[2].data[index]}, B(AMP):- ${graphdata[3].data[index]}`;
        }
      },
      series: [{
        name: '',
        data: [],
        color: '#00ff00'
      }, {
        name: '',
        data: [],
        color: 'red'

      }, {
        name: '',
        data: [],
        color: 'yellow'

      }, {
        name: '',
        data: [],
        color: 'blue'

      }
      ]
    };
  alarmIndex: any = 0;
  Kv11datalist: any;
  Kv33datalist: any;
  alarmFunctionDetail(data) {
  }
  setAlarm: any = {};
  timeOut: any;
  continueBoolean: Boolean = true;
  mouseIn() {
    clearTimeout(this.outertimeOut);
    clearTimeout(this.innertime);
    this.continueBoolean = false;
  }
  mouseOut() {
    this.continueBoolean = true;
    this.alarmFunction(this.alarmList);
  }
  outertimeOut: any;
  innertime: any;
  alarmFunction(data) {
    if (this.alarmIndex == data.length) {
      this.alarmIndex = 1
    }
    if (this.alarmIndex < data.length) {
      this.outertimeOut = setTimeout(() => {
        if (this.alarmIndex != 0) {
          if (this.continueBoolean) {

            this.alertState = 0;
          }
        }
        this.setAlarm = data[this.alarmIndex];
        this.innertime = setTimeout(() => {
          this.alertState = 1;

          if (this.continueBoolean) {
            this.alarmIndex = this.alarmIndex + 1;

            this.alarmFunction(this.alarmList);
          }
        }, 1000)
      }, 3000)
    }
  }
  tempratureget() {

  }
  alarmList: any = [];
  getAlarm() {
    this.alarmIndex = 0;
    this.webService.alarmGet().subscribe(res => {
      this.alarmList = res['resource'];
      this.alarmFunction(res['resource']);
    })
  }
  formgroup: FormGroup;
  sesorSource = [];


  changeGraph() {
     if (this.formgroup.valid) {
      // this.stateSensor_data();
   
   
      this.formgroup.value.newDate = this.pipe.transform(this.formgroup.value.date, "yyyy-MM-dd")
this.ambientLoad();

    }
  }
  connectedMeter: any = false;
  constructor(
    private dialogrefs: MatDialog,
    private AppLoaderService: AppLoaderService,
    private themeService: ThemeService,
    private webService: webService,
    private fb: FormBuilder,
    private pipe: DatePipe,
    private dialog: AppConfirmService
  ) {
    this.formgroup =this.fb.group({
      date:new Date(),
      newDate:new Date()
    })
    this.webService.onRefresh.subscribe(status => {
      if (status) {
        this.meterBoxData();
      }
    });


  }
  meterkvLinchartCallback = (chart) => {

    this.meterchart = chart;
  }
  headerCount: any = {};
  meterBoxData() {

  }
  changeCutoff(data) {
  }
  meterStatusgert() {

  }
  customMeterList() {


  }

  currentRData: any;
  currentYData: any;
  currentBData: any;
  voltageRData: any;
  voltageYData: any;
  voltageBData: any;
  currentR() {

  }
  currentY() {


  }
  currentB() {


  }
  voltageR() {


  }
  voltageY() {



  }
  voltageB() {


  }
  rows = [];
  columns = [];
  temp = [];

  meterList: any = [{
    id: '5e3135ab16f192.22366204',
    name: '11/KV'
  }, {
    id: '5e3135ab16f192.22366204',
    name: '33/KV'
  }];
  doSomethingWithCurrentValue(e) { }
  ngAfterViewInit() {
    this.tempratureget();
    this.getAlarm();
    this.getTempratureData();
    this.meterBoxData();
    this.customMeterList();
    this.Kv11data();
    this.Kv33data();
    this.changeGraph();
  }
  ngOnInit() {
    setTimeout(() => {
      this.meterkvLinchartupdateFlag = true;
      this.meterchart.reflow();

      this.loadupdateFlag = true;
      this.loadchart.reflow();
    }, 1000)
    this.themeService.onThemeChange.subscribe(activeTheme => {
      this.initTrafficVsSaleChart(activeTheme);
      this.initSessionsChart(activeTheme);
      this.initTrafficSourcesChart(activeTheme)
      this.initDailyTrafficChartBar(activeTheme)
      this.initTrafficGrowthChart(activeTheme)

    });
    this.initTrafficVsSaleChart(this.themeService.activatedTheme);
    this.initSessionsChart(this.themeService.activatedTheme);
    this.initTrafficSourcesChart(this.themeService.activatedTheme)
    this.initDailyTrafficChartBar(this.themeService.activatedTheme)
    this.initTrafficGrowthChart(this.themeService.activatedTheme)
    this.rows = this.temp = [{
      index: 1,
      action: '',
      name: "Meter 1",

    },
    {
      index: 2,
      action: '',
      name: "Meter 2",
    },
    {
      index: 3,
      action: '',
      name: "Meter 3",
    }, {
      index: 4,
      action: '',
      name: "Meter 4",
    }, {
      index: 5,
      action: '',
      name: "Meter 5",
    }, {
      index: 6,
      action: '',
      name: "Meter 6",
    }, {
      index: 7,
      action: '',
      name: "Meter 7",
    }, {
      index: 8,
      action: '',
      name: "Meter 8",
    }]
    this.countryTrafficStats = [
      {
        country: "US",
        visitor: 14040,
        pageView: 10000,
        download: 1000,
        bounceRate: 30,
        flag: "flag-icon-us"
      },
      {
        country: "India",
        visitor: 12500,
        pageView: 10000,
        download: 1000,
        bounceRate: 45,
        flag: "flag-icon-in"
      },
      {
        country: "UK",
        visitor: 11000,
        pageView: 10000,
        download: 1000,
        bounceRate: 50,
        flag: "flag-icon-gb"
      },
      {
        country: "Brazil",
        visitor: 4000,
        pageView: 10000,
        download: 1000,
        bounceRate: 30,
        flag: "flag-icon-br"
      },
      {
        country: "Spain",
        visitor: 4000,
        pageView: 10000,
        download: 1000,
        bounceRate: 45,
        flag: "flag-icon-es"
      },
      {
        country: "Mexico",
        visitor: 4000,
        pageView: 10000,
        download: 1000,
        bounceRate: 70,
        flag: "flag-icon-mx"
      },
      {
        country: "Russia",
        visitor: 4000,
        pageView: 10000,
        download: 1000,
        bounceRate: 40,
        flag: "flag-icon-ru"
      }
    ];


    this.bounceRateGrowthChart = {
      tooltip: {
        trigger: "axis",

        axisPointer: {
          animation: true
        }
      },
      grid: {
        left: "0",
        top: "0",
        right: "0",
        bottom: "0"
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["0", "1", "2", "3", "4"],
        axisLabel: {
          show: false
        },
        axisLine: {
          lineStyle: {
            show: false
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 200,
        interval: 50,
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: "Bounce Rate",
          type: "line",
          smooth: false,
          data: [0, 20, 90, 120, 190],
          symbolSize: 8,
          showSymbol: false,
          lineStyle: {
            opacity: 0,
            width: 0
          },
          itemStyle: {
            borderColor: "rgba(233, 31, 99, 0.4)"
          },
          areaStyle: {
            normal: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(244, 67, 54, 1)"
                  },
                  {
                    offset: 1,
                    color: "rgba(244, 67, 54, .4)"
                  }
                ]
              }
            }
          }
        }
      ]
    };
  }

  initTrafficVsSaleChart(theme) {
    this.trafficVsSaleOptions = {
      tooltip: {
        show: true,
        trigger: "axis",
        backgroundColor: "#fff",
        extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); color: #444",
        axisPointer: {
          type: "line",
          animation: true
        }
      },
      grid: {
        top: "10%",
        left: "80px",
        right: "30px",
        bottom: "60"
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15"
        ],
        axisLabel: {
          show: true,
          margin: 20,
          color: "#888"
        },
        axisTick: {
          show: false
        },

        axisLine: {
          show: false,
          lineStyle: {
            show: false
          }
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          margin: 30,
          color: "#888"
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed"
          }
        }
      },
      series: [
        {
          name: "Traffic",
          label: { show: false, color: "#0168c1" },
          type: "bar",
          barGap: 0,
          color: tinyColor(theme.baseColor).setAlpha(.4).toString(),
          smooth: true
        },
        {
          name: "Sales",
          label: { show: false, color: "#639" },
          type: "bar",
          color: tinyColor(theme.baseColor).toString(),
          smooth: true
        }
      ]
    };

    this.trafficData = [
      1400,
      1350,
      950,
      1150,
      950,
      1260,
      930,
      1450,
      1150,
      1400,
      1350,
      950,
      1150,
      950,
      1260
    ];
    this.saleData = [
      500,
      700,
      350,
      840,
      750,
      800,
      700,
      500,
      700,
      650,
      104,
      750,
      800,
      700,
      500
    ];
    this.trafficVsSale = {
      series: [
        {
          data: this.trafficData
        },
        {
          data: this.saleData
        }
      ]
    };
  }

  initSessionsChart(theme) {
    this.sessionOptions = {
      tooltip: {
        show: true,
        trigger: "axis",
        backgroundColor: "#fff",
        extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); color: #444",
        axisPointer: {
          type: "line",
          animation: true
        }
      },
      grid: {
        top: "10%",
        left: "60",
        right: "15",
        bottom: "60"
      },
      xAxis: {
        type: "category",
        data: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30"
        ],
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          margin: 30,
          color: "#888"
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          margin: 20,
          color: "#888"
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed"
          }
        }
      },
      series: [
        {
          data: [],
          type: "line",
          name: "User",
          smooth: true,
          color: tinyColor(theme.baseColor).toString(),
          lineStyle: {
            opacity: 1,
            width: 3
          },
          itemStyle: {
            opacity: 0
          },
          emphasis: {
            itemStyle: {
              color: "rgba(16, 23, 76, 1)",
              borderColor: "rgba(16, 23, 76, .4)",
              opacity: 1,
              borderWidth: 8
            },
            label: {
              show: false,
              backgroundColor: "#fff"
            }
          }
        }
      ]
    };
    this.sessionsData = [
      140,
      135,
      95,
      115,
      95,
      126,
      93,
      145,
      115,
      140,
      135,
      95,
      115,
      95,
      126,
      125,
      145,
      115,
      140,
      135,
      95,
      115,
      95,
      126,
      93,
      145,
      115,
      140,
      135,
      95
    ];

    this.sessions = {
      series: [
        {
          data: this.sessionsData
        }
      ]
    };
  }

  initTrafficSourcesChart(theme) {
    this.trafficSourcesChart = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      color: [
        tinyColor(theme.baseColor).setAlpha(.6).toString(),
        tinyColor(theme.baseColor).setAlpha(.7).toString(),
        tinyColor(theme.baseColor).setAlpha(.8).toString()
      ],
      tooltip: {
        show: false,
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      xAxis: [
        {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],

      series: [
        {
          name: "Sessions",
          type: "pie",
          radius: ["55%", "85%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          hoverOffset: 5,
          stillShowZeroSum: false,
          label: {
            normal: {
              show: false,
              position: "center",
              textStyle: {
                fontSize: "13",
                fontWeight: "normal"
              },
              formatter: "{a}"
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: "15",
                fontWeight: "normal",
                color: "rgba(15, 21, 77, 1)"
              },
              formatter: "{b} \n{c} ({d}%)"
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            {
              value: 335,
              name: "Direct"
            },
            {
              value: 310,
              name: "Search Eng."
            },
            { value: 148, name: "Social" }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
  }

  initDailyTrafficChartBar(theme) {
    this.dailyTrafficChartBar = {
      legend: {
        show: false
      },
      grid: {
        left: "8px",
        right: "8px",
        bottom: "0",
        top: "0",
        containLabel: true
      },
      tooltip: {
        show: true,
        backgroundColor: "rgba(0, 0, 0, .8)"
      },
      xAxis: [
        {
          type: "category",
          // data: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          data: ["1", "2", "3", "4", "5", "6", "7"],
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: "#fff"
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            show: false,
            formatter: "${value}"
          },
          min: 0,
          max: 100000,
          interval: 25000,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false,
            interval: "auto"
          }
        }
      ],

      series: [
        {
          name: "Online",
          data: [35000, 69000, 22500, 60000, 50000, 50000, 30000],
          label: { show: true, color: tinyColor(theme.baseColor).toString(), position: "top" },
          type: "bar",
          barWidth: "12",
          color: tinyColor(theme.baseColor).toString(),
          smooth: true,
          itemStyle: {
            barBorderRadius: 10
          }
        }
      ]
    };
  }

  initTrafficGrowthChart(theme) {
    this.trafficGrowthChart = {
      tooltip: {
        trigger: "axis",

        axisPointer: {
          animation: true
        }
      },
      grid: {
        left: "0",
        top: "0",
        right: "0",
        bottom: "0"
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["0", "1", "2", "3", "4"],
        axisLabel: {
          show: false
        },
        axisLine: {
          lineStyle: {
            show: false
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 200,
        interval: 50,
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: "Visit",
          type: "line",
          smooth: false,
          data: [0, 40, 140, 90, 160],
          symbolSize: 8,
          showSymbol: false,
          lineStyle: {
            opacity: 0,
            width: 0
          },
          itemStyle: {
            borderColor: "rgba(233, 31, 99, 0.4)"
          },
          areaStyle: {
            normal: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: tinyColor(theme.baseColor).toString()
                  },
                  {
                    offset: 1,
                    color: tinyColor(theme.baseColor).setAlpha(.6).toString()
                  }
                ]
              }
            }
          }
        }
      ]
    };
  }
  temperatureData: any;
  getTempratureData() {
    this.webService.getTemDta(this.staticDataToRun.userName, this.staticDataToRun.password).subscribe(res => {
      this.temperatureData = res['resource'];
      this.temprature1stOption.series[0].data = [];
      this.temprature1stOption.series[0].data.push(res['resource'].reading[0].value);
      this.temprature2stOption.series[0].data = [];
      this.temprature2stOption.series[0].data.push(res['resource'].reading[1].value);

      //  temprature2stupdateFlag:boolean = false;
      // temprature2stchart:any;
      this.temprature2stupdateFlag = false;

      this.temprature1stupdateFlag = false;
      this.temprature1stchart.reflow();
      setTimeout(() => {
        this.temprature1stupdateFlag = true;
        this.temprature1stchart.reflow();
        this.temprature2stupdateFlag = true;
        this.temprature2stchart.reflow();

      }, 1000)
    })
  }
  Kv11data(){
    this.webService.Kv11data().subscribe(res=>{
      console.log("11KV" + JSON.stringify(res))
      this.Kv11datalist = res['resource']
      this.loadOption.series[0].data= []
      this.loadOption.series[0].data.push(this.Kv11datalist.R_Load)
      this.loadupdateFlag = false;
    
      setTimeout(() => {
        this.loadupdateFlag = true;
        this.loadchart.reflow();
   
      }, 1000)

    })
  }
  Kv33data(){
    this.webService.Kv33data().subscribe(res=>{
      console.log("33KV" + JSON.stringify(res))
      this.Kv33datalist = res['resource'] 

     
    })

  }
   temprature1stupdateFlag: boolean = false;
  temprature1stchart: any;
  temprature1stCallback = (chart) => {
    this.temprature1stchart = chart;
  }
  temprature1stOption = {
    chart: {
      type: 'gauge',
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false
    }, 
    title: {
      text: ''
    }, 
    pane: {
      startAngle: -150,
      endAngle: 150,
      background: [{
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, '#FFF'],
            [1, '#333']
          ]
        },
        borderWidth: 0,
        outerRadius: '109%'
      }, {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, '#333'],
            [1, '#FFF']
          ]
        },
        borderWidth: 1,
        outerRadius: '107%'
      }, {
        // default background
      }, {
        backgroundColor: '#DDD',
        borderWidth: 0,
        outerRadius: '105%',
        innerRadius: '103%'
      }]
    }, 
    // the value axis
    yAxis: {
      min: 0,
      max: 200, 
      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#666',

      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 10,
      tickColor: '#666',
      labels: {
        step: 2,
        rotation: 'auto'
      },
      title: {
        text: 'Temp'
      },
      plotBands: [{
        from: 0,
        to: 120,
        color: '#55BF3B' // green
      }, {
        from: 120,
        to: 160,
        color: '#DDDF0D' // yellow
      }, {
        from: 160,
        to: 200,
        color: '#DF5353' // red
      }]
    },

    series: [{
      name: 'Temperature',
      data: [52],
      tooltip: {
        valueSuffix: '<span>°C</span>'
      }
    }]

  }
  // Add some life
  temprature2stupdateFlag: boolean = false;
  temprature2stchart: any;
  temprature2stOption = {
    chart: {
      type: 'gauge',
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    title: {
      text: ''
    },
    pane: {
      startAngle: -150,
      endAngle: 150,
      background: [{
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, '#FFF'],
            [1, '#333']
          ]
        },
        borderWidth: 0,
        outerRadius: '109%'
      }, {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, '#333'],
            [1, '#FFF']
          ]
        },
        borderWidth: 1,
        outerRadius: '107%'
      }, {
        // default background
      }, {
        backgroundColor: '#DDD',
        borderWidth: 0,
        outerRadius: '105%',
        innerRadius: '103%'
      }]
    },
    // the value axis
    yAxis: {
      min: 0,
      max: 200,
      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#666',
      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 10,
      tickColor: '#666',
      labels: {
        step: 2,
        rotation: 'auto'
      },
      title: {
        text: 'Temp'
      },
      plotBands: [{
        from: 0,
        to: 120,
        color: '#55BF3B' // green
      }, {
        from: 120,
        to: 160,
        color: '#DDDF0D' // yellow
      }, {
        from: 160,
        to: 200,
        color: '#DF5353' // red
      }]
    },

    series: [{
      name: 'Temperature',
      data: [62],
      tooltip: {
        valueSuffix: '<span>°C</span>'
      }
    }]

  }
  loadupdateFlag: boolean = false;
  loadchart: any;
  loadCallback = (chart) => {

    this.loadchart = chart;
  }
  loadOption = {
    chart: {
      type: 'solidgauge'
    },

    title: null,

    pane: {
      center: ['50%', '85%'],
      size: '100%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },

    exporting: {
      enabled: false
    },

    tooltip: {
      enabled: false
    },

    // the value axis
    yAxis: {
      min: 0,
      max: 10,

      stops: [
        [0.1, '#55BF3B'], // green
        [0.5, '#DDDF0D'], // yellow
        [0.9, '#DF5353'] // red
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      title: {
        text: 'Load',
        y: -70
      },
      labels: {
        y: 16
      }
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    },
    series: [{
      name: 'Load',
      data: [5.52],
      dataLabels: {
        format:
          '<div style="text-align:center">' +
          '<span style="font-size:25px">{y}</span><br/>' +
          '<span style="font-size:12px;opacity:0.4">MVA</span>' +
          '</div>'
      },
      tooltip: {
        valueSuffix: ' MVA'
      }
    }]
  }

  synchronizeTooltips = (e: any) => {
    var chart,
      point,
      i,
      event,
      charts = Highcharts.charts,
      sourceChart = charts[(Highcharts as any).hoverChartIndex]; // resolve lack of definitions

    for (i = 0; i < charts.length; i = i + 1) {
      chart = charts[i];

      if (
        // Could be undefined for a removed chart
        chart &&
        // Only sync charts with shared class
        (
          chart.options.chart &&
          chart.options.chart.className
        ) === (
          sourceChart.options.chart &&
          sourceChart.options.chart.className
        )
      ) {
        // Find coordinates within the chart
        event = chart.pointer.normalize(e);

        // Get the hovered point
        point = (chart.series[0] as any).searchPoint(event, true); // resolve lack of definitions

        if (point) {
          point.highlight(e);
        }
      }
    }
  };
ambientLoad(){
   this.webService.ambientLoad(this.formgroup.value.newDate).subscribe(res=>{
    console.log("Ambient"+JSON.stringify(res))
    this.chartOptions1.xAxis['categories']=[];
    this.chartOptions1.series[0]['data'] =[];
    this.chartOptions1.xAxis['categories'] = res['resource'].time
    this.chartOptions1.series[0]['data'] = res['resource'].reading
    this.chartOptions1updateFlag = false;
    
    setTimeout(() => {
      this.chartOptions1updateFlag = true;
      this.chartOptions1chart.reflow();
 
    }, 1000)
    this.wtiLoad();
  })
}
wtiLoad(){
  this.webService.wtiLoad(this.formgroup.value.newDate).subscribe(res=>{
    console.log("w"+JSON.stringify(res))
    this.chartOptions2.xAxis['categories']=[];
    this.chartOptions2.series[0]['data'] =[];
    this.chartOptions2.xAxis['categories'] = res['resource'].time
    this.chartOptions2.series[0]['data'] = res['resource'].reading
    this.chartOptions2updateFlag = false;
    
    setTimeout(() => {
      this.chartOptions2updateFlag = true;
      this.chartOptions2chart.reflow();
 
    }, 1000)
    this.Load();
  })
}
 Load(){
  this.webService.Load(this.formgroup.value.newDate).subscribe(res=>{
    this.chartOptions3.xAxis['categories']=[];
    this.chartOptions3.series[0]['data'] =[];
    this.chartOptions3.xAxis['categories'] = res['resource'].time
    this.chartOptions3.series[0]['data'] = res['resource'].reading
    this.chartOptions3updateFlag = false;
    
    setTimeout(() => {
      this.chartOptions3updateFlag = true;
      this.chartOptions3chart.reflow();
 
    }, 1000)

  })
}
  chartOptions1updateFlag: boolean = false;
  chartOptions1chart: any;
  chartOptions1Callback = (chart) => {
    this.chartOptions1chart = chart;
  }
  chartOptions2updateFlag: boolean = false;
  chartOptions2chart: any;
  chartOptions2Callback = (chart) => {
    this.chartOptions2chart = chart;
  }
  chartOptions3updateFlag: boolean = false;
  chartOptions3chart: any;
  chartOptions3Callback = (chart) => {
    this.chartOptions3chart = chart;
  }
  chartOptions1: Highcharts.Options = {
    chart: {
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20,
      className: "chart-sync-b",
      zoomType: 'x',
    },
    title: {
      text: "Ambient Temperature",
      align: "left",
      margin: 0,
      x: 30
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    xAxis: {
      visible:false,
      categories: ["1", "2", "3", "4", "5", "6",
        "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],

      crosshair: true,
      events: {
        setExtremes: function (e: any) {
          var thisChart = (this as Highcharts.Axis).chart;

          if (e.trigger !== "syncExtremes") {
            // Prevent feedback loop
            Highcharts.charts.forEach(function (chart) {
              if (
                chart !== thisChart &&
                (
                  chart.options.chart &&
                  chart.options.chart.className
                ) === (
                  thisChart.options.chart &&
                  thisChart.options.chart.className
                )
              ) {
                if (chart.xAxis[0].setExtremes) {
                  // It is null while updating
                  chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
                    trigger: "syncExtremes"
                  });
                }
              }
            });
          }
        }
      },
      labels: {
        format: "{value}"
      }
    },
    yAxis: {
      title: {
        text: null
      }
    },
    tooltip: {
      positioner: function () {
        return {
          // right aligned
          x: (this as Highcharts.Tooltip).chart.chartWidth - (this as any).label.width, // resolve lack of definitions
          y: 10 // align to title
        };
      },
      borderWidth: 0,
      backgroundColor: "none",
      pointFormat: "{point.y} °C   Date:- {point.category}",
      headerFormat: "",
      shadow: false,
      style: {
        fontSize: "18px"
      }
    },
    series: [
      {
        data: [29, 25, 24, 24, 25, 24, 23, 25, 26, 25, 22, 24, 29, 25, 24, 24, 25, 24, 23, 25, 26, 25, 22, 24],
        name: "Ambient Temperature",
        color:"#4caf50"
      } as Highcharts.SeriesLineOptions
    ]
  };

  chartOptions2: Highcharts.Options = {
    chart: {
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20,
      className: "chart-sync-a",
      zoomType: 'x',
    },
    title: {
      text: "Winding Temperature",
      align: "left",
      margin: 0,
      x: 30
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    xAxis: {
      visible:false,
      crosshair: true,
      categories: ["1", "2", "3", "4", "5", "6",
        "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
      events: {
        setExtremes: function (e: any) {
          var thisChart = (this as Highcharts.Axis).chart;

          if (e.trigger !== "syncExtremes") {
            // Prevent feedback loop
            Highcharts.charts.forEach(function (chart) {
              if (
                chart !== thisChart &&
                (
                  chart.options.chart &&
                  chart.options.chart.className
                ) === (
                  thisChart.options.chart &&
                  thisChart.options.chart.className
                )
              ) {
                if (chart.xAxis[0].setExtremes) {
                  // It is null while updating
                  chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
                    trigger: "syncExtremes"
                  });
                }
              }
            });
          }
        }
      },
      labels: {
        format: "{value}"
      }
    },
    yAxis: {
      title: {
        text: null
      }
    },
    tooltip: {
      positioner: function () {
        return {
          // right aligned
          x: (this as Highcharts.Tooltip).chart.chartWidth - (this as any).label.width, // resolve lack of definitions
          y: 10 // align to title
        };
      },
      borderWidth: 0,
      backgroundColor: "none",
      pointFormat: "{point.y} °C   Date:- {point.category}",
      headerFormat: "",
      shadow: false,
      style: {
        fontSize: "18px"
      }
    },
    series: [
      {
        data: [40, 41, 40, 42, 41, 41, 40, 41, 40, 40, 42, 46, 40, 41, 40, 42, 41, 41, 40, 41, 40, 40, 42, 46],
        name: "Sync group A (second)",
        color:"#ba450b"

      } as Highcharts.SeriesLineOptions
    ]
  };

  chartOptions3: Highcharts.Options = {
    chart: {
      marginLeft: 40, // Keep all charts left aligned
      spacingTop: 20,
      spacingBottom: 20,
      className: "chart-sync-a",
      zoomType: 'x', 
      
    },
    title: {
      text: "Load (MVA)",
      align: "left",
      margin: 0,
      x: 30
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    xAxis: {
      title: { text: '<b>Hours</b>' },
visible:false,
      crosshair: true,
      categories: ["1", "2", "3", "4", "5", "6",
        "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],

      events: {
        setExtremes: function (e: any) {
          var thisChart = (this as Highcharts.Axis).chart;

          if (e.trigger !== "syncExtremes") {
            // Prevent feedback loop
            Highcharts.charts.forEach(function (chart) {
              if (
                chart !== thisChart &&
                (
                  chart.options.chart &&
                  chart.options.chart.className
                ) === (
                  thisChart.options.chart &&
                  thisChart.options.chart.className
                )
              ) {
                if (chart.xAxis[0].setExtremes) {
                  // It is null while updating
                  chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
                    trigger: "syncExtremes"
                  });
                }
              }
            });
          }
        }
      },
      labels: {
        format: "{value}"
      }
    },
    yAxis: {
      title: {
        text: null
      }
    },
    tooltip: {
      positioner: function () {
        return {
          // right aligned
          x: (this as Highcharts.Tooltip).chart.chartWidth - (this as any).label.width, // resolve lack of definitions
          y: 10 // align to title
        };
      },
      borderWidth: 0,
      backgroundColor: "none",
      pointFormat: "{point.y} MVA   Date:- {point.category}",
      headerFormat: "",
      shadow: false,
      style: {
        fontSize: "18px"
      }
    },
    series: [
      {
        data: [3, 3.1, 3.1, 3.1, 2.9, 3.2, 3.4, 3.6, 2.8, 2.9, 3.1, 2.9, 3.1, 3, 3.1, 3.1, 3.1, 2.9, 3.2, 3.4, 3.6, 2.8, 2.9, 3.1],
        name: "Sync group B",
        color:"#063b6e"
      } as Highcharts.SeriesLineOptions
    ]
  };
}
