import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { Expense } from '../../models/dashboard';
import { ListCategory } from 'src/app/features/category/models/category';
import { CategoryService } from 'src/app/features/category/services/category.service';

// Enregistrement de tous les types de graphiques disponibles dans Chart.js pour utilisation.
Chart.register(...registerables);

// Décorateur Component qui définit le sélecteur, le template HTML et le CSS pour ce composant.
@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss'],
})
export class DashboardChartComponent implements OnInit {
  // Référence à l'élément canvas dans le template HTML où le graphique Chart.js sera rendu.
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;

  // Propriétés pour stocker les états et les données du composant.
  chart: any; // Instance de Chart.js pour le graphique.
  selectedDate?: string; // Date sélectionnée pour filtrer les dépenses.
  selectedPeriodType = 'day'; // Type de période sélectionné (jour, semaine, mois, année).
  categories: ListCategory[] = []; // Liste des catégories chargées depuis le service.
  selectedCategoryId?: number | undefined; // ID de la catégorie sélectionnée pour filtrer.
  expenses: Expense[] = []; // Liste des dépenses chargées depuis le service.

  // Injection des services DashboardService et CategoryService.
  constructor(
    private _dashboardService: DashboardService,
    private _categoryService: CategoryService
  ) {}

  // Méthode appelée à l'initialisation du composant.
  ngOnInit(): void {
    this.selectedDate = this.getCurrentFormattedDate(); // Définit la date actuelle comme sélectionnée.
    this.loadCategories(); // Charge les catégories depuis le service.
    this.loadDataExpenseByPeriod(); // Charge les dépenses en fonction de la période sélectionnée.
  }

  // Récupère la date actuelle et la formate en yyyy-MM-dd.
  getCurrentFormattedDate(): string {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  }

  // Gère les changements de date sélectionnée par l'utilisateur.
  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value; // Met à jour la date sélectionnée.
    this.loadDataExpenseByPeriod(); // Recharge les données en fonction de la nouvelle date.
  }

  // Gère les changements de type de période (jour, semaine, mois, année).
  onPeriodTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPeriodType = select.value; // Met à jour le type de période sélectionné.
    this.loadDataExpenseByPeriod(); // Recharge les données pour la nouvelle période.
  }

  // Gère les changements de catégorie sélectionnée.
  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategoryId = selectElement.value ? Number(selectElement.value) : undefined;
    this.loadDataExpenseByPeriod(); // Recharge les données pour la nouvelle catégorie.
  }

  // Convertit une date au format attendu par le backend (dd/MM/yyyy).
  formatDateToBackendFormat(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

// Charge les données de dépenses en fonction de la période sélectionnée.
loadDataExpenseByPeriod(): void {
  // Formatte la date sélectionnée ou utilise la date actuelle si aucune date n'est sélectionnée.
  const formattedDate = this.formatDateToBackendFormat(this.selectedDate ? this.selectedDate : this.getCurrentFormattedDate());

  // Fonction de rappel pour traiter les données de dépenses.
  const dataCallback = (expensesData: Expense[]) => {
    // Associe les noms de catégorie aux dépenses et les stocke dans 'this.expenses'.
    this.expenses = this.associateCategoryNames(expensesData,this.categories);
    // Crée un graphique avec les données traitées.
    this.createChart(this.expenses);
  };

  // Structure conditionnelle pour charger les données en fonction de la période sélectionnée.
  switch (this.selectedPeriodType) {
    case 'day':
      // Charge les données de dépenses pour le jour sélectionné.
      this._dashboardService.getExpensesByDay(formattedDate, undefined, undefined, this.selectedCategoryId).subscribe(dataCallback);
      break;
    case 'week':
      // Charge les données de dépenses pour la semaine sélectionnée.
      this._dashboardService.getExpensesByWeek(formattedDate, undefined, undefined, this.selectedCategoryId).subscribe(dataCallback);
      break;
    case 'month':
      // Charge les données de dépenses pour le mois sélectionné.
      this._dashboardService.getExpensesByMonth(formattedDate, undefined, undefined, this.selectedCategoryId).subscribe(dataCallback);
      break;
    case 'year':
      // Charge les données de dépenses pour l'année sélectionnée.
      this._dashboardService.getExpensesByYear(formattedDate, undefined, undefined, this.selectedCategoryId).subscribe(dataCallback);
      break;
  }
}


 // Crée et configure le graphique avec les données fournies.
createChart(expenses: Expense[]): void {
  // Vérifie si un graphique existe déjà et le détruit pour éviter les superpositions.
  if (this.chart) {
    this.chart.destroy();
  }

  // Utilise une Map pour agréger les montants des dépenses par catégorie.
  const aggregatedData = new Map<string, number>();

  // Parcourt chaque dépense et accumule le montant dans la catégorie correspondante.
  expenses.forEach(expense => {
    const categoryName = this.getCategoryName(expense.category_Id);
    aggregatedData.set(categoryName, (aggregatedData.get(categoryName) || 0) + expense.amount);
  });

  // Prépare les données pour le graphique.
  const chartData = {
    datasets: [{
      // Utilise les montants agrégés pour les données du graphique.
      data: Array.from(aggregatedData.values()),
      // Appelle `generateColors` pour définir les couleurs des segments du graphique.
      backgroundColor: this.generateColors(),
      hoverOffset: 4,
    }],
    // Utilise les noms des catégories comme étiquettes pour le graphique.
    labels: Array.from(aggregatedData.keys()),
  };

  // Crée le graphique en utilisant la bibliothèque Chart.js avec les données et options définies.
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
          text: 'Dépenses par Catégorie',
        },
      },
    },
  });
}


  // Génère un tableau de couleurs pour le graphique.
  generateColors(): string[] {
    return [
      '#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78',
      '#2ca02c', '#98df8a', '#d62728', '#ff9896',
      '#9467bd', '#c5b0d5', '#8c564b', '#c49c94',
      '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7',
      '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
    ];
  }
  
  // Charge les catégories depuis le service et les stocke dans 'this.categories'.
  loadCategories(): void {
    this._categoryService.getAll().subscribe((data) => {
      this.categories = data;
    });
  }

  // Associe les noms de catégorie aux dépenses en utilisant une Map pour un accès rapide.
  associateCategoryNames(expenses: Expense[], categories: ListCategory[]): any[] {
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
