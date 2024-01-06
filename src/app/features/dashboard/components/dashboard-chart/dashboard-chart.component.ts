import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { CategoryService } from 'src/app/features/category/services/category.service';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent implements OnInit {
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;

  chart: any;
  selectedDate?: string;
  selectedPeriodType = 'day';
  selectedDataView = 'expenses'; 

  constructor(
    private _dashboardService: DashboardService,
    private _categoryService: CategoryService 
  ) { }

  ngOnInit(): void {
    this.loadDataBasedOnSelection();
    this.selectedDate = this.getCurrentFormattedDate();
  }

  getCurrentFormattedDate(): string {
    const today = new Date();
    return today.toISOString().substring(0, 10); 
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.loadDataBasedOnSelection();
  }

  onPeriodTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPeriodType = select.value;
    this.loadDataBasedOnSelection();
  }

  formatDateToBackendFormat(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  loadDataBasedOnSelection(): void {
    const formattedDate = this.formatDateToBackendFormat(this.selectedDate ? this.selectedDate : this.getCurrentFormattedDate());

    if (this.selectedDataView === 'expenses') {
      switch (this.selectedPeriodType) {
        case 'day':
          this._dashboardService.getExpensesByDay(formattedDate).subscribe(data => this.createChart(data));
          break;
        case 'week':
          this._dashboardService.getExpensesByWeek(formattedDate).subscribe(data => this.createChart(data));
          break;
        case 'month':
          this._dashboardService.getExpensesByMonth(formattedDate).subscribe(data => this.createChart(data));
          break;
        case 'year':
          this._dashboardService.getExpensesByYear(formattedDate).subscribe(data => this.createChart(data));
          break;
      }
      
    }
  }

  loadChartData(dateString: string): void {
    forkJoin({
      categories: this._categoryService.getAll(),
      expenses: this._dashboardService.getExpensesByDay(dateString)
    }).subscribe({
      next: ({ categories, expenses }) => {
        // Créez un objet pour mapper les catégories avec leur montant total
        let categoryTotals: { [key: string]: number } = {};
  
        expenses.forEach(expense => {
          const category = categories.find(c => c.id === expense.category_Id);
          const categoryName = category ? category.category_Name : 'Inconnue';
          
          // Initialisez la catégorie dans l'objet si elle n'existe pas encore
          if (!categoryTotals[categoryName]) {
            categoryTotals[categoryName] = 0;
          }
  
          // Accumulez les montants pour chaque catégorie
          categoryTotals[categoryName] += expense.amount;
        });
  
        // Transformez l'objet en tableau pour le graphique
        const groupedData = Object.entries(categoryTotals).map(([name, amount]) => ({ categoryName: name, amount }));
  
        console.log("Grouped data:", groupedData);
        this.createChart(groupedData);
      },
      error: (err) => console.error('Erreur lors du chargement des données', err)
    });
  }
  
  
  
  createChart(data: any[]): void {
    if (this.chart) {
        this.chart.destroy();
    }
    
    const chartData = {
        datasets: [{
            data: data.map((d: any) => d.amount),
            backgroundColor: this.generateColors(data.length), 
            hoverOffset: 4,
        }],
        labels: data.map((d: any) => d.categoryName),
    };

    console.log("Données du graphique:", chartData);
  
    this.chart = new Chart(this.myChart.nativeElement, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Dépenses par Catégorie'
                }
            }
        }
    });
}

  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${360 * Math.random()}, 50%, 50%)`);
    }
    return colors;
  }
}
