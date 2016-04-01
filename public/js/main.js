var app = angular.module('siten', ['ngResource']);

app.factory('User', function ($resource) {
    return $resource('home/user/:id', {id: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
});

app.controller('userCtrl', function ($scope, $http, User) {
    $http.get('home/common').success(function (data) {
        $scope.commons = data;
    });

    $scope.users = User.query(function () {
        $scope.addEmptyUser();
    });

    $scope.save = function (user) {
        if (!angular.isDefined(user.uid)) return;
        $scope.currentUser = new User(user);
        if (angular.isDefined(user.id)) {
            $scope.currentUser.$update(function(res){
                toastr.info('Lưu thành công!');
            });
        } else {
            $scope.currentUser.$save(function(res){
                toastr.info('Đăng ký thành công!');
            });
        }
    };

    $scope.addEmptyUser = function () {
        var newUser = new User();
        newUser.uid = leftPadding(String(1 + getMaxUid()), 4);
        $scope.users.push(newUser);
    };

    function getMaxUid() {
        var max = 0;
        for (var i in $scope.users) {
            var uid = parseInt($scope.users[i].uid) || 0;
            if (max < uid) {
                max = uid;
            }
        }
        return max;
    }
});


function leftPadding(input, n) {
    var input = (typeof input === 'string') ? input : '';
    if (input.length >= n)
        return input;
    var zeros = "0".repeat(n);
    return (zeros + input).slice(-1 * n)
}