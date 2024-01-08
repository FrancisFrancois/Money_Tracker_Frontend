import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { Expense } from '../../models/dashboard';
import { ListCategory } from 'src/app/features/category/models/category';
import { CategoryService } from 'src/app/features/category/services/category.service';

// Enregistrement de tous les types de graphiques disponibles dans Chart.js
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
  categories: ListCategory[] = [];
  selectedCategoryId?: number | undefined;
  expenses: Expense[] = [];
  colors: string[] = [];
  

  constructor(
    private _dashboardService: DashboardService,
    private _categoryService: CategoryService
    ) { }

  ngOnInit(): void {
    this.selectedDate = this.getCurrentFormattedDate();
    this.loadDataExpenseByPeriod();
    this.loadCategories();
  }

  getCurrentFormattedDate(): string {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.loadDataExpenseByPeriod();
  }

  onPeriodTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPeriodType = select.value;
    this.loadDataExpenseByPeriod();
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategoryId = selectElement.value ? Number(selectElement.value) : undefined;
    this.loadDataExpenseByPeriod();
  }

  formatDateToBackendFormat(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  loadDataExpenseByPeriod(): void {
    const formattedDate = this.formatDateToBackendFormat(this.selectedDate ? this.selectedDate : this.getCurrentFormattedDate());

    const dataCallback = (expensesData: Expense[]) => {
      this.expenses = this.associateCategoryNames(expensesData, this.categories);
      this.createChart(this.expenses);
    };
    
    switch (this.selectedPeriodType) {
      case 'day':
        this._dashboardService.getExpensesByDay(formattedDate, undefined, undefined, this.selectedCategoryId).subscribe(dataCallback);
        break;
      case 'week':
        this._dashboardService.getExpensesByWeek(formattedDate, undefined, undefined,this.selectedCategoryId).subscribe(dataCallback);
        break;
      case 'month':
        this._dashboardService.getExpensesByMonth(formattedDate, undefined, undefined, this.selectedCategoryId).subscribe(dataCallback);
        break;
      case 'year':
        this._dashboardService.getExpensesByYear(formattedDate, undefined, undefined, this.selectedCategoryId).subscribe(dataCallback);
        break;
    }
  }
  
  
  createChart(data: any[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const chartData = {
      datasets: [{
        data: data.map(d => d.amount),
        backgroundColor: this.generateColors(data.length), 
        hoverOffset: 4,
      }],
      labels: data.map(d => d.categoryName),
    };

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
            text: 'Dépenses par Période'
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

  loadCategories(): void {
    this._categoryService.getAll().subscribe(data => {
      this.categories = data;
    });
  }

  associateCategoryNames(expenses: Expense[], categories: ListCategory[]): any[] {
    // Créer une Map pour un accès rapide aux noms de catégories par ID
    const categoryMap = new Map(categories.map(c => [c.id, c.category_Name]));
  
    // Associer le nom de la catégorie à chaque dépense
    return expenses.map(expense => ({
      ...expense,
      categoryName: categoryMap.get(expense.category_Id) || 'Catégorie Inconnue'
    }));
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    console.log(category?.category_Name);
    return category ? category.category_Name : 'Catégorie Inconnue';
  }
  
  
  
}
