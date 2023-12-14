﻿using Backoffice_APP.Commands;
using StarterKitMvvm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace Backoffice_APP.ViewModels
{
    public class LoginViewModel : BaseViewModel
    {
        public event Action? LoginSuccessful;
        private string _username;

        public string Username
        {
            get { return _username; }
            set { _username = value; OnPropertyChanged(nameof(Username)); }
        }

        private string _password;

        public string Password
        {
            get { return _password; }
            set { _password = value; OnPropertyChanged(nameof(Password)); }
        }

        private bool _isLoading;

        public bool IsLoading
        {
            get { return _isLoading; }
            set { _isLoading = value; OnPropertyChanged(nameof(IsLoading)); }
        }

        private string _errorMessage;

        public string ErrorMessage
        {
            get { return _errorMessage; }
            set { _errorMessage = value; OnPropertyChanged(nameof(ErrorMessage)); }
        }

        public ICommand LoginCommand { get; set; }

        public LoginViewModel()
        {
            LoginCommand = new LoginCommand(this);
        }

        public void OnLoginSuccessful()
        {
            LoginSuccessful?.Invoke();
        }
    }
}
