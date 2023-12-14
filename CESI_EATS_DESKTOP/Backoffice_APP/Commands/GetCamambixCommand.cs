using Backoffice_APP.Models.Responses;
using Backoffice_APP.Services;
using Backoffice_APP.ViewModels;
using LiveCharts.Defaults;
using StarterKitMvvm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Backoffice_APP.Commands
{
    public class GetCamambixCommand : AsyncBaseCommand
    {
        private readonly DashboardViewModel _dashboardViewModel;
        private readonly GetCamambixService _getCamambixService;
        private readonly GetTypeService _getTypeService;

        public GetCamambixCommand(DashboardViewModel dashboardViewModel, GetCamambixService getCamambixService, GetTypeService getTypeService)
        {
            _dashboardViewModel = dashboardViewModel;
            _getCamambixService = getCamambixService;
            _getTypeService = getTypeService;
        }

        public override async Task ExecuteAsync(object parameter)
        {

            try
            {
                CamambixResponse camambixResponse = await _getCamambixService.GetCamambix();

                _dashboardViewModel.Accepte.Clear();
                _dashboardViewModel.Accepte.Add(new ObservableValue(camambixResponse.Accepte));

                _dashboardViewModel.Refuse.Clear();
                _dashboardViewModel.Refuse.Add(new ObservableValue(camambixResponse.Refuse));

                _dashboardViewModel.Attente.Clear();
                _dashboardViewModel.Attente.Add(new ObservableValue(camambixResponse.Attente));

                List<TypeResponse> typeResponse = await _getTypeService.GetType();
                
                List<ObservableValue> types = new List<ObservableValue>()
                {
                    { new ObservableValue(typeResponse.FindAll(r => r.restaurants_type.ToLower() == "pizza").Count) },
                    { new ObservableValue(typeResponse.FindAll(r => r.restaurants_type.ToLower() == "fast food").Count) },
                    { new ObservableValue(typeResponse.FindAll(r => r.restaurants_type.ToLower() == "français").Count) },
                    { new ObservableValue(typeResponse.FindAll(r => r.restaurants_type.ToLower() == "chinois").Count) },
                    { new ObservableValue(typeResponse.FindAll(r => r.restaurants_type.ToLower() == "kebab").Count) },
                    { new ObservableValue(typeResponse.FindAll(r => r.restaurants_type.ToLower() == "japonais").Count) },
 
                };

                _dashboardViewModel.Types.Clear();
                _dashboardViewModel.Types.AddRange(types);


            }
            catch (Exception e)
            {
                _dashboardViewModel.ErrorMessage = e.Message;
            }
        }
    }
}
