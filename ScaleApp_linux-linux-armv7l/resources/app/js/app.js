
//
// EXTERNALS
//

var PythonShell = require(__dirname + '/js/python-shell-moose.js');

var config = require(__dirname + '/config');



//
// ANGULAR APP REGISTRATION
//


var ShoppingCartApp = angular.module('ShoppingCart', ['ngAnimate']);

ShoppingCartApp.controller('MainController', ['$scope', '$http', '$interval', function($scope, $http, $interval){



	/*
	 * INIT
	 */

	$scope.host = 'http://admin.familyfruitmarket.ca/';
	$scope.room = config.room;
	$scope.transaction = {
		time: Date.now(),
		cashier: "Family Fruit Market",
		subtotal: 0.0,
		tax: 0.0,
		displayTotal: 0.0,
		tendered: 0.0,
		change: 0.0,
		shopping_cart: [
		]
	};
	$scope.data = '';
	$scope.socket;
	$scope.barcode = '';




	/*
	 *	INIT FUNCTION
	 */

	 $scope.init = function () {		
		
		/*
		 * SOCKETS
		 *	Get connection address, then set up the socket
		 */

		$scope.socket = io.connect($scope.host);

		$scope.socket.on('connection', function(data){
			console.log('SOCKET: Connection Successful: ' + JSON.stringify(data));
			console.log('SOCKET: Request to join ['+$scope.room+']');
			$scope.socket.emit('room', {room: $scope.room}); // received from route
		});

		// Server connects us to this room
		$scope.socket.on('room', function(data){
			console.log('SOCKET: Successfully joined room: ' + JSON.stringify(data));
		})

		$scope.socket.on('updateCart', function(data){
			// welcome the update
			$scope.transaction = data;
			// parse cashier name
			//data.cashier = camelize(data.cashier);
			data.cashier = data.cashier.toUpperCase();
			// auto-scroll the cart if overflow
			var cart = document.getElementsByClassName("cart")[0];
			cart.scrollTop = cart.scrollHeight;
		});

		$scope.socket.on('forceRefresh', function(data) {
			location.reload();
		});

		$scope.socket.on('readWeight', function(data){
			$scope.getPythonData();
		});


		$scope.socket.on('error', function (err){
			console.log(err);
		});


		//
		//	ADD LISTENER FOR BARCODE SCANNER
		//
		
		document.addEventListener('keydown', function(event) {
			for (var i = 0; i < 10; i++)
				if (event.keyCode == 48 + i)
					$scope.barcode += i;
			if (event.keyCode == 13) {
				$scope.socket.emit('sendBarcode', {code: $scope.barcode});
				$scope.barcode = '';
			}
		});


	 };


	/*
	 * FUNCTIONS
	 */

	$scope.getPythonData = function(){


		console.log('path: ' + __dirname);
		
		var options = {
			mode: 'text',
			pythonPath: '/etc/python3',
			scriptPath: __dirname 
		}

		PythonShell.run('serial.py', options, function(err, results){
			if (err) throw err;
			$scope.socket.emit('returnWeight', {weight: results[0]}); 
		});


	};

	// timer for clock
	$interval(function(){
		$scope.transaction.time = Date.now();
	}, 1000); // 1 second

	// not working? :(
    function camelize(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
      });
    }

    /*
     *	START
     */

     $scope.init();

}]);




