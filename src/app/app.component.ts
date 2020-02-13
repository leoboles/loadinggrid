import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import api from './api';
import { $ } from 'protractor';
import { isNgTemplate } from '@angular/compiler';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('log', { static: false }) log: ElementRef;
  products = [];
  source;
  dataAdapter;
  columns = [];

  async ngOnInit() {
    await api.get('/api/items')
      .then(async (response) => {
        this.source =
        {
            datatype: 'array',
            datafields: [
                { name: 'itemNumber', type: 'string' },
                { name: 'description', type: 'string' },
                { name: 'cost', type: 'number' },
                { name: 'price', type: 'number'},
                { name: 'trendingCost', type: 'number'}
            ],
            localdata: new jqx.observableArray(response.data)
        };

        this.dataAdapter = new jqx.dataAdapter(this.source);
        this.columns =
        [
            { text: 'Item Number', datafield: 'itemNumber' },
            { text: 'Description', datafield: 'description' },
            { text: 'Cost', cellsformat:'c2', datafield: 'cost', visible: 'false'},
            { text: 'Price', cellsformat:'c2', datafield: 'price'},
            { text: 'Trending Cost', cellsformat:'c2', datafield: 'trendingCost', cellsrenderer: this.estimatedPriceRenders },
        ];

      })
  }

  async getFromserver(record: any, row: number){
    await api.get(`/api/items/${record.itemNumber}`)
    .then((response) => {
        record.trendingCost = response.data;
        record.itemNumber = record.itemNumber+' ';
    }).catch((err) => {
        console.log(err);
    });
  }

  estimatedPriceRenders = (row: number, column: any, value: any) => {
    let record = this.source.localdata.get(row);
    let html;
 
    if (record.trendingCost === undefined){
      this.getFromserver(record, row);
      record.trendingCost = null;
    }

    if (!record.trendingCost) {
      html = '<div style="background: display:flex !important; justify-content: center; align-items: center; margin-top: 10px;"><strong> &nbsp Loading...</strong></div>';
    }
    else
    {
      html = '<div style="background: display:flex !important; justify-content: center; align-items: center; margin-top: 10px;"> &nbsp' + record.trendingCost + '$</div>';
    }
    return html;
  }

  scrollfeedback = (row: any): string => {
      return '<table"><tr><td>' + row.itemNumber + '</td></tr></table>';
  };
}