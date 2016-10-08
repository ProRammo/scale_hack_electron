//controller.js
console.log('in file controller.js (' + __dirname + ')');

var PythonShell = require(__dirname + '/python-shell-moose.js');

var App = angular.module('App', []);

App.controller('AppCtrl', function ($scope){
	
	$scope.data = '';

	$scope.getPythonData = function(){


		console.log('path: ' + __dirname);
		
		var options = {
			mode: 'text',
			//pythonPath: '/System/Library/Frameworks/Python.framework/Versions/2.7/lib/python27.zip',
			scriptPath: __dirname 
		}

		PythonShell.run('serial.py', options, function(err, results){
			if (err) throw err;
			$scope.data = results[0];
			$scope.$apply();
		
		});


	};

        
});