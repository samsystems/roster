'use strict';

angular.module('profile').controller('ProfileController', ['$scope', '$rootScope', '$stateParams', 'config', 'DateTimeService', 'toaster', 'User', '$validation',
    function ($scope, $rootScope, $stateParams, config, DateTimeService, toaster, User, $validation) {

    $scope.user = User.$find(User.getCurrentUserId());

    $scope.currentDate = DateTimeService.nowIsoFormat();

    $scope.notifications = [
        {"id": 1, "read": true, "author": {"fullName": "John Doe"}, "title": "Indonesia Tourism", "category" : "Created an photo album ", "date" : $scope.currentDate},
        {"id": 2, "read": true, "author": {"fullName": "Annisa"}, "title": "Yogyakarta never ending Asia", "category" : "Added 3 products", "date" : $scope.currentDate},
        {"id": 3, "read": true, "author": {"fullName": "Tiran Triftran"}, "title": "Indonesia Tourism", "category" : "Created an photo album ", "date" : $scope.currentDate},
        {"id": 4, "read": false, "author": {"fullName": "Hana Sartika"}, "title": "Lorem ipsum dolor...", "category" : "Send you a message ", "date" : $scope.currentDate},
        {"id": 5, "read": false, "author": {"fullName": "Johnny Depp"}, "title": "Lorem ipsum dolor...", "category" : "Updated his avatar", "date" : $scope.currentDate}
    ];

    $scope.save = function() {
        $validation.validate($scope, 'user').success(function() {

            if(!_.isEmpty($scope.user.password) && !_.isEmpty($scope.user.passwordConfirm) && $scope.user.password != $scope.user.passwordConfirm){
                toaster.pop('error', 'Error', 'Password doesn\'t match.');
                return false;
            }

            if(!_.isUndefined($scope.user.id)){
                $scope.user.$update({id: $scope.user.id}, function(response) {
                    $rootScope.userLogin = response;
                    $rootScope.$broadcast('user::updated', response);
                    toaster.pop('success', 'Profile updated', 'You have been successfully updated your profile.')
                });
            }
        }).error(function() {
            toaster.pop('error', 'Error', 'Complete the required entry fields.');
        });
    };

}]);