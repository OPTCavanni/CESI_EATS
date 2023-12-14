using LiveCharts.Defaults;
using LiveCharts;
using StarterKitMvvm;
using System;
using System.Windows.Input;
using Backoffice_APP.Commands;
using Backoffice_APP.Services;

namespace Backoffice_APP.ViewModels
{
    public class DashboardViewModel : BaseViewModel
    {
        public string[] Labels { get; set; }

        private string _errorMessage;

        public string ErrorMessage
        {
            get { return _errorMessage; }
            set { _errorMessage = value; OnPropertyChanged(nameof(ErrorMessage)); }
        }

        private bool _isLoading;
        public bool IsLoading
        {
            get { return _isLoading; }
            set { _isLoading = value; OnPropertyChanged(nameof(IsLoading)); }
        }

        public ChartValues<ObservableValue> Types { get; }

        private ObservableValue _todayProfit;

        public ObservableValue TodayProfit
        {
            get { return _todayProfit; }
            set { 
                _todayProfit = value;
                OnPropertyChanged(nameof(TodayProfit));
            }
        }

        public ChartValues<ObservableValue> Attente { get; set; }
        public ChartValues<ObservableValue> Accepte { get; set; }
        public ChartValues<ObservableValue> Refuse { get; set; }

        private double _lastMonthIncome;
        public double LastMonthIncome
        {
            get { return _lastMonthIncome; }
            set { _lastMonthIncome = value; OnPropertyChanged(nameof(LastMonthIncome)); }
        }

        public Func<double, string> Formatter { get; set; }
        public Func<ChartPoint, string> PointLabel { get; set; }

        public ICommand GetCamambixCommand { get; }

        public DashboardViewModel()
        {
            Types = new ChartValues<ObservableValue>();

            Attente = new ChartValues<ObservableValue>();
            Accepte = new ChartValues<ObservableValue>();
            Refuse = new ChartValues<ObservableValue>();

            GetCamambixCommand = new GetCamambixCommand(this, new GetCamambixService(), new GetTypeService());
            GetCamambixCommand.Execute(null);

            Labels = new[] { "Pizza", "Fast Food", "Français", "Chinois", "Kebab", "Japonnnais"};

            Formatter = value => value.ToString("N");
            PointLabel = chartPoint => string.Format("{0} ({1:P})", chartPoint.Y, (chartPoint.Participation));
        }
    }
}
