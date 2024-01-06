import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { CategoryService } from 'src/app/features/category/services/category.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent implements AfterViewInit {
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;
  chart: any;


  constructor(
    private _dashboardService: DashboardService,
    private _categoryService: CategoryService 
    ) { }

  ngAfterViewInit() {
    this.loadChartData('05/01/2024');
  }

  loadChartData(dateString: string) {
    forkJoin({
      expenses: this._dashboardService.getExpensesByDay(dateString),
      categories: this._categoryService.getAll()
    }).pipe(
      map(({ expenses, categories }) => {
        const expensesByCategory = new Map();
  
        expenses.forEach(expense => {
          const category = categories.find(c => c.id === expense.category_Id);
          const categoryName = category ? category.category_Name : 'Inconnue';
          const currentAmount = expensesByCategory.get(categoryName) || 0;
          expensesByCategory.set(categoryName, currentAmount + expense.amount);
        });
  
        return Array.from(expensesByCategory, ([categoryName, amount]) => ({ categoryName, amount }));
      })
    ).subscribe({
      next: (groupedData) => {
        this.createChart(groupedData);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données du graphique', err);
      }
    });
  }
  
  createChart(data: any) {
    // Transformation des données
    const chartData = {
      labels: data.map((d: any) => d.categoryName),
      datasets: [{
        label: 'Dépenses par Catégorie',
        data: data.map((d: any) => d.amount),
        backgroundColor: this.generateColors(data.length), 
        hoverOffset: 4
      }]
    };

    // Création du graphique
    this.chart = new Chart(this.myChart.nativeElement, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  generateColors(count: number) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${360 * Math.random()}, 50%, 50%)`);
    }
    return colors;
  }
}
