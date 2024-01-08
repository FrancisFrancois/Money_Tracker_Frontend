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
  styleUrls: ['./dashboard-chart.component.scss'],
})
export class DashboardChartComponent implements OnInit {
  // Référence au canvas HTML où le graphique sera affiché.
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;

  // Propriétés utilisées pour stocker les données et les états du composant.
  chart: any; // Instance du graphique Chart.js.
  selectedDate?: string; // Date sélectionnée par l'utilisateur.
  selectedPeriodType = 'day'; // Période sélectionnée (jour, semaine, mois, année).
  categories: ListCategory[] = []; // Catégories chargées depuis le service.
  selectedCategoryId?: number | undefined; // Catégorie sélectionnée.
  expenses: Expense[] = []; // Dépenses chargées depuis le service.

  // Injection des services DashboardService et CategoryService dans le constructeur.
  constructor(
    private _dashboardService: DashboardService,
    private _categoryService: CategoryService
  ) {}

  // Fonction exécutée lors de l'initialisation du composant.
  ngOnInit(): void {
    this.selectedDate = this.getCurrentFormattedDate(); // Définir la date actuelle comme sélectionnée.
    this.loadCategories(); // Charger les catégories.
    this.loadDataExpenseByPeriod(); // Charger les dépenses en fonction de la période.
  }

  // Obtient la date actuelle formatée en yyyy-MM-dd.
  getCurrentFormattedDate(): string {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  }

  // Gestionnaire d'événements pour les changements de date.
  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value; // Mettre à jour la date sélectionnée.
    this.loadDataExpenseByPeriod(); // Recharger les données en fonction de la nouvelle date.
  }

  // Gestionnaire d'événements pour les changements de type de période.
  onPeriodTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPeriodType = select.value; // Mettre à jour la période sélectionnée.
    this.loadDataExpenseByPeriod(); // Recharger les données pour la nouvelle période.
  }

  // Gestionnaire d'événements pour les changements de catégorie.
  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategoryId = selectElement.value
      ? Number(selectElement.value)
      : undefined;
    this.loadDataExpenseByPeriod(); // Recharger les données pour la nouvelle catégorie.
  }

  // Convertit une date au format attendu par le backend.
  formatDateToBackendFormat(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  // Charge les données de dépenses en fonction de la période sélectionnée.
  loadDataExpenseByPeriod(): void {
    const formattedDate = this.formatDateToBackendFormat(
      this.selectedDate ? this.selectedDate : this.getCurrentFormattedDate()
    );

    // Fonction de rappel utilisée pour traiter les données de dépenses.
    const dataCallback = (expensesData: Expense[]) => {
      // Associe les noms de catégorie aux dépenses et stocke le résultat dans 'this.expenses'.
      this.expenses = this.associateCategoryNames(
        expensesData,
        this.categories
      );
      // Crée un graphique avec les données traitées.
      this.createChart(this.expenses);
    };

    // Structure conditionnelle pour charger les données en fonction de la période sélectionnée.
    switch (this.selectedPeriodType) {
      case 'day':
        // Charge les données de dépenses pour le jour sélectionné.
        this._dashboardService
          .getExpensesByDay(
            formattedDate,
            undefined,
            undefined,
            this.selectedCategoryId
          )
          .subscribe(dataCallback);
        break;
      case 'week':
        // Charge les données de dépenses pour la semaine sélectionnée.
        this._dashboardService
          .getExpensesByWeek(
            formattedDate,
            undefined,
            undefined,
            this.selectedCategoryId
          )
          .subscribe(dataCallback);
        break;
      case 'month':
        // Charge les données de dépenses pour le mois sélectionné.
        this._dashboardService
          .getExpensesByMonth(
            formattedDate,
            undefined,
            undefined,
            this.selectedCategoryId
          )
          .subscribe(dataCallback);
        break;
      case 'year':
        // Charge les données de dépenses pour l'année sélectionnée.
        this._dashboardService
          .getExpensesByYear(
            formattedDate,
            undefined,
            undefined,
            this.selectedCategoryId
          )
          .subscribe(dataCallback);
        break;
    }
  }

  // Crée et configure le graphique avec les données fournies.
  createChart(data: any[]): void {
    if (this.chart) {
      this.chart.destroy(); // Détruit l'instance précédente du graphique si elle existe.
    }

    // Préparation des données pour le graphique.
    const chartData = {
      datasets: [
        {
          data: data.map((d) => d.amount), // Utilise les montants des dépenses pour les données du graphique.
          backgroundColor: this.generateColors(data.length), // Génère des couleurs pour chaque segment du graphique.
          hoverOffset: 4,
        },
      ],
      labels: data.map((d) => d.categoryName), // Utilise les noms de catégorie pour les étiquettes du graphique.
    };

    // Création du graphique en utilisant la bibliothèque Chart.js.
    this.chart = new Chart(this.myChart.nativeElement, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Dépenses par Période',
          },
        },
      },
    });
  }

  // Génère un tableau de couleurs pour le graphique.
  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${360 * Math.random()}, 50%, 50%)`); // Génère une couleur HSL aléatoire.
    }
    return colors;
  }

  // Charge les catégories depuis le service et les stocke dans 'this.categories'.
  loadCategories(): void {
    this._categoryService.getAll().subscribe((data) => {
      this.categories = data;
    });
  }

  // Associe les noms de catégorie aux dépenses en utilisant une Map pour un accès rapide.
  associateCategoryNames(
    expenses: Expense[],
    categories: ListCategory[]
  ): any[] {
    const categoryMap = new Map(categories.map((c) => [c.id, c.category_Name]));

    return expenses.map((expense) => ({
      ...expense,
      categoryName:
        categoryMap.get(expense.category_Id) || 'Catégorie Inconnue', // Associe le nom de la catégorie ou un placeholder si non trouvé.
    }));
  }

  // Renvoie le nom de la catégorie basé sur l'ID de la catégorie.
  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.category_Name : 'Catégorie Inconnue';
  }
}
